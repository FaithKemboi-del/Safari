import type { CategorySpot } from '../categoryContent';

export function buildMapsHref(mapQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
}

export function getDetailsHref(slug?: string, trailId?: string): string {
  if (slug) {
    return `#destination/${slug}`;
  }

  if (trailId) {
    return `#trail/${trailId}`;
  }

  return '#destinations';
}

export function getCategorySpotDetailsHref(spot: {
  id: string;
  slug?: string;
  trailId?: string;
}): string {
  if (spot.trailId) {
    return `#trail/${spot.trailId}`;
  }

  return `#spot/${spot.id}`;
}

type SpotActionBarProps = {
  detailsHref: string;
  mapQuery?: string;
  mapsHref?: string;
};

export function SpotActionBar({ detailsHref, mapQuery, mapsHref }: SpotActionBarProps) {
  const mapsUrl = mapsHref ?? (mapQuery ? buildMapsHref(mapQuery) : undefined);

  if (!mapsUrl) {
    return (
      <div className="spot-actions">
        <a href={detailsHref}>View details</a>
      </div>
    );
  }

  return (
    <div className="spot-actions">
      <a href={detailsHref}>View details</a>
      <a href={mapsUrl} rel="noreferrer" target="_blank">
        Open in Maps
      </a>
    </div>
  );
}

function spotMapQuery(spot: CategorySpot): string {
  return spot.mapQuery ?? `${spot.title} ${spot.location} Kenya`;
}

export function CategorySpotActions({ spot }: { spot: CategorySpot }) {
  return (
    <SpotActionBar
      detailsHref={getCategorySpotDetailsHref(spot)}
      mapQuery={spotMapQuery(spot)}
    />
  );
}
