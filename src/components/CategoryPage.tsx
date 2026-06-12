import { useEffect, useMemo, useState } from 'react';
import { categories } from '../data';
import type { Category } from '../data';
import {
  categoryMeta,
  categorySpots,
  eventChatKey,
  ALLTRAILS_KENYA_URL,
  HIKE_RECORDS_KEY,
  hikingTrails,
  kenyaEvents,
  seedEventChat,
  type EventChatMessage,
  type EventStatus,
  type HikeRecord,
} from '../categoryContent';
import { useAuth } from '../context/AuthContext';

function CategoryIcon({ icon }: { icon: Category['icon'] }) {
  const paths: Record<Category['icon'], string> = {
    hiking: 'M13.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 20l3.5-7 2.5 2 3-6 3.5 11H7Z',
    waterfall: 'M8 4v8l-2 3v5h4v-5l-2-3V4Zm8 0v6l2 3v6h-4v-6l2-3V4ZM12 2v4',
    camping: 'M4 20 12 4l8 16H4Zm8-10 4 8H8l4-8Z',
    roadtrip: 'M5 11h14l-1.5-4.5H6.5L5 11Zm-1 2v5h2v-2h12v2h2v-5H4Zm4 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
    gem: 'm12 3 7 7-7 11L5 10l7-7Zm0 4.2L8.3 10 12 16.3 15.7 10 12 7.2Z',
    wildlife: 'M6 8c0-2 1.5-3 3-3s3 1 3 3-1.5 3-3 3-3-1-3-3Zm6 0c0-2 1.5-3 3-3s3 1 3 3-1.5 3-3 3-3-1-3-3ZM4 14c2 2 5 3 8 3s6-1 8-3c-1 3-4 5-8 5s-7-2-8-5Z',
    coast: 'M3 14c2 1 4 1 6 0s4-1 6 0 4 1 6 0v3H3v-3Zm0-3c2 1 4 1 6 0s4-1 6 0 4 1 6 0v2H3v-2Z',
    events: 'M7 3v2H5v16h14V5h-2V3h-2v2H9V3H7Zm12 8H5v8h14v-8ZM7 13h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Z',
  };

  return (
    <span className="category-icon">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={paths[icon]} />
      </svg>
    </span>
  );
}

export function CategoryPage({ categoryId }: { categoryId: string }) {
  const category = categories.find((item) => item.id === categoryId) ?? categories[0];
  const meta = categoryMeta[category.id] ?? categoryMeta.hiking;
  const spots = categorySpots.filter((spot) => spot.categoryId === category.id);

  if (category.id === 'hiking') {
    return <HikingCategoryPage category={category} meta={meta} spots={spots} />;
  }

  if (category.id === 'events') {
    return <EventsCategoryPage category={category} meta={meta} />;
  }

  return <GenericCategoryPage category={category} meta={meta} spots={spots} />;
}

