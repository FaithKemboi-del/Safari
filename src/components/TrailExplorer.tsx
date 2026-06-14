import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  SAVANNA_TRAILS_KEY,
  seedTrailReviews,
  type SavannaTrail,
  type TrailReview,
} from '../data/savannaTrails';
import { buildGpx, downloadTextFile } from '../lib/trailUtils';
import { readJson, writeJson } from '../lib/storage';
import { fetchTrailReviews, postTrailReview } from '../services/trailsApi';
import { ElevationChart } from './ElevationChart';
import { HikeGpsRecorder } from './HikeGpsRecorder';
import { TrailMap } from './TrailMap';

type TrailExplorerProps = {
  trail: SavannaTrail;
  compact?: boolean;
};

const difficultyLabels: Record<SavannaTrail['difficulty'], string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
  expert: 'Expert',
};

export function TrailExplorer({ trail, compact = false }: TrailExplorerProps) {
  const { user, displayName, isConfigured } = useAuth();
  const signedIn = isConfigured ? Boolean(user) : sessionStorage.getItem('safari-signed-in') === 'true';
  const [reviews, setReviews] = useState<TrailReview[]>([]);
  const [reviewsError, setReviewsError] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showRecorder, setShowRecorder] = useState(false);

  useEffect(() => {
    let active = true;
    setReviewsError('');

    void fetchTrailReviews(trail.id)
      .then((remote) => {
        if (!active) {
          return;
        }

        const local = readJson<TrailReview[]>(SAVANNA_TRAILS_KEY, []);
        const seeded = seedTrailReviews.filter((review) => review.trailId === trail.id);
        const localForTrail = local.filter((review) => review.trailId === trail.id);
        setReviews([...remote, ...localForTrail, ...seeded]);
      })
      .catch((loadError) => {
        console.error('Failed to load trail reviews:', loadError);
        if (active) {
          setReviewsError('Could not load reviews. Try refreshing the page.');
        }
      });

    return () => {
      active = false;
    };
  }, [trail.id]);

  const submitReview = async () => {
    if (!comment.trim()) {
      return;
    }

    setReviewMessage('');

    try {
      if (user?.id) {
        const saved = await postTrailReview({
          trailId: trail.id,
          userId: user.id,
          authorName: displayName || 'You',
          rating,
          comment: comment.trim(),
        });

        if (saved) {
          setReviews((current) => [saved, ...current]);
          setComment('');
          return;
        }

        setReviewMessage('Could not save your review to your account. Saved on this device instead.');
      }

      const review: TrailReview = {
        id: `review-${Date.now()}`,
        trailId: trail.id,
        author: signedIn ? displayName || 'You' : 'Guest',
        rating,
        comment: comment.trim(),
        postedAgo: 'Just now',
      };

      const local = readJson<TrailReview[]>(SAVANNA_TRAILS_KEY, []);
      const next = [review, ...local];
      const writeResult = writeJson(SAVANNA_TRAILS_KEY, next);

      if (!writeResult.ok) {
        setReviewMessage(writeResult.error);
        return;
      }

      setReviews((current) => [review, ...current]);
      setComment('');
    } catch (submitError) {
      console.error('Failed to submit trail review:', submitError);
      setReviewMessage('Could not save your review. Try again.');
    }
  };

  const gpxPoints = trail.coordinates.map((point, index) => ({
    ...point,
    timestamp: new Date(Date.now() + index * 60000).toISOString(),
    elevationM: trail.elevationProfile[Math.min(index, trail.elevationProfile.length - 1)]?.elevationM,
  }));

  return (
    <div className={`trail-explorer ${compact ? 'trail-explorer--compact' : ''}`}>
      <div className="trail-explorer-stats">
        <div>
          <small>Distance</small>
          <strong>{trail.distanceKm} km</strong>
        </div>
        <div>
          <small>Elevation gain</small>
          <strong>{trail.elevationGainM} m</strong>
        </div>
        <div>
          <small>Route type</small>
          <strong>{trail.routeType.replace('-', ' ')}</strong>
        </div>
        <div>
          <small>Difficulty</small>
          <strong className={`trail-difficulty trail-difficulty--${trail.difficulty}`}>
            {difficultyLabels[trail.difficulty]}
          </strong>
        </div>
      </div>

      <TrailMap
        route={trail.coordinates}
        waypoints={trail.waypoints}
        height={compact ? '16rem' : '22rem'}
      />

      <ElevationChart profile={trail.elevationProfile} />

      <div className="trail-waypoints">
        <h4>Waypoints</h4>
        <ul>
          {trail.waypoints.map((waypoint) => (
            <li key={waypoint.id}>
              <span className={`waypoint-kind waypoint-kind--${waypoint.kind}`}>{waypoint.kind}</span>
              <strong>{waypoint.name}</strong>
              {waypoint.elevationM && <small>{waypoint.elevationM} m</small>}
            </li>
          ))}
        </ul>
      </div>

      <div className="trail-actions">
        <a className="primary-button" href={trail.googleMapsUrl} rel="noreferrer" target="_blank">
          Directions to trailhead
        </a>
        <button
          className="secondary-button"
          onClick={() =>
            downloadTextFile(
              `${trail.id}.gpx`,
              buildGpx({ name: trail.title, points: gpxPoints }),
              'application/gpx+xml',
            )
          }
          type="button"
        >
          Download route (GPX)
        </button>
        <a className="ghost-link" href={`#trail/${trail.id}`}>
          Full trail page
        </a>
        <button
          className="secondary-button compact-button"
          onClick={() => setShowRecorder((current) => !current)}
          type="button"
        >
          {showRecorder ? 'Hide GPS recorder' : 'Record hike with GPS'}
        </button>
      </div>

      {trail.tips.length > 0 && (
        <div className="trail-tips">
          <h4>Budget hiker tips</h4>
          <ul>
            {trail.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {showRecorder && <HikeGpsRecorder filterTrailId={trail.id} trail={trail} />}

      <div className="trail-reviews">
        <div className="trail-reviews-header">
          <h4>Trail reviews</h4>
          <span>{reviews.length} hiker{reviews.length === 1 ? '' : 's'}</span>
        </div>
        {reviewsError ? <p className="auth-message">{reviewsError}</p> : null}
        <div className="community-list">
          {reviews.map((review) => (
            <article key={review.id} className="community-card">
              <div className="community-avatar">{review.author.slice(0, 2).toUpperCase()}</div>
              <div className="community-body">
                <div className="community-meta">
                  <strong>{review.author}</strong>
                  <span>{review.postedAgo}</span>
                  <span className="trail-rating">{'★'.repeat(review.rating)}</span>
                </div>
                <p>{review.comment}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="community-compose">
          {signedIn ? (
            <>
              <label>
                Rate this trail
                <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} stars
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Your review
                <textarea
                  placeholder="Trail conditions, costs, what to pack..."
                  rows={3}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                />
              </label>
            <button className="primary-button" onClick={() => void submitReview()} type="button">
              Post review
            </button>
            {reviewMessage ? <p className="auth-message">{reviewMessage}</p> : null}
            </>
          ) : (
            <div className="community-signin-prompt">
              <p>Sign in to leave a trail review for other budget hikers.</p>
              <a className="primary-button" href="#signin">
                Sign in
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
