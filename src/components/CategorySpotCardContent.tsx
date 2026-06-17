import type { ReactNode } from 'react';
import { parseDescriptionPoints } from '../lib/descriptionPoints';
import { getCategorySpotDetailsHref, SpotActionBar } from './CategorySpotActions';

type CategorySpotCardContentProps = {
  spotId: string;
  description: string;
  slug?: string;
  trailId?: string;
  mapQuery?: string;
  mapsHref?: string;
  footerExtra?: ReactNode;
};

export function CategorySpotCardContent({
  spotId,
  description,
  slug,
  trailId,
  mapQuery,
  mapsHref,
  footerExtra,
}: CategorySpotCardContentProps) {
  const previewPoints = parseDescriptionPoints(description).slice(0, 2);
  const detailsHref = getCategorySpotDetailsHref({ id: spotId, slug, trailId });

  const bulletList =
    previewPoints.length > 0 ? (
      <ul className="spot-bullet-list spot-bullet-list--preview" aria-label="Highlights">
        {previewPoints.map((point, index) => (
          <li key={`${index}-${point}`}>{point}</li>
        ))}
      </ul>
    ) : null;

  const actions = (
    <SpotActionBar
      detailsHref={detailsHref}
      mapQuery={mapQuery}
      mapsHref={mapsHref}
    />
  );

  if (footerExtra) {
    return (
      <>
        {bulletList}
        <div className="category-card-footer">
          {actions}
          <div className="category-card-extra">{footerExtra}</div>
        </div>
      </>
    );
  }

  return (
    <>
      {bulletList}
      {actions}
    </>
  );
}
