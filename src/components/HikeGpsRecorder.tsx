import { useEffect, useRef, useState } from 'react';
import {
  buildGpx,
  downloadTextFile,
  formatDistance,
  formatDuration,
  polylineDistanceKm,
  type GpsPoint,
} from '../lib/trailUtils';
import {
  SAVANNA_GPS_TRACKS_KEY,
  type RecordedHikeTrack,
  type SavannaTrail,
} from '../data/savannaTrails';
import { TrailMap } from './TrailMap';

type HikeGpsRecorderProps = {
  trail: SavannaTrail;
};

export function HikeGpsRecorder({ trail }: HikeGpsRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [points, setPoints] = useState<GpsPoint[]>([]);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState('');
  const [savedTracks, setSavedTracks] = useState<RecordedHikeTrack[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SAVANNA_GPS_TRACKS_KEY);
    if (stored) {
      setSavedTracks(JSON.parse(stored) as RecordedHikeTrack[]);
    }
  }, []);

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

  const saveTrack = () => {
    if (!startedAt || points.length < 2) {
      return;
    }

    const track: RecordedHikeTrack = {
      id: `track-${Date.now()}`,
      trailId: trail.id,
      trailName: trail.title,
      startedAt,
      endedAt: new Date().toISOString(),
      points,
      distanceKm: polylineDistanceKm(points),
    };

    const next = [track, ...savedTracks];
    setSavedTracks(next);
    localStorage.setItem(SAVANNA_GPS_TRACKS_KEY, JSON.stringify(next));
    setPoints([]);
    setStartedAt(null);
    setElapsedSeconds(0);
  };

  const liveDistance = polylineDistanceKm(points);

  return (
    <div className="gps-recorder">
      <div className="gps-recorder-header">
        <div>
          <span className="eyebrow">Live GPS tracking</span>
          <h3>Record your hike on the trail</h3>
          <p>
            Free built-in tracking — no subscription. Your route saves on this device and can be
            exported as GPX.
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

      {error && <p className="auth-message">{error}</p>}

      <TrailMap route={trail.coordinates} waypoints={trail.waypoints} liveTrack={points} height="16rem" />

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
              onClick={saveTrack}
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
                `${trail.id}-live.gpx`,
                buildGpx({ name: trail.title, points }),
                'application/gpx+xml',
              )
            }
            type="button"
          >
            Export live track (GPX)
          </button>
        )}
      </div>

      {savedTracks.filter((track) => track.trailId === trail.id).length > 0 && (
        <div className="gps-saved-tracks">
          <h4>Your saved tracks on this trail</h4>
          {savedTracks
            .filter((track) => track.trailId === trail.id)
            .slice(0, 3)
            .map((track) => (
              <article key={track.id} className="hike-record-card">
                <strong>{new Date(track.startedAt).toLocaleString()}</strong>
                <span>{formatDistance(track.distanceKm)}</span>
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
      )}
    </div>
  );
}
