import type { ReactNode } from 'react';
import type { Destination } from '../types/destination';
import {
  computeBudgetEstimates,
  formatBudgetKes,
  getCategoryConfig,
} from '../lib/destinationCategories';
import { buildMapsHref } from './CategorySpotActions';

function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="destination-panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function FactItem({ label, value }: { label: string; value?: string | number }) {
  if (value == null || value === '') {
    return null;
  }

  return (
    <div className="destination-fact">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function TextBlock({ value }: { value?: string }) {
  if (!value?.trim()) {
    return null;
  }

  return <p className="destination-copy">{value}</p>;
}

function CategoryFieldGrid({ destination }: { destination: Destination }) {
  const config = getCategoryConfig(destination.category);
  const entries = config.fields
    .map((field) => ({
      label: field.label,
      value: destination.categoryFields[field.key],
    }))
    .filter((entry) => entry.value);

  if (entries.length === 0) {
    return null;
  }

  return (
    <InfoPanel title={`${config.label} details`}>
      <div className="destination-field-grid">
        {entries.map((entry) => (
          <div key={entry.label} className="destination-field-card">
            <small>{entry.label}</small>
            {entry.value?.includes('\n') ? (
              <p>{entry.value}</p>
            ) : entry.label.toLowerCase().includes('link') && entry.value?.startsWith('http') ? (
              <a href={entry.value} rel="noreferrer" target="_blank">
                {entry.value}
              </a>
            ) : (
              <strong>{entry.value}</strong>
            )}
          </div>
        ))}
      </div>
    </InfoPanel>
  );
}

function CampingFacilities({ destination }: { destination: Destination }) {
  if (destination.category !== 'camping') {
    return null;
  }

  const icons: { key: string; label: string; symbol: string }[] = [
    { key: 'tent_rental', label: 'Tent rental', symbol: '⛺' },
    { key: 'fire_pit', label: 'Fire pit', symbol: '🔥' },
    { key: 'washrooms', label: 'Washrooms', symbol: '🚻' },
    { key: 'showers', label: 'Showers', symbol: '🚿' },
    { key: 'parking', label: 'Parking', symbol: '🅿️' },
    { key: 'electricity', label: 'Electricity', symbol: '⚡' },
  ];

  const visible = icons
    .map((item) => ({ ...item, value: destination.categoryFields[item.key] }))
    .filter((item) => item.value);

  if (visible.length === 0) {
    return null;
  }

  return (
    <div className="destination-facility-grid">
      {visible.map((item) => (
        <div key={item.key} className="destination-facility-card">
          <span aria-hidden="true">{item.symbol}</span>
          <strong>{item.label}</strong>
          <small>{item.value}</small>
        </div>
      ))}
    </div>
  );
}

type DestinationDetailViewProps = {
  destination: Destination;
  related: Destination[];
  communityFeed: ReactNode;
};

export function DestinationDetailView({
  destination,
  related,
  communityFeed,
}: DestinationDetailViewProps) {
  const category = getCategoryConfig(destination.category);
  const estimates = computeBudgetEstimates(destination.budget);
  const mapsUrl = buildMapsHref(destination.mapQuery);

  const budgetLines = [
    { label: 'Transport', value: destination.budget.transport },
    { label: 'Accommodation', value: destination.budget.accommodation },
    { label: 'Entry fee', value: destination.budget.entryFee },
    { label: 'Guide fee', value: destination.budget.guideFee },
    { label: 'Food estimate', value: destination.budget.food },
    { label: 'Activity cost', value: destination.budget.activity },
  ].filter((line) => line.value > 0);

  return (
    <article className="destination-detail-page">
      <section className="destination-hero section-dark">
        <img className="destination-hero__image" src={destination.image} alt="" />
        <div className="hero-overlay" />
        <div className="destination-hero__copy">
          <span className="eyebrow">{category.label}</span>
          <h1>{destination.title}</h1>
          <p>{destination.description}</p>
          <div className="detail-badges">
            <span className="detail-budget">{destination.county}</span>
            {destination.nearestTown ? <span>{destination.nearestTown}</span> : null}
            {destination.familyFriendly ? <span>Family friendly</span> : null}
            {destination.featuredOnHome ? <span>Featured</span> : null}
          </div>
        </div>
      </section>

      {destination.gallery.length > 0 ? (
        <section className="section destination-gallery-strip">
          <div className="mini-gallery">
            {destination.gallery.map((image) => (
              <img key={image} src={image} alt="" />
            ))}
          </div>
        </section>
      ) : null}

      <section className="section destination-detail-layout">
        <div className="destination-detail-main">
          <InfoPanel title="Quick facts">
            <div className="destination-facts-grid">
              <FactItem label="County" value={destination.county} />
              <FactItem label="Nearest town" value={destination.nearestTown} />
              <FactItem
                label="Distance from Nairobi"
                value={
                  destination.distanceFromNairobiKm
                    ? `${destination.distanceFromNairobiKm} km`
                    : undefined
                }
              />
              <FactItem label="Travel time from Nairobi" value={destination.travelTimeFromNairobi} />
              <FactItem label="Best time to visit" value={destination.bestTimeToVisit} />
            </div>
          </InfoPanel>

          <InfoPanel title="Budget breakdown">
            {budgetLines.length > 0 ? (
              <div className="destination-budget-lines">
                {budgetLines.map((line) => (
                  <div key={line.label} className="destination-budget-line">
                    <span>{line.label}</span>
                    <strong>{formatBudgetKes(line.value)}</strong>
                  </div>
                ))}
              </div>
            ) : destination.pricing ? (
              <TextBlock value={destination.pricing} />
            ) : (
              <p className="destination-copy">Budget details coming soon.</p>
            )}
            <div className="destination-budget-estimates">
              <div>
                <small>Estimated day trip</small>
                <strong>{formatBudgetKes(estimates.dayTrip)}</strong>
              </div>
              <div>
                <small>Estimated weekend</small>
                <strong>{formatBudgetKes(estimates.weekend)}</strong>
              </div>
              <div>
                <small>Estimated total</small>
                <strong>{formatBudgetKes(estimates.total)}</strong>
              </div>
            </div>
          </InfoPanel>

          <InfoPanel title="How to get there">
            <TextBlock value={destination.directions} />
            <TextBlock value={destination.publicTransport} />
            <TextBlock value={destination.roadConditions} />
            <a className="primary-button" href={mapsUrl} rel="noreferrer" target="_blank">
              Open in Google Maps
            </a>
          </InfoPanel>

          <InfoPanel title="Travel tips">
            <TextBlock value={destination.safetyAndConditions} />
            <TextBlock value={destination.whatToCarry} />
            <TextBlock value={destination.travelTips} />
          </InfoPanel>

          <CategoryFieldGrid destination={destination} />
          <CampingFacilities destination={destination} />

          {destination.highlights.length > 0 ? (
            <InfoPanel title="Highlights">
              <div className="tag-list destination-tag-list">
                {destination.highlights.map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
            </InfoPanel>
          ) : null}

          {communityFeed}

          <InfoPanel title="Map">
            <div className="map-frame">
              <iframe
                title={`${destination.title} map`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(destination.mapQuery)}&output=embed`}
                loading="lazy"
              />
            </div>
          </InfoPanel>
        </div>

        <aside className="destination-detail-sidebar glass-panel">
          <span className="eyebrow">Plan your trip</span>
          <h2>Ready to visit {destination.title}?</h2>
          <p>Compare routes, ask travelers, and build a budget-friendly itinerary around this stop.</p>
          <a className="primary-button full-width" href="#itineraries">
            Browse itineraries
          </a>
          <a className="secondary-button full-width" href="#community">
            Ask the community
          </a>
        </aside>
      </section>

      {related.length > 0 ? (
        <section className="section related-section">
          <div className="section-intro">
            <span className="eyebrow">More to explore</span>
            <h2>Similar destinations</h2>
          </div>
          <div className="destination-row">
            {related.map((item) => (
              <a key={item.slug} className="destination-mini-card" href={`#destination/${item.slug}`}>
                <img alt="" src={item.image} />
                <div>
                  <small>{getCategoryConfig(item.category).label}</small>
                  <strong>{item.title}</strong>
                  <span>{item.county}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
