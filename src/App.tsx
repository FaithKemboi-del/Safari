import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {
  categories,
  testimonials,
  trendingThisWeek,
} from './data';
import type { CommunityUpdate, Destination } from './data';
import {
  destinationMatchesProvince,
  destinationMatchesSearch,
  KENYA_PROVINCE_FILTER_OPTIONS,
} from './lib/kenyaProvinces';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';
import { fetchCommunityUpdates, postCommunityUpdate } from './services/safariApi';
import { CategoryIcon, CategoryPage } from './components/CategoryPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminProtected } from './components/AdminProtected';
import { TrailPage } from './components/TrailPage';

type Route =
  | { page: 'home' }
  | { page: 'destinations' }
  | { page: 'destination'; slug: string }
  | { page: 'category'; id: string }
  | { page: 'trail'; id: string }
  | { page: 'itineraries' }
  | { page: 'plan-ai' }
  | { page: 'signin' }
  | { page: 'signup' }
  | { page: 'admin-login' }
  | { page: 'admin' };

const navItems = [
  { label: 'Home', hash: '#home' },
  { label: 'Destinations', hash: '#destinations' },
  { label: 'Itineraries', hash: '#itineraries' },
  { label: 'Plan with AI', hash: '#plan-ai' },
];

const adminTables = {
  Destinations: [
    ['Maasai Mara', 'Narok', 'From $45/day', 'Published'],
    ['Amboseli', 'Kajiado', 'From $55/day trip', 'Published'],
    ["Hell's Gate", 'Naivasha', 'From $15 entry', 'Published'],
  ],
  Itineraries: [
    ['Budget Mara Weekend', '3 days', 'From $180 pp', 'Live'],
    ['Coast on a Shoestring', '5 days', 'From $220 pp', 'Live'],
    ['Rift Valley Circuit', '4 days', 'From $150 pp', 'Review'],
  ],
  Routes: [
    ['Nairobi -> Maasai Mara', 'Fly-in', '290 km', 'Active'],
    ['Amboseli -> Tsavo -> Diani', 'Road + SGR', '690 km', 'Active'],
    ['Nairobi -> Lake Nakuru -> Laikipia', 'Private 4x4', '510 km', 'Draft'],
  ],
};

