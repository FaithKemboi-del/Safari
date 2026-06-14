import { useEffect, useRef, useState } from 'react';
import {
  buildGpx,
  downloadTextFile,
  formatDistance,
  formatDuration,
  polylineDistanceKm,
  type GpsPoint,
} from '../lib/trailUtils';
import type { RecordedHikeTrack, SavannaTrail } from '../data/savannaTrails';
import { fetchUserHikeTracks, saveHikeTrack, syncLocalTracksToCloud } from '../services/trailsApi';
import { useAuth } from '../context/AuthContext';
import { TrailMap } from './TrailMap';

type HikeGpsRecorderProps = {
  trail?: SavannaTrail;
  trailOptions?: SavannaTrail[];
  showTrailPicker?: boolean;
  filterTrailId?: string;
};

export function HikeGpsRecorder({
  trail,
  trailOptions = [],
  showTrailPicker = false,
  filterTrailId,
}: HikeGpsRecorderProps) {
  const { user, isConfigured } = useAuth();
  const signedIn = isConfigured ? Boolean(user) : sessionStorage.getItem('safari-signed-in') === 'true';

  const [selectedTrailId, setSelectedTrailId] = useState(trail?.id ?? trailOptions[0]?.id ?? '');
  const activeTrail =
    trail ?? trailOptions.find((item) => item.id === selectedTrailId) ?? trailOptions[0];

  const [isRecording, setIsRecording] = useState(false);
  const [points, setPoints] = useState<GpsPoint[]>([]);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const [savedTracks, setSavedTracks] = useState<RecordedHikeTrack[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const loadTracks = async () => {
    setLoadingTracks(true);
    setError('');

    try {
      const tracks = await fetchUserHikeTracks(user?.id ?? '');
      setSavedTracks(tracks);
    } catch (loadError) {
      console.error('Failed to load hike recordings:', loadError);
      setError('Could not load your recordings. Try refreshing the page.');
    } finally {
      setLoadingTracks(false);
    }
  };

  useEffect(() => {
    void loadTracks();
  }, [user?.id]);

  useEffect(() => {
    if (trail?.id) {
      setSelectedTrailId(trail.id);
    }
  }, [trail?.id]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (timerRef.current != null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = () => {
    if (!navigator.geolocation) {
      setError('GPS is not supported on this device.');
      return;
    }

    setError('');
    setSyncMessage('');
    setPoints([]);
    setElapsedSeconds(0);
    const startTime = new Date().toISOString();
    setStartedAt(startTime);
    setIsRecording(true);

    timerRef.current = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const point: GpsPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          elevationM: position.coords.altitude ?? undefined,
          timestamp: new Date(position.timestamp).toISOString(),
        };
        setPoints((current) => [...current, point]);
      },
      (geoError) => {
        setError(geoError.message || 'Could not access your location. Enable GPS and try again.');
        stopRecording();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    );
  };

  const stopRecording = () => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
  };

  const saveTrack = async () => {
    if (!startedAt || points.length < 2) {
      return;
    }

    const trailName = activeTrail?.title ?? 'Free hike';
    const endedAt = new Date().toISOString();

    try {
      const saved = await saveHikeTrack({
        userId: user?.id,
        trailId: activeTrail?.id,
        trailName,
        points,
        startedAt,
        endedAt,
      });

      setSavedTracks((current) => [saved, ...current.filter((track) => track.id !== saved.id)]);
      setPoints([]);
      setStartedAt(null);
      setElapsedSeconds(0);
      setSyncMessage(
        saved.synced
          ? 'Track saved to your account — available on any signed-in device.'
          : 'Track saved on this device. Sign in to sync across devices.',
      );
    } catch (saveError) {
      console.error('Failed to save hike track:', saveError);
      setError('Could not save this recording. Check storage space and try again.');
    }
  };

  const syncTracks = async () => {
    if (!user?.id) {
      setSyncMessage('Sign in to sync your recordings to the cloud.');
      return;
    }

    setSyncMessage('');

    try {
      const { synced, failed } = await syncLocalTracksToCloud(user.id);
      await loadTracks();

      if (synced > 0 && failed === 0) {
        setSyncMessage(`Synced ${synced} local recording(s) to your account.`);
      } else if (synced > 0 && failed > 0) {
        setSyncMessage(`Synced ${synced} recording(s). ${failed} could not reach the cloud — try again later.`);
      } else if (failed > 0) {
        setError(`Could not sync ${failed} recording(s) to the cloud. Try again when you are online.`);
      } else {
        setSyncMessage('All recordings are already synced.');
      }
    } catch (syncError) {
      console.error('Failed to sync hike recordings:', syncError);
      setError('Could not sync recordings right now. Try again.');
    }
  };

  const visibleTracks = savedTracks.filter((track) =>
    filterTrailId ? track.trailId === filterTrailId : true,
  );

  const liveDistance = polylineDistanceKm(points);
  const mapRoute = activeTrail?.coordinates ?? (points.length > 1 ? points : []);

  return (
    <div className="gps-recorder">
      <div className="gps-recorder-header">
        <div>
          <span className="eyebrow">Live GPS tracking</span>
          <h3>Record your hike on the trail</h3>
          <p>
            Free built-in tracking — no subscription. Saves to your account when signed in, or on
            this device when offline.
          </p>
        </div>
        <div className="gps-live-stats">
          <div>
            <small>Time</small>
            <strong>{formatDuration(elapsedSeconds)}</strong>
          </div>
          <div>
            <small>Distance</small>
            <strong>{formatDistance(liveDistance)}</strong>
          </div>
          <div>
            <small>Points</small>
            <strong>{points.length}</strong>
          </div>
        </div>
      </div>

      {showTrailPicker && trailOptions.length > 0 && (
        <label>
          Trail you are hiking
          <select value={selectedTrailId} onChange={(event) => setSelectedTrailId(event.target.value)}>
            {trailOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
            <option value="">Free recording (no preset trail)</option>
          </select>
        </label>
      )}

      {error && <p className="auth-message">{error}</p>}
      {syncMessage && <p className="auth-message">{syncMessage}</p>}

      <TrailMap
        route={mapRoute}
        waypoints={activeTrail?.waypoints ?? []}
        liveTrack={points}
        height="16rem"
      />

      <div className="gps-recorder-actions">
        {!isRecording ? (
          <button className="primary-button" onClick={startRecording} type="button">
            Start GPS recording
          </button>
        ) : (
          <>
            <button className="secondary-button" onClick={stopRecording} type="button">
              Stop recording
            </button>
            <button
              className="primary-button"
              disabled={points.length < 2}
              onClick={() => void saveTrack()}
              type="button"
            >
              Save track
            </button>
          </>
        )}
        {points.length > 1 && (
          <button
            className="ghost-link"
            onClick={() =>
              downloadTextFile(
                `${activeTrail?.id ?? 'hike'}-live.gpx`,
                buildGpx({ name: activeTrail?.title ?? 'Savanna hike', points }),
                'application/gpx+xml',
              )
            }
            type="button"
          >
            Export live track (GPX)
          </button>
        )}
        {signedIn && user?.id && (
          <button className="secondary-button compact-button" onClick={() => void syncTracks()} type="button">
            Sync local recordings
          </button>
        )}
      </div>

      <div className="gps-saved-tracks">
        <h4>Your saved recordings</h4>
        {loadingTracks && <p className="community-empty">Loading recordings...</p>}
        {!loadingTracks && visibleTracks.length === 0 && (
          <p className="community-empty">No recordings yet. Start GPS tracking above.</p>
        )}
        {visibleTracks.slice(0, 5).map((track) => (
          <article key={track.id} className="hike-record-card">
            <strong>{track.trailName}</strong>
            <span>{new Date(track.startedAt).toLocaleString()}</span>
            <small>
              {formatDistance(track.distanceKm)}
              {track.synced ? ' · Synced' : ' · On this device'}
            </small>
            <button
              className="ghost-link"
              onClick={() =>
                downloadTextFile(
                  `${track.id}.gpx`,
                  buildGpx({ name: track.trailName, points: track.points }),
                  'application/gpx+xml',
                )
              }
              type="button"
            >
              Download GPX
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
