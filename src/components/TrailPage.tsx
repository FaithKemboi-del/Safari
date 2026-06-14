import { useTrails } from '../context/TrailsContext';
import { getSavannaTrail } from '../data/savannaTrails';
import { TrailExplorer } from './TrailExplorer';

export function TrailPage({ trailId }: { trailId: string }) {
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
          <span className="eyebrow">Savanna Trails</span>
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
        <TrailExplorer trail={trail} />
      </section>
    </article>
  );
}