function parseHashFromPath(path?: string): Route {
  const hash = (path ?? window.location.hash.replace(/^#/, '')) || 'home';
  const [page, slug] = hash.split('/');

  if (page === 'destination' && slug) {
    return { page: 'destination', slug };
  }

  if (page === 'category' && slug) {
    return { page: 'category', id: slug };
  }

  if (page === 'trail' && slug) {
    return { page: 'trail', id: slug };
  }

  if (
    page === 'destinations' ||
    page === 'itineraries' ||
    page === 'plan-ai' ||
    page === 'signin' ||
    page === 'signup' ||
    page === 'admin-login' ||
    page === 'admin'
  ) {
    return { page };
  }

  return { page: 'home' };
}

function parseHash(): Route {
  return parseHashFromPath();
}

function routeKey(route: Route): string {
  if (route.page === 'destination') {
    return `destination/${route.slug}`;
  }

  if (route.page === 'category') {
    return `category/${route.id}`;
  }

  if (route.page === 'trail') {
    return `trail/${route.id}`;
  }

  return route.page;
}

function App() {
  const [route, setRoute] = useState<Route>(parseHash);

  const navigate = useCallback((hash: string) => {
    const target = hash.replace(/^#/, '') || 'home';
    const nextRoute = parseHashFromPath(target);

    setRoute(nextRoute);

    if (window.location.hash.replace(/^#/, '') !== target) {
      window.location.hash = target;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    window.addEventListener('hashchange', onHashChange);

    if (!window.location.hash) {
      window.location.hash = 'home';
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [routeKey(route)]);

  const activePage =
    route.page === 'destination'
      ? 'destinations'
      : route.page === 'category' || route.page === 'trail'
        ? 'home'
        : route.page;

  return (
    <div className="site-shell">
      <Header activePage={activePage} />
      <main>
        {route.page === 'home' && <HomePage onNavigate={navigate} />}
        {route.page === 'destinations' && <DestinationsPage />}
        {route.page === 'destination' && <DestinationDetailPage slug={route.slug} />}
        {route.page === 'category' && <CategoryPage categoryId={route.id} />}
        {route.page === 'trail' && <TrailPage trailId={route.id} />}
        {route.page === 'itineraries' && <ItinerariesPage />}
        {route.page === 'plan-ai' && <PlanWithAIPage />}
        {route.page === 'signin' && <AuthPage mode="signin" />}
        {route.page === 'signup' && <AuthPage mode="signup" />}
        {route.page === 'admin-login' && (
          <AdminLoginPage onSuccess={() => navigate('admin')} />
        )}
        {route.page === 'admin' && (
          <AdminProtected onNavigate={navigate}>
            <AdminDashboard onSignOut={() => navigate('admin-login')} />
          </AdminProtected>
        )}
      </main>
      {route.page !== 'admin' && route.page !== 'admin-login' && <Footer />}
    </div>
  );
}

function Header({ activePage }: { activePage: string }) {
  return (
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Savanna Luxe home">
        <span className="brand-mark">SL</span>
        <span>
          <strong>Savanna Luxe</strong>
          <small>Budget Kenya Travel</small>
        </span>
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a
            key={item.hash}
            className={activePage === item.hash.replace('#', '') ? 'active' : ''}
            href={item.hash}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <a className="ghost-link" href="#signin">
          Sign in
        </a>
        <a className="pill-link" href="#signup">
          Sign up
        </a>
      </div>
    </header>
  );
}

function HomePage({ onNavigate }: { onNavigate: (hash: string) => void }) {
  const { destinations, itineraries } = useData();

  const goToCategory = (categoryId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(`category/${categoryId}`);
  };

  return (
    <>
      <section className="hero section-dark">
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <span className="eyebrow">Affordable Kenya travel</span>
          <h1 className="hero-title-horizontal">
            <span>Explore Kenya</span>
            <span className="title-accent"> on a budget,</span>
            <span> without missing the adventure.</span>
          </h1>
          <p>
            Find cheap routes, local transport tips, camps, hikes, coast escapes, and events — built
            for travelers who want to see Kenya affordably and confidently.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#destinations">
              Explore destinations
            </a>
          </div>
          <div className="category-strip" role="list" aria-label="Travel categories">
            {categories.map((category) => (
              <a
                key={category.id}
                className={`category-chip category-chip--${category.theme}`}
                href={`#category/${category.id}`}
                onClick={goToCategory(category.id)}
                role="listitem"
              >
                <CategoryIcon icon={category.icon} />
                {category.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section trending-section">
        <SectionIntro
          eyebrow="Trending this week"
          title="What travelers are searching right now"
          body="What budget travelers are booking this week — shared vans, SGR hops, and low-cost stays."
        />
        <div className="trending-grid">
          {trendingThisWeek.map((item, index) => (
            <article
              key={item.id}
              className={`trending-card ${index === 0 ? 'featured' : ''}`}
            >
              <img src={item.image} alt="" />
              <div className="trending-overlay" />
              <div className="trending-content">
                <span className="trending-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.location}</p>
                <div className="trending-meta">
                  <small>{item.searches}</small>
                  <a href={`#destination/${item.slug}`}>Explore</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section plan-ai-teaser parallax-band">
        <div className="plan-ai-teaser-copy">
          <span className="eyebrow">Plan itinerary with AI</span>
          <h2>Tell us what you want. We tailor the route.</h2>
          <p>
            Describe your dream trip, pick your pace, and preview a custom Kenya itinerary in
            seconds. Backend coming soon — the experience is ready to explore now.
          </p>
          <a className="primary-button" href="#plan-ai">
            Start planning
          </a>
        </div>
        <div className="plan-ai-teaser-preview glass-panel">
          <span className="preview-label">Preview</span>
          <p>“5-day wildlife and coast trip under $250 — matatu, SGR, hostel, and one splurge night.”</p>
          <ul>
            <li>Day 1-2: Amboseli elephant drives</li>
            <li>Day 3: Tsavo red-earth safari</li>
            <li>Day 4-5: Diani coast reset</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <SectionIntro
          eyebrow="Featured destinations"
          title="Top spots that won't break the bank"
          body="Wildlife, hikes, coast, and hidden gems with honest pricing, transport options, and safety notes."
        />
        <div className="destination-row">
          {destinations.slice(0, 3).map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} compact />
          ))}
        </div>
      </section>

      <section className="section muted-section">
        <SectionIntro
          eyebrow="Popular itineraries"
          title="Affordable routes that still feel epic"
          body="Day-by-day plans with public transport, shared vans, camps, and hostels where possible."
        />
        <div className="itinerary-showcase">
          {itineraries.map((itinerary) => (
            <article key={itinerary.id} className="showcase-card">
              <img src={itinerary.image} alt="" />
              <div>
                <span>{itinerary.duration}</span>
                <h3>{itinerary.title}</h3>
                <p>{itinerary.route}</p>
                <strong>{itinerary.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section testimonials-section">
        <SectionIntro
          eyebrow="Traveler stories"
          title="Designed to capture attention and trust"
          body="Real tips from travelers on the ground — so you know what to expect before you go."
        />
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="testimonial-card">
              <blockquote>“{testimonial.quote}”</blockquote>
              <figcaption>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="landing-cta section-dark" aria-labelledby="landing-cta-title">
        <img
          className="landing-cta-image"
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1800&q=80"
          alt=""
        />
        <div className="landing-cta-overlay" />
        <div className="landing-cta-inner">
          <div className="landing-cta-copy">
            <span className="eyebrow">Ready to explore?</span>
            <h2 id="landing-cta-title">Your next Kenya adventure starts here.</h2>
            <p>
              Browse budget destinations, follow Savanna Trails with free maps, and get live tips
              from travelers on the ground — no expensive tour packages required.
            </p>
            <ul className="landing-cta-points">
              <li>Free trail maps &amp; GPS recording</li>
              <li>Community updates from real travelers</li>
              <li>Itineraries built for matatu, SGR &amp; camps</li>
            </ul>
          </div>
          <div className="landing-cta-actions">
            <a className="primary-button" href="#destinations">
              Browse destinations
            </a>
            <a
              className="secondary-button"
              href="#category/hiking"
              onClick={goToCategory('hiking')}
            >
              Explore hiking trails
            </a>
            <a className="landing-cta-link" href="#signup">
              Create a free account →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function DestinationsPage() {
  const { destinations } = useData();
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState<(typeof KENYA_PROVINCE_FILTER_OPTIONS)[number]>('All');

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      return (
        destinationMatchesProvince(destination, province) &&
        destinationMatchesSearch(destination, search)
      );
    });
  }, [destinations, province, search]);

  return (
    <PageFrame
      eyebrow="Safari destinations"
      title="Find affordable places to explore"
      body="Search by destination, town, or county. Filter by Kenyan province to narrow results."
    >
      <div className="filter-panel">
        <label>
          Search destinations
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try Eldoret, Samburu, Maasai Mara, Diani..."
          />
        </label>
        <label>
          Filter by province
          <select value={province} onChange={(event) => setProvince(event.target.value as typeof province)}>
            {KENYA_PROVINCE_FILTER_OPTIONS.map((provinceName) => (
              <option key={provinceName}>{provinceName}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="destination-grid">
        {filteredDestinations.map((destination) => (
          <DestinationCard key={destination.slug} destination={destination} />
        ))}
      </div>
    </PageFrame>
  );
}

function DestinationDetailPage({ slug }: { slug: string }) {
  const { destinations } = useData();
  const destination = destinations.find((item) => item.slug === slug) ?? destinations[0];
  const related = destinations
    .filter((item) => item.slug !== destination.slug)
    .filter(
      (item) =>
        item.region === destination.region || item.experienceType === destination.experienceType,
    )
    .slice(0, 3);
  const fallbackRelated = related.length ? related : destinations.filter((item) => item.slug !== destination.slug).slice(0, 3);
  const isHike = destination.experienceType === 'hike';

  return (
    <article className="detail-page">
      <section className="gallery-hero section-dark">
        <img className="gallery-main" src={destination.image} alt="" />
        <div className="hero-overlay" />
        <div className="gallery-copy">
          <span className="eyebrow">{destination.location}</span>
          <h1>{destination.title}</h1>
          <p>{destination.description}</p>
          <div className="detail-badges">
            {destination.pricing ? (
              <span className="detail-budget">{destination.pricing}</span>
            ) : null}
            <span>{destination.region}</span>
            <span>{isHike ? 'Hiking' : 'Budget travel'}</span>
            {isHike && destination.hikeDifficulty && (
              <span>{destination.hikeDifficulty.split('—')[0].trim()}</span>
            )}
          </div>
        </div>
      </section>

      <section className="section detail-layout">
        <div className="detail-content">
          <div className="mini-gallery">
            {destination.gallery.map((image) => (
              <img key={image} src={image} alt="" />
            ))}
          </div>

          <InfoBlock title="Description">{destination.description}</InfoBlock>

          <div className="info-grid">
            {isHike ? (
              <>
                <InfoBlock title="Hike difficulty">{destination.hikeDifficulty}</InfoBlock>
                {destination.transportAndLogistics && (
                  <InfoBlock title="Transport & logistics">
                    {destination.transportAndLogistics}
                  </InfoBlock>
                )}
                {destination.additionalInfo && (
                  <InfoBlock title="Additional info">{destination.additionalInfo}</InfoBlock>
                )}
              </>
            ) : (
              <>
                {destination.pricing && (
                  <InfoBlock title="Pricing">{destination.pricing}</InfoBlock>
                )}
                {destination.safetyAndConditions && (
                  <InfoBlock title="Safety & conditions">{destination.safetyAndConditions}</InfoBlock>
                )}
                {destination.transportAndLogistics && (
                  <InfoBlock title="Transport & logistics">
                    {destination.transportAndLogistics}
                  </InfoBlock>
                )}
                {destination.additionalInfo && (
                  <InfoBlock title="Additional info">{destination.additionalInfo}</InfoBlock>
                )}
              </>
            )}
          </div>

          <InfoBlock title="Experience highlights">
            <div className="tag-list">
              {destination.highlights.map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>
          </InfoBlock>

          <CommunityFeed destinationSlug={destination.slug} destinationTitle={destination.title} />

          <InfoBlock title="Map to the destination">
            <div className="map-frame">
              <iframe
                title={`${destination.title} map`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(destination.mapQuery)}&output=embed`}
                loading="lazy"
              />
            </div>
          </InfoBlock>
        </div>

        <aside className="booking-panel glass-panel">
          <span className="eyebrow">Private planning</span>
          <h2>Plan this trip</h2>
          <p>Pair {destination.title} with matatu routes, SGR legs, camps, and low-cost stays.</p>
          <a className="primary-button full-width" href="#signup">
            Start a request
          </a>
        </aside>
      </section>

      <section className="section related-section">
        <SectionIntro
          eyebrow="Related destinations"
          title="Keep exploring Kenya"
          body="Similar destinations and route pairings that work beautifully with this experience."
        />
        <div className="destination-row">
          {fallbackRelated.map((item) => (
            <DestinationCard key={item.slug} destination={item} compact />
          ))}
        </div>
      </section>
    </article>
  );
}

function ItinerariesPage() {
  const { itineraries } = useData();
  const [openItem, setOpenItem] = useState('');

  useEffect(() => {
    if (itineraries[0]) {
      setOpenItem(`${itineraries[0].id}-${itineraries[0].days[0]?.day ?? 'Day 1'}`);
    }
  }, [itineraries]);

  return (
    <PageFrame
      eyebrow="Travel itineraries"
      title="Budget routes you can follow day by day"
      body="Each itinerary uses expandable day-by-day details so travelers can scan the journey, then dive deeper into the moments that matter."
    >
      <div className="timeline-list">
        {itineraries.map((itinerary) => (
          <article key={itinerary.id} className="timeline-card">
            <div className="timeline-media">
              <img src={itinerary.image} alt="" />
              <span>{itinerary.style}</span>
            </div>
            <div className="timeline-content">
              <div className="timeline-heading">
                <div>
                  <span className="eyebrow">{itinerary.duration}</span>
                  <h2>{itinerary.title}</h2>
                  <p>{itinerary.route}</p>
                </div>
                <strong>{itinerary.price}</strong>
              </div>
              <div className="day-stack">
                {itinerary.days.map((day) => {
                  const key = `${itinerary.id}-${day.day}`;
                  const isOpen = openItem === key;

                  return (
                    <button
                      className={`day-item ${isOpen ? 'open' : ''}`}
                      key={key}
                      onClick={() => setOpenItem(isOpen ? '' : key)}
                      type="button"
                    >
                      <span className="day-dot" />
                      <span className="day-copy">
                        <strong>
                          {day.day}: {day.title}
                        </strong>
                        {isOpen && <small>{day.details}</small>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageFrame>
  );
}

function AuthPage({ mode }: { mode: 'signin' | 'signup' }) {
  const isSignUp = mode === 'signup';
  const { signIn, signUp, isConfigured } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const result = isSignUp
        ? await signUp(email, password, fullName)
        : await signIn(email, password);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      if (isSignUp && isConfigured) {
        setMessage('Account created. Check your email to confirm, then sign in.');
        return;
      }

      window.location.hash = 'home';
    } catch (authError) {
      console.error('Auth submit failed:', authError);
      setMessage('Something went wrong. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-visual section-dark">
        <div className="auth-image" />
        <div className="hero-overlay" />
        <div>
          <span className="eyebrow">Member access</span>
          <h1>{isSignUp ? 'Plan your next adventure.' : 'Welcome back, explorer.'}</h1>
          <p>
            Save destinations, compare affordable routes, and get live updates from travelers on the
            ground across Kenya.
          </p>
        </div>
      </div>

      <div className="auth-card">
        <span className="eyebrow">{isSignUp ? 'Create account' : 'Sign in'}</span>
        <h2>{isSignUp ? 'Join Savanna Luxe' : 'Access your dashboard'}</h2>
        <div className="social-buttons">
          <button type="button">Continue with Google</button>
          <button type="button">Continue with Apple</button>
        </div>
        <div className="divider">or use email</div>
        <form className="form-stack" onSubmit={handleSubmit}>
          {isSignUp && (
            <label>
              Full name
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Amina Safari"
                required
              />
            </label>
          )}
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </label>
          {message && <p className="auth-message">{message}</p>}
          <button className="primary-button full-width" disabled={submitting} type="submit">
            {submitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <p className="auth-switch">
          {isSignUp ? 'Already have an account?' : 'New to Savanna Luxe?'}{' '}
          <a href={isSignUp ? '#signin' : '#signup'}>{isSignUp ? 'Sign in' : 'Create one'}</a>
        </p>
      </div>
    </section>
  );
}

function DestinationAdminModal({ onClose }: { onClose: () => void }) {
  const [experienceType, setExperienceType] = useState<'standard' | 'hike'>('standard');

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card modal-card--wide" role="dialog" aria-modal="true" aria-labelledby="destination-modal-title">
        <button className="modal-close" onClick={onClose} type="button">
          x
        </button>
        <span className="eyebrow">Add a place</span>
        <h2 id="destination-modal-title">Destination details</h2>
        <p className="modal-lead">
          Match the public destination page — pricing, safety, transport, and hike fields where
          relevant.
        </p>
        <form className="form-stack">
          <div className="form-grid">
            <label>
              Title
              <input placeholder="e.g. Hell's Gate National Park" />
            </label>
            <label>
              Slug
              <input placeholder="hells-gate" />
            </label>
            <label>
              Location
              <input placeholder="Naivasha, Nakuru County" />
            </label>
            <label>
              Region
              <input placeholder="Rift Valley" />
            </label>
          </div>

          <label>
            Description
            <textarea placeholder="What makes this place worth visiting on a budget?" rows={4} />
          </label>

          <div className="form-grid">
            <label>
              Experience type
              <select
                value={experienceType}
                onChange={(event) => setExperienceType(event.target.value as 'standard' | 'hike')}
              >
                <option value="standard">Safari & travel</option>
                <option value="hike">Hiking</option>
              </select>
            </label>
            <label>
              Status
              <select defaultValue="published">
                <option value="published">Published</option>
                <option>Draft</option>
                <option>Review</option>
              </select>
            </label>
            <label>
              Cover image URL
              <input placeholder="https://images.unsplash.com/..." />
            </label>
            <label>
              Map query
              <input placeholder="Hell's Gate National Park Kenya" />
            </label>
          </div>

          {experienceType === 'hike' ? (
            <>
              <label>
                Hike difficulty
                <textarea
                  placeholder="Moderate — 3–4 hour loop, rocky sections, sun exposure..."
                  rows={3}
                />
              </label>
              <label>
                Transport & logistics
                <textarea
                  placeholder="Matatu from Nairobi, bike rental at gate, best arrival time..."
                  rows={3}
                />
              </label>
              <label>
                Additional info
                <textarea placeholder="Park fees, what to pack, safety notes..." rows={3} />
              </label>
            </>
          ) : (
            <>
              <label>
                Pricing
                <textarea
                  placeholder="Budget day trip from $55 pp, camping from $20/night, park fees..."
                  rows={3}
                />
              </label>
              <label>
                Safety & conditions
                <textarea
                  placeholder="Road conditions, weather, wildlife precautions..."
                  rows={3}
                />
              </label>
              <label>
                Transport & logistics
                <textarea
                  placeholder="Matatu route, SGR station, shared van pick-up points..."
                  rows={3}
                />
              </label>
              <label>
                Additional info
                <textarea placeholder="Best season, local tips, free activities..." rows={3} />
              </label>
            </>
          )}

          <label>
            Highlights (comma separated)
            <input placeholder="Canyon hikes, Cycling trails, Geothermal vents" />
          </label>

          <button className="primary-button full-width" type="button">
            Save destination
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const { signOut, displayName } = useAuth();
  const [activeTable, setActiveTable] = useState<keyof typeof adminTables>('Destinations');
  const [modalOpen, setModalOpen] = useState(false);
  const columns = activeTable === 'Routes' ? ['Route', 'Type', 'Distance', 'Status'] : ['Name', 'Location/Days', 'Tier/Price', 'Status'];

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
  };

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <a className="brand admin-brand" href="#home">
          <span className="brand-mark">SL</span>
          <span>
            <strong>Travel Admin</strong>
            <small>Operations</small>
          </span>
        </a>
        {(['Destinations', 'Itineraries', 'Routes'] as const).map((item) => (
          <button
            key={item}
            className={activeTable === item ? 'active' : ''}
            onClick={() => setActiveTable(item)}
            type="button"
          >
            {item}
          </button>
        ))}
        <button className="admin-signout" onClick={handleSignOut} type="button">
          Sign out
        </button>
      </aside>

      <div className="admin-main">
        <div className="admin-topline">
          <div>
            <span className="eyebrow">Admin dashboard</span>
            <h1>Manage {activeTable.toLowerCase()}</h1>
            {displayName ? <p className="admin-user-label">Signed in as {displayName}</p> : null}
          </div>
          <button className="primary-button" onClick={() => setModalOpen(true)} type="button">
            Create {activeTable.slice(0, -1)}
          </button>
        </div>

        <div className="metric-grid">
          <MetricCard label="Published destinations" value="12" trend="+3 this month" />
          <MetricCard label="Active itineraries" value="08" trend="92% booking fit" />
          <MetricCard label="Route coverage" value="24" trend="12 budget corridors" />
        </div>

        <div className="table-card">
          <div className="table-toolbar">
            <label>
              Search records
              <input placeholder={`Search ${activeTable.toLowerCase()}...`} />
            </label>
            <select defaultValue="all">
              <option value="all">All statuses</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Review</option>
            </select>
          </div>
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminTables[activeTable].map((row) => (
                  <tr key={row.join('-')}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                    <td>
                      <button type="button" onClick={() => setModalOpen(true)}>
                        Edit
                      </button>
                      <button type="button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && activeTable === 'Destinations' && (
        <DestinationAdminModal onClose={() => setModalOpen(false)} />
      )}

      {modalOpen && activeTable !== 'Destinations' && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" onClick={() => setModalOpen(false)} type="button">
              x
            </button>
            <span className="eyebrow">Create or edit</span>
            <h2 id="modal-title">{activeTable.slice(0, -1)} details</h2>
            <form className="form-stack">
              <label>
                Title
                <input placeholder={`Enter ${activeTable.slice(0, -1).toLowerCase()} title`} />
              </label>
              <label>
                Description
                <textarea placeholder="Add a short budget travel description" />
              </label>
              <div className="form-grid">
                <label>
                  Status
                  <select defaultValue="published">
                    <option value="published">Published</option>
                    <option>Draft</option>
                    <option>Review</option>
                  </select>
                </label>
                <label>
                  Price or distance
                  <input placeholder="From $45/day or 290 km" />
                </label>
              </div>
              <button className="primary-button full-width" type="button">
                Save changes
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function DestinationCard({
  destination,
  compact = false,
}: {
  destination: Destination;
  compact?: boolean;
}) {
  return (
    <article className={`destination-card ${compact ? 'compact' : ''}`}>
      <img src={destination.image} alt="" />
      <div className="card-overlay" />
      <div className="destination-card-content">
        <span>{destination.region}</span>
        <h3>{destination.title}</h3>
        <p>{destination.location}</p>
        {!compact && <small>{destination.description}</small>}
        <a href={`#destination/${destination.slug}`}>View details</a>
      </div>
    </article>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="section-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

function PageFrame({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="page-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{body}</p>
      </section>
      <section className="section page-content">{children}</section>
    </>
  );
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="info-block">
      <h2>{title}</h2>
      {typeof children === 'string' ? <p>{children}</p> : children}
    </section>
  );
}

function CommunityFeed({
  destinationSlug,
  destinationTitle,
}: {
  destinationSlug: string;
  destinationTitle: string;
}) {
  const { user, displayName, avatarInitials, isConfigured } = useAuth();
  const signedIn = isConfigured ? Boolean(user) : sessionStorage.getItem('safari-signed-in') === 'true';
  const [comment, setComment] = useState('');
  const [onGround, setOnGround] = useState(true);
  const [updates, setUpdates] = useState<CommunityUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [postError, setPostError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFeedError('');

    void fetchCommunityUpdates(destinationSlug)
      .then((data) => {
        if (active) {
          setUpdates(data);
          setLoading(false);
        }
      })
      .catch((loadError) => {
        console.error('Failed to load community updates:', loadError);
        if (active) {
          setFeedError('Could not load community updates. Try refreshing the page.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [destinationSlug]);

  const liveCount = updates.filter((update) => update.isLive && update.isOnGround).length;

  const postUpdate = async () => {
    if (!comment.trim()) {
      return;
    }

    setPosting(true);
    setPostError('');

    try {
      if (isConfigured && user) {
        const saved = await postCommunityUpdate({
          destinationSlug,
          userId: user.id,
          authorName: displayName || 'Traveler',
          comment: comment.trim(),
          isOnGround: onGround,
        });

        if (saved) {
          setUpdates((current) => [saved, ...current]);
          setComment('');
          return;
        }

        setPostError('Could not post your update right now. Try again in a moment.');
        return;
      }

      const localUpdate: CommunityUpdate = {
        id: `local-${Date.now()}`,
        destinationSlug,
        author: 'You',
        avatar: avatarInitials || 'YO',
        postedAgo: 'Just now',
        isOnGround: onGround,
        isLive: onGround,
        comment: comment.trim(),
      };
      setUpdates((current) => [localUpdate, ...current]);
      setComment('');
    } catch (postFailure) {
      console.error('Failed to post community update:', postFailure);
      setPostError('Could not post your update. Try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <section className="community-feed">
      <div className="community-header">
        <div>
          <span className="eyebrow">Live community</span>
          <h2>Traveler updates from the ground</h2>
          <p>
            Signed-in travelers share real-time notes from {destinationTitle}. On-the-ground posts
            appear with a live badge.
          </p>
        </div>
        <div className="community-live-pill">
          <span className="live-dot" />
          {liveCount > 0 ? `${liveCount} live on site` : 'No live posts yet'}
        </div>
      </div>

      <div className="community-list">
        {loading && <p className="community-empty">Loading community updates...</p>}
        {feedError ? <p className="auth-message">{feedError}</p> : null}
        {!loading && !feedError && updates.length === 0 && (
          <p className="community-empty">
            No updates yet. Be the first to share your experience at this destination.
          </p>
        )}
        {updates.map((update) => (
          <article key={update.id} className="community-card">
            <div className="community-avatar">{update.avatar}</div>
            <div className="community-body">
              <div className="community-meta">
                <strong>{update.author}</strong>
                <span>{update.postedAgo}</span>
                {update.isOnGround && <span className="ground-badge">On the ground</span>}
                {update.isLive && (
                  <span className="live-badge">
                    <span className="live-dot" />
                    Live
                  </span>
                )}
              </div>
              <p>{update.comment}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="community-compose">
        {signedIn ? (
          <>
            <label>
              Share your experience
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={`How was ${destinationTitle}? Trails, wildlife, lodges, tips...`}
                rows={4}
              />
            </label>
            <label className="ground-toggle">
              <input
                checked={onGround}
                onChange={(event) => setOnGround(event.target.checked)}
                type="checkbox"
              />
              I&apos;m on the ground at this destination right now
            </label>
            <button className="primary-button" disabled={posting} onClick={() => void postUpdate()} type="button">
              {posting ? 'Posting...' : 'Post update'}
            </button>
            {postError ? <p className="auth-message">{postError}</p> : null}
          </>
        ) : (
          <div className="community-signin-prompt">
            <p>Sign in to post live updates and help other travelers plan with confidence.</p>
            <a className="primary-button" href="#signin">
              Sign in to comment
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend}</small>
    </article>
  );
}

function PlanWithAIPage() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('5 days');
  const [budget, setBudget] = useState('Premium');
  const [travelers, setTravelers] = useState('2 travelers');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Wildlife']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    summary: string;
    days: string[];
    estimate: string;
  } | null>(null);

  const interestOptions = ['Wildlife', 'Coast', 'Hiking', 'Camping', 'Road trips', 'Hidden gems'];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  };

  const generateItinerary = () => {
    setIsGenerating(true);
    setResult(null);

    window.setTimeout(() => {
      const wantsCoast = /coast|beach|diani|ocean/i.test(prompt) || selectedInterests.includes('Coast');
      const wantsWildlife = /wildlife|safari|mara|elephant|lion/i.test(prompt) || selectedInterests.includes('Wildlife');
      const wantsHike = /hike|trek|trail|waterfall/i.test(prompt) || selectedInterests.includes('Hiking');

      const title = wantsCoast
        ? 'Savanna to Shore Signature Route'
        : wantsHike
          ? 'Rift Valley Trails & Wildlife Circuit'
          : 'Classic Kenya Wildlife Luxe Loop';

      const days = wantsCoast
        ? [
            'Day 1: Nairobi arrival and boutique hotel briefing',
            'Day 2-3: Amboseli elephant drives beneath Kilimanjaro',
            'Day 4: Tsavo red-earth safari and volcanic landscapes',
            'Day 5-6: Diani coast reset with oceanfront lodge time',
          ]
        : wantsWildlife
          ? [
              'Day 1: Fly Nairobi to Maasai Mara conservancy',
              'Day 2: Sunrise predator drive and bush breakfast',
              'Day 3: Migration corridor and sundowner plains',
              wantsHike
                ? 'Day 4: Hell\'s Gate cycling and Rift Valley viewpoints'
                : 'Day 4: Private guide day in big cat territory',
              'Day 5: Return flight and Nairobi connection',
            ]
          : [
              'Day 1: Lake Nakuru rhino and flamingo circuit',
              'Day 2: Laikipia conservancy immersion',
              'Day 3: Walking safari and cultural visit',
              'Day 4: Mount Kenya foothills scenic transfer',
              'Day 5: Nairobi departure',
            ];

      setResult({
        title,
        summary:
          prompt.trim() ||
          `A ${duration.toLowerCase()} ${budget.toLowerCase()} journey for ${travelers.toLowerCase()} focused on ${selectedInterests.join(', ').toLowerCase()}.`,
        days: days.slice(0, duration === '3 days' ? 3 : duration === '7+ days' ? 6 : 5),
        estimate: budget === 'Premium' ? '$4,200 – $6,800 pp' : budget === 'Mid-range' ? '$2,400 – $3,900 pp' : '$1,200 – $2,100 pp',
      });
      setIsGenerating(false);
    }, 1400);
  };

  return (
    <PageFrame
      eyebrow="Plan with AI"
      title="Build a budget-friendly Kenya route in minutes"
      body="Describe what you want, set your budget, and preview an affordable adventure. Frontend prototype ready for AI integration."
    >
      <div className="plan-ai-layout">
        <form
          className="plan-ai-form"
          onSubmit={(event) => {
            event.preventDefault();
            generateItinerary();
          }}
        >
          <label>
            What kind of trip do you want?
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Example: 6-day honeymoon with wildlife, a waterfall hike, and 2 nights on the coast..."
              rows={5}
            />
          </label>

          <div className="form-grid">
            <label>
              Duration
              <select value={duration} onChange={(event) => setDuration(event.target.value)}>
                <option>3 days</option>
                <option>5 days</option>
                <option>7+ days</option>
              </select>
            </label>
            <label>
              Budget
              <select value={budget} onChange={(event) => setBudget(event.target.value)}>
                <option>Essential</option>
                <option>Mid-range</option>
                <option>Premium</option>
              </select>
            </label>
            <label>
              Travelers
              <select value={travelers} onChange={(event) => setTravelers(event.target.value)}>
                <option>Solo traveler</option>
                <option>2 travelers</option>
                <option>Family of 4</option>
                <option>Group of 6+</option>
              </select>
            </label>
          </div>

          <div className="interest-picker">
            <span>Interests</span>
            <div className="interest-chips">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  className={selectedInterests.includes(interest) ? 'active' : ''}
                  onClick={() => toggleInterest(interest)}
                  type="button"
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <button className="primary-button full-width" disabled={isGenerating} type="submit">
            {isGenerating ? 'Tailoring your route...' : 'Generate tailored itinerary'}
          </button>
        </form>

        <aside className="plan-ai-result">
          {!result && !isGenerating && (
            <div className="plan-ai-empty">
              <span className="eyebrow">Your preview</span>
              <h3>Your custom route will appear here</h3>
              <p>
                Share your travel style, must-see places, and pace. We will shape a Kenya itinerary
                you can refine with a safari planner.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="plan-ai-loading">
              <div className="loading-pulse" />
              <p>Mapping parks, lodges, and transfer windows...</p>
            </div>
          )}

          {result && !isGenerating && (
            <article className="plan-ai-card">
              <span className="eyebrow">Tailored for you</span>
              <h3>{result.title}</h3>
              <p>{result.summary}</p>
              <ul>
                {result.days.map((day) => (
                  <li key={day}>{day}</li>
                ))}
              </ul>
              <div className="plan-ai-footer">
                <strong>{result.estimate}</strong>
                <a className="primary-button" href="#signup">
                  Save &amp; request quote
                </a>
              </div>
            </article>
          )}
        </aside>
      </div>
    </PageFrame>
  );
}

function Footer() {
  return (
    <footer className="footer section-dark">
      <div>
        <a className="brand" href="#home">
          <span className="brand-mark">SL</span>
          <span>
            <strong>Savanna Luxe</strong>
            <small>Budget Kenya Travel</small>
          </span>
        </a>
        <p>Affordable Kenya travel discovery, route planning, and community tips for budget explorers.</p>
      </div>
      <div className="footer-links">
        <a href="#destinations">Destinations</a>
        <a href="#itineraries">Itineraries</a>
        <a href="#plan-ai">Plan with AI</a>
        <a href="#signin">Sign in</a>
        <a href="#admin-login">Admin</a>
      </div>
      <div className="footer-links">
        <a href="#home">Privacy</a>
        <a href="#home">Terms</a>
        <a href="#home">Contact</a>
      </div>
    </footer>
  );
}

export default App;
