import type { CategorySpot } from '../categoryContent';

function spotMapQuery(spot: CategorySpot): string {
  return spot.mapQuery ?? `${spot.title} ${spot.location} Kenya`;
}

export function CategorySpotActions({ spot }: { spot: CategorySpot }) {
  const mapQuery = spotMapQuery(spot);

  return (
    <div className="spot-actions">
      {spot.slug && <a href={`#destination/${spot.slug}`}>View details</a>}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
        rel="noreferrer"
        target="_blank"
      >
        Open in Maps
      </a>
    </div>
  );
}
