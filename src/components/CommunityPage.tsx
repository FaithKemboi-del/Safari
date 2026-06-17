import { useEffect, useMemo, useState } from 'react';
import type { CommunityPost, CommunityPostKind } from '../data';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  looksLikeItineraryQuestion,
  suggestDestinationsForMessage,
  suggestItinerariesForMessage,
} from '../lib/communitySuggestions';
import { fetchGlobalCommunityPosts, postGlobalCommunityPost } from '../services/communityApi';

const kindLabels: Record<CommunityPostKind, string> = {
  question: 'Question',
  'trip-report': 'Trip report',
  tip: 'Tip',
};

function CommunityPostCard({ post }: { post: CommunityPost }) {
  return (
    <article className={`community-card ${post.isPinned ? 'community-card--pinned' : ''}`}>
      <div className="community-avatar">{post.avatar}</div>
      <div className="community-body">
        <div className="community-meta">
          <strong>{post.author}</strong>
          <span>{post.postedAgo}</span>
          <span className="community-kind-badge">{kindLabels[post.kind]}</span>
          {post.isPinned ? <span className="community-pin-badge">Pinned</span> : null}
        </div>
        <p>{post.message}</p>
        <div className="community-post-links">
          {post.itineraryId ? (
            <a href={`#itineraries/${post.itineraryId}`}>Related itinerary →</a>
          ) : null}
          {post.destinationSlug ? (
            <a href={`#destination/${post.destinationSlug}`}>Related destination →</a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ItinerarySuggestionPanel({
  message,
  kind,
  checkedItineraries,
  onCheckedChange,
}: {
  message: string;
  kind: CommunityPostKind;
  checkedItineraries: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const { destinations, itineraries } = useData();
  const showPlanningHelp = looksLikeItineraryQuestion(message, kind);
  const suggestedItineraries = useMemo(
    () => suggestItinerariesForMessage(message, itineraries),
    [message, itineraries],
  );
  const suggestedDestinations = useMemo(
    () => suggestDestinationsForMessage(message, destinations),
    [message, destinations],
  );

  if (!showPlanningHelp && suggestedItineraries.length === 0 && suggestedDestinations.length === 0) {
    return null;
  }

  return (
    <div className="community-suggestions glass-panel">
      <strong>We might already have what you need</strong>
      <p>
        Check these before posting a new route question — most classic Kenya trips are already on
        Safiri.
      </p>
      <div className="community-suggestion-links">
        <a href="#itineraries">Browse all itineraries</a>
        <a href="#plan-ai">Plan with AI</a>
      </div>
      {suggestedItineraries.length > 0 ? (
        <ul className="community-suggestion-list">
          {suggestedItineraries.map((itinerary) => (
            <li key={itinerary.id}>
              <a href={`#itineraries/${itinerary.id}`}>
                {itinerary.title} · {itinerary.duration} · {itinerary.price}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {suggestedDestinations.length > 0 ? (
        <ul className="community-suggestion-list">
          {suggestedDestinations.map((destination) => (
            <li key={destination.slug}>
              <a href={`#destination/${destination.slug}`}>
                {destination.title} · {destination.location}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {showPlanningHelp ? (
        <label className="checkbox-field community-check-field">
          <input
            checked={checkedItineraries}
            onChange={(event) => onCheckedChange(event.target.checked)}
            type="checkbox"
          />
          I checked existing itineraries and still need community help
        </label>
      ) : null}
    </div>
  );
}

export function CommunityFeedList({
  posts,
  loading,
  error,
  emptyMessage = 'No posts yet. Be the first to ask or share a tip.',
}: {
  posts: CommunityPost[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}) {
  if (loading) {
    return <p className="community-empty">Loading community posts...</p>;
  }

  if (error) {
    return <p className="auth-message">{error}</p>;
  }

  if (posts.length === 0) {
    return <p className="community-empty">{emptyMessage}</p>;
  }

  return (
    <div className="community-list">
      {posts.map((post) => (
        <CommunityPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export function CommunityPage() {
  const { user, displayName, isConfigured } = useAuth();
  const signedIn = isConfigured ? Boolean(user) : sessionStorage.getItem('safari-signed-in') === 'true';
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState('');
  const [message, setMessage] = useState('');
  const [kind, setKind] = useState<CommunityPostKind>('question');
  const [checkedItineraries, setCheckedItineraries] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');

  const needsItineraryAck = looksLikeItineraryQuestion(message, kind);
  const canPost =
    message.trim().length > 0 && (!needsItineraryAck || checkedItineraries) && !posting;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFeedError('');

    void fetchGlobalCommunityPosts()
      .then((data) => {
        if (active) {
          setPosts(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setFeedError('Could not load community posts.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const submitPost = async () => {
    if (!canPost) {
      return;
    }

    setPosting(true);
    setPostError('');

    try {
      const saved = await postGlobalCommunityPost({
        userId: user?.id,
        authorName: signedIn ? displayName || 'Traveler' : 'Guest',
        message: message.trim(),
        kind,
      });

      if (!saved) {
        setPostError('Could not post right now. Try again in a moment.');
        return;
      }

      setPosts((current) => {
        const withoutDuplicate = current.filter((post) => post.id !== saved.id);
        return [saved, ...withoutDuplicate];
      });
      setMessage('');
      setCheckedItineraries(false);
    } catch {
      setPostError('Could not post right now. Try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="community-page">
      <section className="page-hero community-page-hero">
        <span className="eyebrow">Safiri community</span>
        <h1>Ask travelers, share trips, swap budget tips</h1>
        <p>
          Open to everyone to read. Sign in to post questions, recent travel stories, and on-the-ground
          advice. For ready-made routes, start with our itineraries — you do not need to wait for admin.
        </p>
      </section>

      <section className="section community-page-layout">
        <div className="community-compose community-compose--page">
          {signedIn ? (
            <>
              <label>
                Post type
                <select value={kind} onChange={(event) => setKind(event.target.value as CommunityPostKind)}>
                  <option value="question">Question</option>
                  <option value="trip-report">Trip report</option>
                  <option value="tip">Tip</option>
                </select>
              </label>
              <label>
                Your message
                <textarea
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ask about transport, share what you spent, or post a recent travel update..."
                  rows={4}
                  value={message}
                />
              </label>
              <ItinerarySuggestionPanel
                checkedItineraries={checkedItineraries}
                kind={kind}
                message={message}
                onCheckedChange={setCheckedItineraries}
              />
              <button className="primary-button" disabled={!canPost} onClick={() => void submitPost()} type="button">
                {posting ? 'Posting...' : 'Post to community'}
              </button>
              {postError ? <p className="auth-message">{postError}</p> : null}
            </>
          ) : (
            <div className="community-signin-prompt">
              <p>Sign in to post questions and travel updates.</p>
              <a className="primary-button" href="#signin">
                Sign in
              </a>
            </div>
          )}
        </div>

        <CommunityFeedList error={feedError} loading={loading} posts={posts} />
      </section>
    </div>
  );
}

export function CommunityFeedPreview() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void fetchGlobalCommunityPosts(3).then((data) => {
      if (active) {
        setPosts(data.filter((post) => !post.isPinned).slice(0, 3));
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section community-preview-section">
      <div className="section-intro">
        <span className="eyebrow">Ask the community</span>
        <h2>Latest posts from travelers</h2>
        <p>
          Questions, trip reports, and budget tips from people exploring Kenya right now — no tour
          package required.
        </p>
      </div>
      <div className="community-preview-layout">
        <CommunityFeedList
          emptyMessage="No posts yet."
          loading={loading}
          posts={posts}
        />
        <div className="community-preview-actions">
          <a className="primary-button" href="#community">
            Join the conversation
          </a>
          <a className="secondary-button" href="#itineraries">
            Browse itineraries first
          </a>
        </div>
      </div>
    </section>
  );
}
