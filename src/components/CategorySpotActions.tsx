import type { CategorySpot } from '../categoryContent';

function buildMapsHref(mapQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
}

export function getDetailsHref(slug?: string, trailId?: string): string | undefined {
  if (slug) {
    return `#destination/${slug}`;
  }

  if (trailId) {
    return `#trail/${trailId}`;
  }

  return undefined;
}

type SpotActionBarProps = {
  slug?: string;
  trailId?: string;
  mapQuery?: string;
  mapsHref?: string;
};

export function SpotActionBar({ slug, trailId, mapQuery, mapsHref }: SpotActionBarProps) {
  const detailsHref = getDetailsHref(slug, trailId);
  const mapsUrl = mapsHref ?? (mapQuery ? buildMapsHref(mapQuery) : undefined);

  if (!detailsHref && !mapsUrl) {
    return null;
  }

  return (
    <div className="spot-actions">
      {detailsHref ? <a href={detailsHref}>View details</a> : null}
      {mapsUrl ? (
        <a href={mapsUrl} rel="noreferrer" target="_blank">
          Open in Maps
        </a>
      ) : null}
    </div>
  );
}

function spotMapQuery(spot: CategorySpot): string {
  return spot.mapQuery ?? `${spot.title} ${spot.location} Kenya`;
}

export function CategorySpotActions({ spot }: { spot: CategorySpot }) {
  return (
    <SpotActionBar
      slug={spot.slug}
      trailId={spot.trailId}
      mapQuery={spotMapQuery(spot)}
    />
  );
}
