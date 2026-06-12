import { useEffect, useMemo, useState } from 'react';
import { categories, destinations, itineraries, testimonials, trendingThisWeek } from './data';
import type { Category, Destination } from './data';

type Route =
  | { page: 'home' }
  | { page: 'destinations' }
  | { page: 'destination'; slug: string }
  | { page: 'itineraries' }
  | { page: 'plan-ai' }
  | { page: 'signin' }
  | { page: 'signup' }
  | { page: 'admin' };

const navItems = [
  { label: 'Home', hash: '#home' },
  { label: 'Destinations', hash: '#destinations' },
  { label: 'Itineraries', hash: '#itineraries' },
  { label: 'Plan with AI', hash: '#plan-ai' },
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
    page === 'plan-ai' ||
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
        {route.page === 'plan-ai' && <PlanWithAIPage />}
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
          Sign up
        </a>
      </div>
    </header>
  );
}

function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <>
      <section className="hero section-dark">
        <div className="hero-media parallax-layer" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="eyebrow">Premium Kenya Safari Experiences</span>
          <h1 className="hero-title-horizontal">
            <span>Wild routes,</span>
            <span className="title-accent"> refined stays,</span>
            <span> unforgettable Kenyan horizons.</span>
          </h1>
          <div className="category-strip" role="list" aria-label="Travel categories">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-chip ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() =>
                  setActiveCategory(activeCategory === category.id ? null : category.id)
                }
                type="button"
                role="listitem"
              >
                <CategoryIcon icon={category.icon} />
                {category.label}
              </button>
            ))}
          </div>
          <p>
            Discover cinematic safari destinations, custom itineraries, and overland routes crafted
            for travelers who want adventure with impeccable detail.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#destinations">
              Explore destinations
            </a>
            <a className="secondary-button" href="#plan-ai">
              Plan with AI
            </a>
          </div>
        </div>
        <div className="hero-card glass-panel">
          <span>Featured route</span>
          <strong>Nairobi &rarr; Amboseli &rarr; Tsavo &rarr; Diani</strong>
          <p>8 days of elephants, volcanic wilderness, and Indian Ocean calm.</p>
        </div>
      </section>

      <section className="section trending-section">
        <SectionIntro
          eyebrow="Trending this week"
          title="What travelers are searching right now"
          body="Live momentum across wildlife crossings, coastal escapes, and hidden northern circuits."
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
          <p>“5-day wildlife and coast trip with luxury camps, easy hikes, and a hidden gem stop.”</p>
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
      title="Tailor your Kenya itinerary in minutes"
      body="Describe what you want, set your preferences, and preview a custom route. This is a frontend prototype ready for AI integration."
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

function CategoryIcon({ icon }: { icon: Category['icon'] }) {
  const paths: Record<Category['icon'], React.ReactElement> = {
    hiking: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 20l3.5-7 2.5 2 3-6 3.5 11H7Z" />
      </svg>
    ),
    waterfall: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4v8l-2 3v5h4v-5l-2-3V4Zm8 0v6l2 3v6h-4v-6l2-3V4ZM12 2v4" />
      </svg>
    ),
    camping: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20 12 4l8 16H4Zm8-10 4 8H8l4-8Z" />
      </svg>
    ),
    roadtrip: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 11h14l-1.5-4.5H6.5L5 11Zm-1 2v5h2v-2h12v2h2v-5H4Zm4 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>
    ),
    gem: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 7 7-7 11L5 10l7-7Zm0 4.2L8.3 10 12 16.3 15.7 10 12 7.2Z" />
      </svg>
    ),
    wildlife: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 8c0-2 1.5-3 3-3s3 1 3 3-1.5 3-3 3-3-1-3-3Zm6 0c0-2 1.5-3 3-3s3 1 3 3-1.5 3-3 3-3-1-3-3ZM4 14c2 2 5 3 8 3s6-1 8-3c-1 3-4 5-8 5s-7-2-8-5Z" />
      </svg>
    ),
    coast: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 14c2 1 4 1 6 0s4-1 6 0 4 1 6 0v3H3v-3Zm0-3c2 1 4 1 6 0s4-1 6 0 4 1 6 0v2H3v-2Z" />
      </svg>
    ),
  };

  return <span className="category-icon">{paths[icon]}</span>;
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
        <a href="#plan-ai">Plan with AI</a>
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