function GenericCategoryPage({
  category,
  meta,
  spots,
}: {
  category: Category;
  meta: { title: string; subtitle: string; eyebrow: string };
  spots: typeof categorySpots;
}) {
  return (
    <div className={`category-page category-page--${category.theme}`}>
      <section className="category-hero">
        <div className="category-hero-inner">
          <a className="category-back" href="#home">
            ← All categories
          </a>
          <span className="eyebrow">{meta.eyebrow}</span>
          <h1>{meta.title}</h1>
          <p>{meta.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-intro">
          <h2>Budget-friendly picks</h2>
          <p>Hand-picked Kenyan spots that keep costs low without skipping the experience.</p>
        </div>
        <div className="category-spot-grid">
          {spots.map((spot) => (
            <article key={spot.id} className="category-spot-card">
              <img src={spot.image} alt="" />
              <div>
                <span className="spot-budget">{spot.budget}</span>
                <h3>{spot.title}</h3>
                <p className="spot-location">{spot.location}</p>
                <p>{spot.description}</p>
                {spot.slug ? (
                  <a href={`#destination/${spot.slug}`}>View details</a>
                ) : spot.mapQuery ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.mapQuery)}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open in Google Maps
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function HikingCategoryPage({
  category,
  meta,
  spots,
}: {
  category: Category;
  meta: { title: string; subtitle: string; eyebrow: string };
  spots: typeof categorySpots;
}) {
  const [records, setRecords] = useState<HikeRecord[]>([]);
  const [trailName, setTrailName] = useState('Mount Kenya — Naromoru Route');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(HIKE_RECORDS_KEY);
    if (stored) {
      setRecords(JSON.parse(stored) as HikeRecord[]);
    }
  }, []);

  const saveHike = () => {
    if (!trailName.trim() || !date) {
      return;
    }

    const record: HikeRecord = {
      id: `hike-${Date.now()}`,
      trailName: trailName.trim(),
      date,
      duration,
      distance,
      notes,
      createdAt: new Date().toISOString(),
    };

    const next = [record, ...records];
    setRecords(next);
    localStorage.setItem(HIKE_RECORDS_KEY, JSON.stringify(next));
    setDuration('');
    setDistance('');
    setNotes('');
  };

  return (
    <div className={`category-page category-page--${category.theme}`}>
      <section className="category-hero">
        <div className="category-hero-inner">
          <a className="category-back" href="#home">
            ← All categories
          </a>
          <span className="eyebrow">{meta.eyebrow}</span>
          <h1>{meta.title}</h1>
          <p>{meta.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-intro">
          <h2>Featured hiking trails</h2>
          <p>
            Preview the route below, open turn-by-turn directions in Google Maps, or jump to AllTrails
            for elevation profiles, reviews, and GPX downloads.
          </p>
        </div>

        <div className="trail-map-guide glass-panel">
          <div>
            <span className="eyebrow">Maps &amp; trails</span>
            <h3>Two ways to follow every route</h3>
            <p>
              <strong>Google Maps</strong> is best for getting to the trailhead and navigating on the
              road. <strong>AllTrails</strong> adds the full hiking path, distance, elevation, and
              hiker reviews — ideal once you&apos;re on the trail.
            </p>
          </div>
          <a className="secondary-button" href={ALLTRAILS_KENYA_URL} rel="noreferrer" target="_blank">
            Browse all Kenya trails on AllTrails
          </a>
        </div>

        <div className="trail-list">
          {hikingTrails.map((trail) => (
            <article key={trail.id} className="trail-card">
              <img src={trail.image} alt="" />
              <div className="trail-content">
                <span className="spot-budget">{trail.budget}</span>
                <h3>{trail.title}</h3>
                <p className="spot-location">{trail.location}</p>
                <p>{trail.description}</p>
                <div className="trail-meta">
                  <span>{trail.difficulty}</span>
                  <span>{trail.duration}</span>
                </div>
                <div className="trail-actions">
                  <a
                    className="primary-button"
                    href={trail.googleMapsUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open in Google Maps
                  </a>
                  {trail.allTrailsUrl && (
                    <a
                      className="alltrails-button"
                      href={trail.allTrailsUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      View on AllTrails
                    </a>
                  )}
                  {trail.slug && <a href={`#destination/${trail.slug}`}>Destination page</a>}
                </div>
                <div className="map-frame trail-map">
                  <iframe
                    title={`${trail.title} map`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(trail.mapQuery)}&output=embed`}
                    loading="lazy"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section category-muted-band">
        <div className="section-intro">
          <h2>More budget hiking destinations</h2>
        </div>
        <div className="category-spot-grid">
          {spots.map((spot) => (
            <article key={spot.id} className="category-spot-card">
              <img src={spot.image} alt="" />
              <div>
                <span className="spot-budget">{spot.budget}</span>
                <h3>{spot.title}</h3>
                <p className="spot-location">{spot.location}</p>
                <p>{spot.description}</p>
                {spot.slug && <a href={`#destination/${spot.slug}`}>View details</a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-intro">
          <h2>Record your hike</h2>
          <p>
            Log trails you&apos;ve completed — saved on this device in your browser (localStorage).
            Sign in + Supabase sync can be added later.
          </p>
        </div>
        <div className="hike-record-layout">
          <form
            className="hike-record-form"
            onSubmit={(event) => {
              event.preventDefault();
              saveHike();
            }}
          >
            <label>
              Trail name
              <select value={trailName} onChange={(event) => setTrailName(event.target.value)}>
                {hikingTrails.map((trail) => (
                  <option key={trail.id}>{trail.title}</option>
                ))}
                <option>Other trail</option>
              </select>
            </label>
            <div className="form-grid">
              <label>
                Date
                <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </label>
              <label>
                Duration
                <input placeholder="4h 30m" value={duration} onChange={(event) => setDuration(event.target.value)} />
              </label>
              <label>
                Distance
                <input placeholder="12 km" value={distance} onChange={(event) => setDistance(event.target.value)} />
              </label>
            </div>
            <label>
              Notes
              <textarea
                placeholder="How was the trail? Weather, costs, tips for other hikers..."
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </label>
            <button className="primary-button" type="submit">
              Save hike record
            </button>
          </form>

          <div className="hike-record-list">
            <h3>Your recorded hikes</h3>
            {records.length === 0 && (
              <p className="community-empty">No hikes recorded yet. Complete the form after your next trek.</p>
            )}
            {records.map((record) => (
              <article key={record.id} className="hike-record-card">
                <strong>{record.trailName}</strong>
                <span>{record.date}</span>
                {record.duration && <small>Duration: {record.duration}</small>}
                {record.distance && <small>Distance: {record.distance}</small>}
                {record.notes && <p>{record.notes}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function EventsCategoryPage({
  category,
  meta,
}: {
  category: Category;
  meta: { title: string; subtitle: string; eyebrow: string };
}) {
  const [filter, setFilter] = useState<EventStatus>('happening-now');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const filtered = useMemo(
    () => kenyaEvents.filter((event) => event.status === filter),
    [filter],
  );

  const liveEvents = kenyaEvents.filter((event) => event.status === 'happening-now');

  useEffect(() => {
    if (filter === 'happening-now' && liveEvents[0] && !selectedEventId) {
      setSelectedEventId(liveEvents[0].id);
    }
  }, [filter, liveEvents, selectedEventId]);

  return (
    <div className={`category-page category-page--${category.theme}`}>
      <section className="category-hero">
        <div className="category-hero-inner">
          <a className="category-back" href="#home">
            ← All categories
          </a>
          <span className="eyebrow">{meta.eyebrow}</span>
          <h1>{meta.title}</h1>
          <p>{meta.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="event-filters" role="tablist" aria-label="Event filters">
          {(
            [
              ['happening-now', 'Happening now'],
              ['upcoming', 'Upcoming'],
              ['past', 'Past'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              className={filter === value ? 'active' : ''}
              onClick={() => setFilter(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="category-spot-grid">
          {filtered.map((event) => (
            <article
              key={event.id}
              className={`category-spot-card event-card ${selectedEventId === event.id ? 'selected' : ''}`}
            >
              <img src={event.image} alt="" />
              <div>
                <span className={`event-status event-status--${event.status}`}>
                  {event.status.replace('-', ' ')}
                </span>
                <span className="spot-budget">{event.budget}</span>
                <h3>{event.title}</h3>
                <p className="spot-location">
                  {event.location} · {event.dateLabel}
                </p>
                <p>{event.description}</p>
                {event.status === 'happening-now' && (
                  <button
                    className="secondary-button compact-button"
                    onClick={() => setSelectedEventId(event.id)}
                    type="button"
                  >
                    Join live chat
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {filter === 'happening-now' && selectedEventId && (
        <section className="section">
          <EventLiveChat
            event={kenyaEvents.find((item) => item.id === selectedEventId)!}
            onClose={() => setSelectedEventId(null)}
          />
        </section>
      )}
    </div>
  );
}

function EventLiveChat({
  event,
  onClose,
}: {
  event: (typeof kenyaEvents)[0];
  onClose: () => void;
}) {
  const { user, displayName, isConfigured } = useAuth();
  const signedIn = isConfigured ? Boolean(user) : sessionStorage.getItem('safari-signed-in') === 'true';
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<EventChatMessage[]>([]);

  useEffect(() => {
    const key = eventChatKey(event.id);
    const stored = localStorage.getItem(key);
    const seeded = seedEventChat.filter((item) => item.eventId === event.id);
    const local = stored ? (JSON.parse(stored) as EventChatMessage[]) : [];
    setMessages([...local, ...seeded]);
  }, [event.id]);

  const postMessage = () => {
    if (!message.trim()) {
      return;
    }

    const newMessage: EventChatMessage = {
      id: `ec-local-${Date.now()}`,
      eventId: event.id,
      author: signedIn ? displayName || 'You' : 'Guest',
      message: message.trim(),
      postedAgo: 'Just now',
      isLive: true,
    };

    const key = eventChatKey(event.id);
    const stored = localStorage.getItem(key);
    const local = stored ? (JSON.parse(stored) as EventChatMessage[]) : [];
    const nextLocal = [newMessage, ...local];
    localStorage.setItem(key, JSON.stringify(nextLocal));
    setMessages((current) => [newMessage, ...current]);
    setMessage('');
  };

  return (
    <div className="event-chat-panel">
      <div className="event-chat-header">
        <div>
          <span className="eyebrow">Live at this event</span>
          <h2>{event.title}</h2>
          <p>{event.location} — tell others how it feels right now.</p>
        </div>
        <button className="modal-close" onClick={onClose} type="button">
          x
        </button>
      </div>

      <div className="community-list">
        {messages.map((chat) => (
          <article key={chat.id} className="community-card">
            <div className="community-avatar">{chat.author.slice(0, 2).toUpperCase()}</div>
            <div className="community-body">
              <div className="community-meta">
                <strong>{chat.author}</strong>
                <span>{chat.postedAgo}</span>
                {chat.isLive && (
                  <span className="live-badge">
                    <span className="live-dot" />
                    Live
                  </span>
                )}
              </div>
              <p>{chat.message}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="community-compose">
        {signedIn ? (
          <>
            <label>
              How&apos;s the event right now?
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Crowds, vibes, food, music, tips..."
                rows={3}
              />
            </label>
            <button className="primary-button" onClick={postMessage} type="button">
              Post live update
            </button>
          </>
        ) : (
          <div className="community-signin-prompt">
            <p>Sign in to join the live event chat.</p>
            <a className="primary-button" href="#signin">
              Sign in
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export { CategoryIcon };
