import { useEffect, useState, type ReactNode } from 'react';
import { parseDescriptionPoints } from '../lib/descriptionPoints';
import { getDetailsHref, SpotActionBar } from './CategorySpotActions';

type CategorySpotCardContentProps = {
  title: string;
  description: string;
  slug?: string;
  trailId?: string;
  mapQuery?: string;
  mapsHref?: string;
  footerExtra?: ReactNode;
};

export function CategorySpotCardContent({
  title,
  description,
  slug,
  trailId,
  mapQuery,
  mapsHref,
  footerExtra,
}: CategorySpotCardContentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const points = parseDescriptionPoints(description);
  const previewPoints = points.slice(0, 2);
  const detailsHref = getDetailsHref(slug, trailId);
  const hasFullPage = detailsHref !== '#destinations';

  useEffect(() => {
    if (!showDetails) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDetails(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showDetails]);

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
      slug={slug}
      trailId={trailId}
      mapQuery={mapQuery}
      mapsHref={mapsHref}
      onViewDetails={() => setShowDetails(true)}
    />
  );

  return (
    <>
      {bulletList}

      {footerExtra ? (
        <div className="category-card-footer">
          {actions}
          <div className="category-card-extra">{footerExtra}</div>
        </div>
      ) : (
        actions
      )}

      {showDetails ? (
        <div
          className="modal-backdrop"
          onClick={() => setShowDetails(false)}
          role="presentation"
        >
          <div
            className="modal-card category-spot-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-spot-modal-title"
          >
            <button className="modal-close" onClick={() => setShowDetails(false)} type="button">
              x
            </button>
            <span className="eyebrow">Spot details</span>
            <h2 id="category-spot-modal-title">{title}</h2>
            {points.length > 0 ? (
              <ul className="spot-bullet-list spot-bullet-list--full">
                {points.map((point, index) => (
                  <li key={`${index}-${point}`}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="spot-description-empty">No description points added yet.</p>
            )}
            {hasFullPage ? (
              <a className="spot-details-page-link" href={detailsHref}>
                Open full page →
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
