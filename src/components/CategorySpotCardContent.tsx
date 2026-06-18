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
  const allPoints = parseDescriptionPoints(description);
  const previewPoints = allPoints.slice(0, 2);
  const hasMore = allPoints.length > 2;
  const detailsHref = getCategorySpotDetailsHref({ id: spotId, slug, trailId });

  const actions = (
    <SpotActionBar
      detailsHref={detailsHref}
      mapQuery={mapQuery}
      mapsHref={mapsHref}
    />
  );

  const previewBlock = (
    <div className="category-card-preview-block">
      {previewPoints.length > 0 ? (
        <ul className="spot-bullet-list spot-bullet-list--preview" aria-label="Highlights">
          {previewPoints.map((point, index) => (
            <li key={`${index}-${point}`}>{point}</li>
          ))}
          {hasMore ? (
            <li className="spot-bullet-more">
              <a href={detailsHref}>...more</a>
            </li>
          ) : null}
        </ul>
      ) : null}
      {actions}
    </div>
  );

  if (footerExtra) {
    return (
      <>
        {previewBlock}
        <div className="category-card-extra">{footerExtra}</div>
      </>
    );
  }

  return previewBlock;
}
