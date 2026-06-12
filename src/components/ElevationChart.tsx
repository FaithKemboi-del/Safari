import type { ElevationPoint } from '../lib/trailUtils';

type ElevationChartProps = {
  profile: ElevationPoint[];
  height?: number;
};

export function ElevationChart({ profile, height = 120 }: ElevationChartProps) {
  if (profile.length < 2) {
    return null;
  }

  const maxDistance = profile[profile.length - 1].distanceKm;
  const elevations = profile.map((point) => point.elevationM);
  const minElevation = Math.min(...elevations);
  const maxElevation = Math.max(...elevations);
  const range = Math.max(maxElevation - minElevation, 1);
  const width = 640;
  const padding = 12;

  const points = profile
    .map((point) => {
      const x = padding + ((point.distanceKm / maxDistance) * (width - padding * 2));
      const y =
        height -
        padding -
        ((point.elevationM - minElevation) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="elevation-chart">
      <div className="elevation-chart-header">
        <strong>Elevation profile</strong>
        <span>
          {minElevation}–{maxElevation} m · {maxDistance.toFixed(1)} km
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trail elevation profile">
        <defs>
          <linearGradient id="elevationFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(46, 125, 50, 0.45)" />
            <stop offset="100%" stopColor="rgba(46, 125, 50, 0.05)" />
          </linearGradient>
        </defs>
        <polygon fill="url(#elevationFill)" points={areaPoints} />
        <polyline
          fill="none"
          points={points}
          stroke="#2e7d32"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}
