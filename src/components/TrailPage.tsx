import { useTrails } from '../context/TrailsContext';
import { getSavannaTrail } from '../data/savannaTrails';
import { TRAILS_FEATURE_NAME } from '../lib/config';
import { SpotInquiryPanel } from './SpotInquiryPanel';
import { TrailExplorer } from './TrailExplorer';

export function TrailPage({ trailId, section }: { trailId: string; section?: string }) {
  const { getTrail, loading, error: trailsError } = useTrails();
  const trail = getTrail(trailId) ?? getSavannaTrail(trailId) ?? getSavannaTrail('longonot-trail')!;

  if (loading && !trail) {
    return (
      <section className="section">
        <p className="community-empty">Loading trail...</p>
      </section>
    );
  }

  if (trailsError) {
    return (
      <section className="section">
        <p className="auth-message">{trailsError}</p>
      </section>
    );
  }

  return (
    <article className="trail-page category-page category-page--hiking">
      <section className="category-hero">
        <div className="category-hero-inner">
          <a className="category-back" href="#category/hiking">
            ← Back to hiking
          </a>
          <span className="eyebrow">{TRAILS_FEATURE_NAME}</span>
          <span className="spot-budget trail-page-budget">{trail.budget}</span>
          <h1>{trail.title}</h1>
          <p>
            {trail.location} · {trail.difficultyLabel} · {trail.duration}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="trail-page-layout">
          <img alt="" className="trail-page-cover" src={trail.image} />
          <div>
            <span className="spot-budget">{trail.budget}</span>
            <p>{trail.description}</p>
          </div>
        </div>
        <TrailExplorer section={section} trail={trail} />
        <SpotInquiryPanel categoryId="hiking" spotId={trail.id} spotTitle={trail.title} />
      </section>
    </article>
  );
}
