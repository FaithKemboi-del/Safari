import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrails } from '../context/TrailsContext';
import type { SavannaTrail } from '../data/savannaTrails';
import { parseGpx } from '../lib/trailUtils';
import { buildTrailFromRoute, createTrail } from '../services/trailsApi';
import { TrailMap } from './TrailMap';

export function CreateTrailForm() {
  const { user, isConfigured } = useAuth();
  const { refreshTrails } = useTrails();
  const signedIn = isConfigured ? Boolean(user) : sessionStorage.getItem('safari-signed-in') === 'true';

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('From $5 entry');
  const [difficulty, setDifficulty] = useState<SavannaTrail['difficulty']>('moderate');
  const [routeType, setRouteType] = useState<SavannaTrail['routeType']>('out-and-back');
  const [coordinates, setCoordinates] = useState<SavannaTrail['coordinates']>([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const previewTrail = useMemo(() => {
    if (coordinates.length < 2 || !title.trim() || !location.trim()) {
      return null;
    }

    return buildTrailFromRoute({
      title: title.trim(),
      location: location.trim(),
      description: description.trim() || 'Community-submitted trail on Savanna Luxe.',
      budget: budget.trim(),
      difficulty,
      routeType,
      coordinates,
    });
  }, [budget, coordinates, description, difficulty, location, routeType, title]);

  const handleGpxUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    try {
      const xml = await file.text();
      const points = parseGpx(xml);

      if (points.length < 2) {
        setMessage('Could not read a valid route from that GPX file. Try another export.');
        return;
      }

      setCoordinates(points);
      setMessage(`Loaded ${points.length} points from GPX. Add details and publish.`);
    } catch (uploadError) {
      console.error('Failed to read GPX file:', uploadError);
      setMessage('Could not read that GPX file. Try another export.');
    }
  };

  const publishTrail = async () => {
    if (!previewTrail) {
      setMessage('Upload a GPX file and fill in trail name + location first.');
      return;
    }

    if (!signedIn) {
      setMessage('Sign in to publish a trail for other hikers.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const result = await createTrail({
        userId: user?.id,
        trail: previewTrail,
      });

      await refreshTrails();
      setMessage(
        result.source === 'cloud'
          ? `Trail published: ${result.trail.title}. Open it from the list below.`
          : `Trail saved on this device only: ${result.trail.title}. Cloud publish failed — try again when signed in with Supabase configured.`,
      );
      setTitle('');
      setLocation('');
      setDescription('');
      setCoordinates([]);
    } catch (publishError) {
      console.error('Failed to publish trail:', publishError);
      setMessage('Could not publish that trail. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-trail-form">
      <div className="section-intro">
        <h2>Create a trail</h2>
        <p>
          Upload a GPX file from your phone or watch, add details, and share the route with other
          Share GPX routes with the community on Savanna Trails — free maps and reviews for
          budget hikers.
        </p>
      </div>

      {!signedIn && (
        <div className="community-signin-prompt">
          <p>Sign in to publish trails to your account and sync them across devices.</p>
          <a className="primary-button" href="#signin">
            Sign in
          </a>
        </div>
      )}

      <form
        className="hike-record-form"
        onSubmit={(event) => {
          event.preventDefault();
          void publishTrail();
        }}
      >
        <label>
          GPX route file
          <input
            accept=".gpx,application/gpx+xml"
            onChange={(event) => void handleGpxUpload(event.target.files?.[0] ?? null)}
            type="file"
          />
        </label>

        <div className="form-grid">
          <label>
            Trail name
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Karura waterfall loop"
            />
          </label>
          <label>
            Location
            <input
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Nairobi"
            />
          </label>
          <label>
            Budget estimate
            <input value={budget} onChange={(event) => setBudget(event.target.value)} />
          </label>
          <label>
            Difficulty
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as SavannaTrail['difficulty'])}
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </label>
          <label>
            Route type
            <select
              value={routeType}
              onChange={(event) => setRouteType(event.target.value as SavannaTrail['routeType'])}
            >
              <option value="loop">Loop</option>
              <option value="out-and-back">Out and back</option>
              <option value="point-to-point">Point to point</option>
            </select>
          </label>
        </div>

        <label>
          Description
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What makes this trail worth it on a budget?"
          />
        </label>

        {previewTrail && (
          <div className="create-trail-preview">
            <TrailMap route={previewTrail.coordinates} waypoints={previewTrail.waypoints} height="14rem" />
            <p>
              Preview: {previewTrail.distanceKm} km · {previewTrail.elevationGainM} m gain
            </p>
          </div>
        )}

        {message && <p className="auth-message">{message}</p>}

        <button className="primary-button" disabled={submitting || !previewTrail} type="submit">
          {submitting ? 'Publishing...' : 'Publish trail'}
        </button>
      </form>
    </div>
  );
}
