import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchSpotInquiries,
  postSpotInquiry,
  postSpotInquiryReply,
  type SpotInquiry,
} from '../services/spotInquiryApi';

type SpotInquiryPanelProps = {
  spotId: string;
  spotTitle: string;
  categoryId: string;
};

function initialsFromName(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function InquiryCard({
  inquiry,
  canReply,
  displayName,
  onReply,
}: {
  inquiry: SpotInquiry;
  canReply: boolean;
  displayName: string;
  onReply: (inquiryId: string, message: string) => Promise<void>;
}) {
  const [reply, setReply] = useState('');
  const [replying, setReplying] = useState(false);
  const [open, setOpen] = useState(false);

  const submitReply = async () => {
    if (!reply.trim()) {
      return;
    }

    setReplying(true);
    try {
      await onReply(inquiry.id, reply);
      setReply('');
      setOpen(false);
    } finally {
      setReplying(false);
    }
  };

  return (
    <article className="spot-inquiry-card">
      <div className="spot-inquiry-card__header">
        <div className="community-avatar">{initialsFromName(inquiry.authorName)}</div>
        <div>
          <strong>{inquiry.authorName}</strong>
          <span>{inquiry.postedAgo}</span>
        </div>
      </div>
      <p className="spot-inquiry-card__message">{inquiry.message}</p>

      {inquiry.replies.length > 0 ? (
        <div className="spot-inquiry-replies">
          {inquiry.replies.map((item) => (
            <article key={item.id} className="spot-inquiry-reply">
              <div className="spot-inquiry-card__header">
                <div className="community-avatar community-avatar--small">
                  {initialsFromName(item.authorName)}
                </div>
                <div>
                  <strong>{item.authorName}</strong>
                  <span>{item.postedAgo}</span>
                </div>
              </div>
              <p>{item.message}</p>
            </article>
          ))}
        </div>
      ) : null}

      {canReply ? (
        <div className="spot-inquiry-reply-compose">
          {open ? (
            <>
              <label>
                Your answer
                <textarea
                  placeholder={`Help ${inquiry.authorName} with what you know about ${displayName}...`}
                  rows={3}
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                />
              </label>
              <div className="spot-inquiry-reply-actions">
                <button
                  className="primary-button"
                  disabled={replying || !reply.trim()}
                  onClick={() => void submitReply()}
                  type="button"
                >
                  Post answer
                </button>
                <button className="ghost-link" onClick={() => setOpen(false)} type="button">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <button className="secondary-button compact-button" onClick={() => setOpen(true)} type="button">
              Answer this question
            </button>
          )}
        </div>
      ) : null}
    </article>
  );
}

export function SpotInquiryPanel({ spotId, spotTitle, categoryId }: SpotInquiryPanelProps) {
  const { user, displayName, isConfigured } = useAuth();
  const signedIn = isConfigured ? Boolean(user) : sessionStorage.getItem('safari-signed-in') === 'true';
  const [inquiries, setInquiries] = useState<SpotInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [posting, setPosting] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await fetchSpotInquiries(spotId);
      setInquiries(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInquiries();
  }, [spotId]);

  const submitInquiry = async () => {
    if (!question.trim()) {
      return;
    }

    setPosting(true);
    setMessage('');

    try {
      const saved = await postSpotInquiry({
        spotId,
        spotTitle,
        categoryId,
        userId: user?.id,
        authorName: displayName || 'Traveler',
        message: question,
      });

      if (!saved) {
        setMessage('Could not send your inquiry. Try again.');
        return;
      }

      setInquiries((current) => [saved, ...current]);
      setQuestion('');
      setComposeOpen(false);
      setMessage('Your question was posted. Other travelers can answer here.');
    } finally {
      setPosting(false);
    }
  };

  const submitReply = async (inquiryId: string, replyMessage: string) => {
    const saved = await postSpotInquiryReply({
      inquiryId,
      userId: user?.id,
      authorName: displayName || 'Traveler',
      message: replyMessage,
    });

    if (!saved) {
      setMessage('Could not post your answer. Try again.');
      return;
    }

    setInquiries((current) =>
      current.map((inquiry) =>
        inquiry.id === inquiryId
          ? { ...inquiry, replies: [...inquiry.replies, saved] }
          : inquiry,
      ),
    );
  };

  return (
    <section className="spot-inquiry-panel glass-panel">
      <div className="spot-inquiry-panel__header">
        <div>
          <span className="eyebrow">Questions about this spot</span>
          <h2>Ask travelers who have been here</h2>
          <p>Post a question about {spotTitle}. Anyone signed in can share what they know.</p>
        </div>
        {signedIn ? (
          <button
            className="primary-button"
            onClick={() => setComposeOpen((current) => !current)}
            type="button"
          >
            {composeOpen ? 'Close inquiry form' : 'Make inquiry'}
          </button>
        ) : (
          <a className="primary-button" href="#signin">
            Sign in to inquire
          </a>
        )}
      </div>

      {composeOpen && signedIn ? (
        <div className="spot-inquiry-compose">
          <label>
            Your question
            <textarea
              placeholder="Costs, transport, best time to visit, what to pack..."
              rows={4}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
          </label>
          <button
            className="primary-button"
            disabled={posting || !question.trim()}
            onClick={() => void submitInquiry()}
            type="button"
          >
            Send inquiry
          </button>
        </div>
      ) : null}

      {message ? <p className="auth-message">{message}</p> : null}

      {loading ? <p className="community-empty">Loading inquiries...</p> : null}
      {!loading && inquiries.length === 0 ? (
        <p className="community-empty">No questions yet. Be the first to ask about this spot.</p>
      ) : null}

      <div className="spot-inquiry-list">
        {inquiries.map((inquiry) => (
          <InquiryCard
            key={inquiry.id}
            canReply={signedIn}
            displayName={spotTitle}
            inquiry={inquiry}
            onReply={submitReply}
          />
        ))}
      </div>
    </section>
  );
}
