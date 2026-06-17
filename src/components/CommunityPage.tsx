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

const kindOptions: { value: CommunityPostKind; label: string }[] = [
  { value: 'question', label: 'Question' },
  { value: 'trip-report', label: 'Trip report' },
  { value: 'tip', label: 'Tip' },
];

function CommunityPostCard({ post, feed = false }: { post: CommunityPost; feed?: boolean }) {
  return (
    <article
      className={[
        feed ? 'community-feed-card' : 'community-card',
        post.isPinned ? 'community-feed-card--pinned' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="community-feed-card__header">
        <div className="community-avatar community-avatar--feed">{post.avatar}</div>
        <div className="community-feed-card__identity">
          <strong>{post.author}</strong>
          <span>
            {post.postedAgo}
            {' · '}
            {kindLabels[post.kind]}
          </span>
        </div>
        {post.isPinned ? <span className="community-pin-badge">Pinned</span> : null}
      </div>
      <p className="community-feed-card__message">{post.message}</p>
      {post.itineraryId || post.destinationSlug ? (
        <div className="community-post-links">
          {post.itineraryId ? (
            <a href={`#itineraries/${post.itineraryId}`}>Related itinerary →</a>
          ) : null}
          {post.destinationSlug ? (
            <a href={`#destination/${post.destinationSlug}`}>Related destination →</a>
          ) : null}
        </div>
      ) : null}
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
    <div className="community-suggestions">
      <strong>We might already have what you need</strong>
      <p>Check these before asking for a new route plan.</p>
      <div className="community-suggestion-links">
        <a href="#itineraries">Browse itineraries</a>
        <a href="#plan-ai">Plan with AI</a>
      </div>
      {suggestedItineraries.length > 0 ? (
        <ul className="community-suggestion-list">
          {suggestedItineraries.map((itinerary) => (
            <li key={itinerary.id}>
              <a href={`#itineraries/${itinerary.id}`}>
                {itinerary.title} · {itinerary.duration}
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
          I checked existing itineraries and still need help
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
  feed = false,
}: {
  posts: CommunityPost[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  feed?: boolean;
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
    <div className={feed ? 'community-feed-stream' : 'community-list'}>
      {posts.map((post) => (
        <CommunityPostCard key={post.id} feed={feed} post={post} />
      ))}
    </div>
  );
}

function CommunityComposer({
  onPosted,
}: {
  onPosted: (post: CommunityPost) => void;
}) {
  const { user, displayName, avatarInitials, isConfigured } = useAuth();
  const signedIn = isConfigured ? Boolean(user) : sessionStorage.getItem('safari-signed-in') === 'true';
  const [message, setMessage] = useState('');
  const [kind, setKind] = useState<CommunityPostKind>('question');
  const [checkedItineraries, setCheckedItineraries] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');

  const needsItineraryAck = looksLikeItineraryQuestion(message, kind);
  const canPost =
    message.trim().length > 0 && (!needsItineraryAck || checkedItineraries) && !posting;

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

      onPosted(saved);
      setMessage('');
      setCheckedItineraries(false);
    } catch {
      setPostError('Could not post right now. Try again.');
    } finally {
      setPosting(false);
    }
  };

  if (!signedIn) {
    return (
      <div className="community-composer-card community-composer-card--guest">
        <div className="community-composer-top">
          <div className="community-avatar community-avatar--feed">?</div>
          <p className="community-composer-placeholder">Sign in to ask questions and share trip updates.</p>
        </div>
        <div className="community-composer-footer">
          <a className="primary-button" href="#signin">
            Sign in to post
          </a>
        </div>
      </div>
    );
  }

  const initials = avatarInitials || displayName?.slice(0, 2).toUpperCase() || 'YO';

  return (
    <div className="community-composer-card">
      <div className="community-composer-top">
        <div className="community-avatar community-avatar--feed">{initials}</div>
        <label className="community-composer-field">
          <span className="sr-only">Write a community post</span>
          <textarea
            onChange={(event) => setMessage(event.target.value)}
            placeholder={`What's on your mind, ${displayName || 'traveler'}?`}
            rows={3}
            value={message}
          />
        </label>
      </div>

      <div className="community-kind-picker" role="group" aria-label="Post type">
        {kindOptions.map((option) => (
          <button
            key={option.value}
            className={kind === option.value ? 'active' : ''}
            onClick={() => setKind(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <ItinerarySuggestionPanel
        checkedItineraries={checkedItineraries}
        kind={kind}
        message={message}
        onCheckedChange={setCheckedItineraries}
      />

      <div className="community-composer-footer">
        <p className="community-composer-hint">Posting as {displayName || 'Traveler'}</p>
        <button className="primary-button" disabled={!canPost} onClick={() => void submitPost()} type="button">
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {postError ? <p className="auth-message">{postError}</p> : null}
    </div>
  );
}

export function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState('');

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

  const handlePosted = (post: CommunityPost) => {
    setPosts((current) => {
      const withoutDuplicate = current.filter((item) => item.id !== post.id);
      return [post, ...withoutDuplicate];
    });
  };

  return (
    <div className="community-page">
      <section className="community-hero">
        <div className="community-hero-overlay" aria-hidden="true" />
        <div className="community-hero-inner">
          <span className="eyebrow">Safiri community</span>
          <h1>Ask travelers. Share trips. Swap budget tips.</h1>
          <p>
            A live feed for Kenya budget travel — questions, trip reports, and advice from people on
            the road right now.
          </p>
        </div>
      </section>

      <section className="community-feed-shell">
        <div className="community-feed-column">
          <CommunityComposer onPosted={handlePosted} />
          <CommunityFeedList error={feedError} feed loading={loading} posts={posts} />
        </div>
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
        <p>Questions, trip reports, and budget tips from people exploring Kenya right now.</p>
      </div>
      <div className="community-preview-layout">
        <CommunityFeedList emptyMessage="No posts yet." feed loading={loading} posts={posts} />
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
