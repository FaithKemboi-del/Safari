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
import {
  pickFeaturedDestinations,
  pickFeaturedItineraries,
  pickTrendingItems,
} from './lib/landingContent';
import type { CommunityUpdate, Destination } from './data';
import {
  destinationMatchesProvince,
  destinationMatchesSearch,
  KENYA_PROVINCE_FILTER_OPTIONS,
} from './lib/kenyaProvinces';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';
import { fetchCommunityUpdates, postCommunityUpdate } from './services/safariApi';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Brand } from './components/Brand';
import { CategoryIcon, CategoryPage } from './components/CategoryPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminProtected } from './components/AdminProtected';
import { NavIcon, ProvinceIcon, type NavIconName } from './components/SafiriIcons';
import { CategorySpotPage } from './components/CategorySpotPage';
import { TrailPage } from './components/TrailPage';
import { BRAND_NAME, TRAILS_FEATURE_NAME } from './lib/config';

type Route =
  | { page: 'home' }
  | { page: 'destinations' }
  | { page: 'destination'; slug: string }
  | { page: 'category'; id: string }
  | { page: 'trail'; id: string }
  | { page: 'spot'; id: string }
  | { page: 'itineraries'; id?: string }
  | { page: 'plan-ai' }
  | { page: 'signin' }
  | { page: 'signup' }
  | { page: 'admin-login' }
  | { page: 'admin' };

const navItems: { label: string; hash: string; icon: NavIconName }[] = [
  { label: 'Home', hash: '#home', icon: 'home' },
  { label: 'Destinations', hash: '#destinations', icon: 'destinations' },
  { label: 'Itineraries', hash: '#itineraries', icon: 'itineraries' },
  { label: 'Plan with AI', hash: '#plan-ai', icon: 'plan' },
];

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

  if (page === 'spot' && slug) {
    return { page: 'spot', id: slug };
  }

  if (page === 'itineraries') {
    return slug ? { page: 'itineraries', id: slug } : { page: 'itineraries' };
  }

  if (
    page === 'destinations' ||
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

  if (route.page === 'spot') {
    return `spot/${route.id}`;
  }

  if (route.page === 'itineraries') {
    return route.id ? `itineraries/${route.id}` : 'itineraries';
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
      : route.page === 'category' || route.page === 'trail' || route.page === 'spot'
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
        {route.page === 'spot' && <CategorySpotPage spotId={route.id} />}
        {route.page === 'itineraries' && <ItinerariesPage selectedItineraryId={route.id} />}
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
      <Brand />

      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a
            key={item.hash}
            className={activePage === item.hash.replace('#', '') ? 'active' : ''}
            href={item.hash}
          >
            <NavIcon name={item.icon} />
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
  const featuredDestinations = useMemo(
    () => pickFeaturedDestinations(destinations),
    [destinations],
  );
  const featuredItineraries = useMemo(() => pickFeaturedItineraries(itineraries), [itineraries]);
  const trendingItems = useMemo(
    () => pickTrendingItems(destinations, trendingThisWeek),
    [destinations],
  );

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
        <div className="trending-grid trending-grid--even">
          {trendingItems.map((item) => (
            <article key={item.id} className="trending-card">
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
        <div className="destination-row destination-row--even">
          {featuredDestinations.map((destination) => (
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
        <div className="itinerary-showcase itinerary-showcase--even">
          {featuredItineraries.map((itinerary) => (
            <article key={itinerary.id} className="showcase-card">
              <img src={itinerary.image} alt="" />
              <div className="showcase-card__body">
                <span>{itinerary.duration}</span>
                <h3>{itinerary.title}</h3>
                <p>{itinerary.route}</p>
                <div className="showcase-card__footer">
                  <strong>{itinerary.price}</strong>
                  <a href={`#itineraries/${itinerary.id}`}>View details</a>
                </div>
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
              Browse budget destinations, follow {TRAILS_FEATURE_NAME} with free maps, and get live tips
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
      eyebrow="Safiri destinations"
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
        <div className="province-filter" role="group" aria-label="Filter by province">
          <span className="province-filter-label">Filter by province</span>
          <div className="province-filter-chips">
            {KENYA_PROVINCE_FILTER_OPTIONS.map((provinceName) => (
              <button
                key={provinceName}
                className={province === provinceName ? 'active' : ''}
                onClick={() => setProvince(provinceName)}
                type="button"
              >
                <ProvinceIcon name={provinceName} />
                {provinceName}
              </button>
            ))}
          </div>
        </div>
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

function ItinerariesPage({ selectedItineraryId }: { selectedItineraryId?: string }) {
  const { itineraries } = useData();
  const [openItem, setOpenItem] = useState('');

  useEffect(() => {
    if (!itineraries.length) {
      return;
    }

    const target =
      itineraries.find((item) => item.id === selectedItineraryId) ?? itineraries[0];
    if (!target) {
      return;
    }

    const firstDay = target.days[0]?.day ?? 'Day 1';
    setOpenItem(`${target.id}-${firstDay}`);

    if (selectedItineraryId) {
      window.requestAnimationFrame(() => {
        document.getElementById(`itinerary-${target.id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  }, [itineraries, selectedItineraryId]);

  return (
    <PageFrame
      eyebrow="Travel itineraries"
      title="Budget routes you can follow day by day"
      body="Each itinerary uses expandable day-by-day details so travelers can scan the journey, then dive deeper into the moments that matter."
    >
      <div className="timeline-list">
        {itineraries.map((itinerary) => (
          <article key={itinerary.id} className="timeline-card" id={`itinerary-${itinerary.id}`}>
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
        <h2>{isSignUp ? `Join ${BRAND_NAME}` : 'Access your dashboard'}</h2>
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
          {isSignUp ? 'Already have an account?' : `New to ${BRAND_NAME}?`}{' '}
          <a href={isSignUp ? '#signin' : '#signup'}>{isSignUp ? 'Sign in' : 'Create one'}</a>
        </p>
      </div>
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
        ? 'Safiri to Shore Signature Route'
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
        <Brand />
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
