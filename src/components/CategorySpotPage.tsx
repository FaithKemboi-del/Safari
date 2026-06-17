import { categories } from '../data';
import {
  categoryMeta,
  categorySpotToEvent,
  type CategorySpot,
} from '../categoryContent';
import { useData } from '../context/DataContext';
import { parseDescriptionPoints } from '../lib/descriptionPoints';
import { buildMapsHref } from './CategorySpotActions';
import { SpotInquiryPanel } from './SpotInquiryPanel';

function spotMapQuery(spot: CategorySpot): string {
  return spot.mapQuery ?? `${spot.title} ${spot.location} Kenya`;
}

export function CategorySpotPage({ spotId }: { spotId: string }) {
  const { categorySpots } = useData();
  const spot = categorySpots.find((item) => item.id === spotId);
  const category = categories.find((item) => item.id === spot?.categoryId);
  const meta = spot ? categoryMeta[spot.categoryId] : undefined;
  const event = spot ? categorySpotToEvent(spot) : null;
  const points = spot ? parseDescriptionPoints(spot.description) : [];

  if (!spot) {
    return (
      <section className="section">
        <p className="community-empty">This spot could not be found.</p>
        <a className="category-back" href="#home">
          ← Back home
        </a>
      </section>
    );
  }

  const mapsUrl = buildMapsHref(spotMapQuery(spot));

  return (
    <article
      className={`category-spot-page category-page category-page--${category?.theme ?? 'hiking'}`}
    >
      <section className="category-hero">
        <div className="category-hero-inner">
          <a className="category-back" href={`#category/${spot.categoryId}`}>
            ← Back to {meta?.eyebrow ?? category?.label ?? 'category'}
          </a>
          {event ? (
            <span className={`event-status event-status--${event.status}`}>
              {event.status.replace('-', ' ')}
            </span>
          ) : null}
          <span className="spot-budget trail-page-budget">{spot.budget}</span>
          <h1>{spot.title}</h1>
          <p className="spot-location">
            {spot.location}
            {event?.dateLabel ? ` · ${event.dateLabel}` : ''}
          </p>
        </div>
      </section>

      <section className="section category-spot-page__main">
        <div className="category-spot-page__layout">
          <div className="category-spot-page__media">
            <img alt="" className="category-spot-page__cover" src={spot.image} />
            <div className="category-spot-page__quick-actions spot-actions">
              <a href={mapsUrl} rel="noreferrer" target="_blank">
                Open in Maps
              </a>
              {spot.trailId ? (
                <a href={`#trail/${spot.trailId}`}>Open interactive trail map</a>
              ) : null}
            </div>
          </div>

          <div className="category-spot-page__content glass-panel">
            <span className="eyebrow">Spot details</span>
            <h2>About this spot</h2>
            {points.length > 0 ? (
              <ul className="spot-bullet-list spot-bullet-list--full">
                {points.map((point, index) => (
                  <li key={`${index}-${point}`}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="spot-description-empty">No description points added yet.</p>
            )}
          </div>
        </div>

        <SpotInquiryPanel categoryId={spot.categoryId} spotId={spot.id} spotTitle={spot.title} />
      </section>
    </article>
  );
}
