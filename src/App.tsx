import { useEffect, useMemo, useState } from 'react';
import { destinations, itineraries, testimonials } from './data';
import type { Destination } from './data';

type Route =
  | { page: 'home' }
  | { page: 'destinations' }
  | { page: 'destination'; slug: string }
  | { page: 'itineraries' }
  | { page: 'signin' }
  | { page: 'signup' }
  | { page: 'admin' };

const navItems = [
  { label: 'Home', hash: '#home' },
  { label: 'Destinations', hash: '#destinations' },
  { label: 'Itineraries', hash: '#itineraries' },
  { label: 'Admin', hash: '#admin' },
];

const adminTables = {
  Destinations: [
    ['Maasai Mara', 'Narok', 'Premium', 'Published'],
    ['Amboseli', 'Kajiado', 'Classic', 'Published'],
    ['Laikipia', 'Nanyuki', 'Exclusive', 'Draft'],
  ],
  Itineraries: [
    ['Great Migration Luxe Escape', '5 days', '$3,850 pp', 'Live'],
    ['Big Five to Barefoot Coast', '8 days', '$4,940 pp', 'Live'],
    ['Rift Valley Signature Circuit', '6 days', '$4,250 pp', 'Review'],
  ],
  Routes: [
    ['Nairobi -> Maasai Mara', 'Fly-in', '290 km', 'Active'],
    ['Amboseli -> Tsavo -> Diani', 'Road + SGR', '690 km', 'Active'],
    ['Nairobi -> Lake Nakuru -> Laikipia', 'Private 4x4', '510 km', 'Draft'],
  ],
};

function parseHash(): Route {
  const hash = window.location.hash.replace('#', '') || 'home';
  const [page, slug] = hash.split('/');

  if (page === 'destination' && slug) {
    return { page: 'destination', slug };
  }

  if (
    page === 'destinations' ||
    page === 'itineraries' ||
    page === 'signin' ||
    page === 'signup' ||
    page === 'admin'
  ) {
    return { page };
  }

  return { page: 'home' };
}

function App() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);

    if (!window.location.hash) {
      window.location.hash = 'home';
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const activePage = route.page === 'destination' ? 'destinations' : route.page;

  return (
    <div className="site-shell">
      <Header activePage={activePage} />
      <main>
        {route.page === 'home' && <HomePage />}
        {route.page === 'destinations' && <DestinationsPage />}
        {route.page === 'destination' && <DestinationDetailPage slug={route.slug} />}
        {route.page === 'itineraries' && <ItinerariesPage />}
        {route.page === 'signin' && <AuthPage mode="signin" />}
        {route.page === 'signup' && <AuthPage mode="signup" />}
        {route.page === 'admin' && <AdminDashboard />}
      </main>
      {route.page !== 'admin' && <Footer />}
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
          <small>Kenya Safari Studio</small>
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
          Plan trip
        </a>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero section-dark">
        <div className="hero-media" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="eyebrow">Premium Kenya Safari Experiences</span>
          <h1>Wild routes, refined stays, unforgettable Kenyan horizons.</h1>
          <p>
            Discover cinematic safari destinations, custom itineraries, and overland routes crafted
            for travelers who want adventure with impeccable detail.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#destinations">
              Explore destinations
            </a>
            <a className="secondary-button" href="#itineraries">
              View itineraries
            </a>
          </div>
        </div>
        <div className="hero-card glass-panel">
          <span>Featured route</span>
          <strong>Nairobi &rarr; Amboseli &rarr; Tsavo &rarr; Diani</strong>
          <p>8 days of elephants, volcanic wilderness, and Indian Ocean calm.</p>
        </div>
      </section>

      <section className="section">
        <SectionIntro
          eyebrow="Featured destinations"
          title="The safari icons travelers dream about"
          body="From migration plains to private conservancies, these Kenyan destinations combine big wildlife moments with premium lodge experiences."
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
          title="Curated journeys with rhythm and drama"
          body="Each route balances peak wildlife windows, smooth transfers, distinctive camps, and downtime that keeps the experience elevated."
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
          body="A polished, visual experience gives travelers confidence before they ever speak with a safari planner."
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
    </>
  );
}

function DestinationsPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const regions = ['All', ...Array.from(new Set(destinations.map((destination) => destination.region)))];

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const matchesRegion = region === 'All' || destination.region === region;
      const searchable = `${destination.title} ${destination.location} ${destination.description}`.toLowerCase();
      return matchesRegion && searchable.includes(search.toLowerCase());
    });
  }, [region, search]);

  return (
    <PageFrame
      eyebrow="Safari destinations"
      title="Find your next Kenya safari setting"
      body="Search by name, region, or experience style. Filters are UI-ready for backend integration."
    >
      <div className="filter-panel">
        <label>
          Search destinations
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try Maasai Mara, rhino, coast..."
          />
        </label>
        <label>
          Filter by region
          <select value={region} onChange={(event) => setRegion(event.target.value)}>
            {regions.map((regionName) => (
              <option key={regionName}>{regionName}</option>
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
  const destination = destinations.find((item) => item.slug === slug) ?? destinations[0];
  const related = destinations
    .filter((item) => item.slug !== destination.slug)
    .filter((item) => item.region === destination.region || item.difficulty === destination.difficulty)
    .slice(0, 3);
  const fallbackRelated = related.length ? related : destinations.filter((item) => item.slug !== destination.slug).slice(0, 3);

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
            <span>{destination.region}</span>
            <span>{destination.difficulty}</span>
            <span>{destination.bestTime.split(' ')[0]} season</span>
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
            <InfoBlock title="Budget">{destination.budget}</InfoBlock>
            <InfoBlock title="Difficulty level">{destination.difficulty}</InfoBlock>
            <InfoBlock title="Best time to visit">{destination.bestTime}</InfoBlock>
            <InfoBlock title="Transport info">{destination.transport}</InfoBlock>
          </div>

          <InfoBlock title="Experience highlights">
            <div className="tag-list">
              {destination.highlights.map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>
          </InfoBlock>

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
          <h2>Design this safari</h2>
          <p>Pair {destination.title} with flights, conservation-led camps, and seamless transfers.</p>
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
  const [openItem, setOpenItem] = useState(`${itineraries[0].id}-${itineraries[0].days[0].day}`);

  return (
    <PageFrame
      eyebrow="Travel itineraries"
      title="Timeline routes built for safari momentum"
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

  return (
    <section className="auth-page">
      <div className="auth-visual section-dark">
        <div className="auth-image" />
        <div className="hero-overlay" />
        <div>
          <span className="eyebrow">Member access</span>
          <h1>{isSignUp ? 'Start planning a remarkable safari.' : 'Welcome back to your safari plans.'}</h1>
          <p>
            Save destinations, compare routes, and coordinate premium itineraries with a modern
            travel workspace.
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
        <form className="form-stack">
          {isSignUp && (
            <label>
              Full name
              <input placeholder="Amina Safari" />
            </label>
          )}
          <label>
            Email address
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" />
          </label>
          {isSignUp && (
            <label>
              Travel style
              <select defaultValue="">
                <option value="" disabled>
                  Choose a preference
                </option>
                <option>Luxury fly-in safari</option>
                <option>Family adventure</option>
                <option>Photography expedition</option>
              </select>
            </label>
          )}
          <button className="primary-button full-width" type="button">
            {isSignUp ? 'Create account' : 'Sign in'}
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

function AdminDashboard() {
  const [activeTable, setActiveTable] = useState<keyof typeof adminTables>('Destinations');
  const [modalOpen, setModalOpen] = useState(false);
  const columns = activeTable === 'Routes' ? ['Route', 'Type', 'Distance', 'Status'] : ['Name', 'Location/Days', 'Tier/Price', 'Status'];

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <a className="brand admin-brand" href="#home">
          <span className="brand-mark">SL</span>
          <span>
            <strong>Safari Admin</strong>
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
      </aside>

      <div className="admin-main">
        <div className="admin-topline">
          <div>
            <span className="eyebrow">Admin dashboard</span>
            <h1>Manage {activeTable.toLowerCase()}</h1>
          </div>
          <button className="primary-button" onClick={() => setModalOpen(true)} type="button">
            Create {activeTable.slice(0, -1)}
          </button>
        </div>

        <div className="metric-grid">
          <MetricCard label="Published destinations" value="12" trend="+3 this month" />
          <MetricCard label="Active itineraries" value="08" trend="92% booking fit" />
          <MetricCard label="Route coverage" value="24" trend="6 premium corridors" />
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

      {modalOpen && (
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
                <textarea placeholder="Add a short premium travel description" />
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
                  <input placeholder="$4,250 pp or 510 km" />
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
  children: React.ReactNode;
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

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="info-block">
      <h2>{title}</h2>
      {typeof children === 'string' ? <p>{children}</p> : children}
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

function Footer() {
  return (
    <footer className="footer section-dark">
      <div>
        <a className="brand" href="#home">
          <span className="brand-mark">SL</span>
          <span>
            <strong>Savanna Luxe</strong>
            <small>Kenya Safari Studio</small>
          </span>
        </a>
        <p>Premium safari discovery, itinerary planning, and route showcases for Kenya.</p>
      </div>
      <div className="footer-links">
        <a href="#destinations">Destinations</a>
        <a href="#itineraries">Itineraries</a>
        <a href="#signin">Sign in</a>
        <a href="#admin">Admin</a>
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
