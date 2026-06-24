import { generatedCategorySpots } from './content/generatedCategorySpots';
import { generatedKenyaEvents } from './content/generatedKenyaEvents';

export type EventStatus = 'happening-now' | 'upcoming' | 'past';

export type CategorySpot = {
  id: string;
  categoryId: string;
  title: string;
  location: string;
  budget: string;
  description: string;
  image: string;
  slug?: string;
  trailId?: string;
  mapQuery?: string;
  dateLabel?: string;
  eventStatus?: EventStatus;
};

export type HikingTrail = {
  id: string;
  title: string;
  location: string;
  difficulty: string;
  duration: string;
  budget: string;
  description: string;
  image: string;
  mapQuery: string;
  googleMapsUrl: string;
  allTrailsUrl?: string;
  slug?: string;
};

export const ALLTRAILS_KENYA_URL = 'https://www.alltrails.com/kenya';

export type HikeRecord = {
  id: string;
  trailName: string;
  date: string;
  duration: string;
  distance: string;
  notes: string;
  createdAt: string;
};

export type KenyaEvent = {
  id: string;
  title: string;
  location: string;
  dateLabel: string;
  status: EventStatus;
  budget: string;
  description: string;
  image: string;
  slug?: string;
  mapQuery?: string;
};

export type EventChatMessage = {
  id: string;
  eventId: string;
  author: string;
  message: string;
  postedAgo: string;
  isLive: boolean;
};

export const categoryMeta: Record<
  string,
  { title: string; subtitle: string; eyebrow: string }
> = {
  hiking: {
    eyebrow: 'Hiking',
    title: 'Kenya trails on a budget',
    subtitle: 'Day hikes, multi-day routes, and maps you can follow — including Mount Kenya Naromoru.',
  },
  waterfalls: {
    eyebrow: 'Waterfalls',
    title: 'Chasing waterfalls across Kenya',
    subtitle:
      'From misty highland cascades to hidden forest pools — budget-friendly falls from the coast to the central highlands.',
  },
  camping: {
    eyebrow: 'Camping',
    title: 'Camp under Kenyan skies',
    subtitle: 'Public campsites, community grounds, and low-cost outdoor stays.',
  },
  roadtrips: {
    eyebrow: 'Road trips',
    title: 'Budget overland routes',
    subtitle: 'Matatu hops, SGR legs, and shared vans across Kenya.',
  },
  'hidden-gems': {
    eyebrow: 'Hidden gems',
    title: 'Kenya\'s best-kept secrets',
    subtitle: 'Quiet viewpoints, village trails, and local favorites — discovered on a shoestring.',
  },
  wildlife: {
    eyebrow: 'Wildlife',
    title: 'Wildlife without the luxury price tag',
    subtitle: 'Parks, conservancies, and day trips that fit a backpacker budget.',
  },
  coast: {
    eyebrow: 'Coast',
    title: 'Indian Ocean on a shoestring',
    subtitle: 'Beaches, dhow trips, and coastal towns that won\'t drain your wallet.',
  },
  events: {
    eyebrow: 'Events',
    title: 'Where Kenya comes alive',
    subtitle: 'Festivals, night markets, and cultural gatherings — happening now, coming soon, or worth remembering.',
  },
  staycations: {
    eyebrow: 'Staycations',
    title: 'Budget weekend resets',
    subtitle: 'Lakeside bandas, forest cottages, and city escapes without resort prices.',
  },
};

export const categorySpots: CategorySpot[] = generatedCategorySpots;

export const hikingTrails: HikingTrail[] = [
  {
    id: 'mt-kenya-naromoru',
    title: 'Mount Kenya — Naromoru Route',
    location: 'Nyeri County',
    difficulty: 'Challenging — multi-day, altitude up to Point Lenana (4,985m)',
    duration: '3–4 days with budget bunkhouses',
    budget: 'From ~$120–$180 pp (park fees, guide, basic hut)',
    description:
      'Classic budget approach to Point Lenana via Naromoru Gate. Hire guides at the gate, pack warm layers, and acclimatize slowly.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    mapQuery: 'Mount Kenya Naromoru Gate Trailhead Kenya',
    googleMapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Mount+Kenya+Naromoru+Gate+Kenya&travelmode=walking',
    allTrailsUrl: 'https://www.alltrails.com/trail/kenya/central/mount-kenya-summit-naro-moru-route',
  },
  {
    id: 'mt-kenya-sirimon',
    title: 'Mount Kenya — Sirimon Route',
    location: 'Nanyuki',
    difficulty: 'Moderate to challenging — gentler ascent than Naromoru',
    duration: '3 days typical for Lenana',
    budget: 'From ~$130 pp with community guides',
    description: `Gradual trail through montane forest
popular with budget trekking groups from Nanyuki.`,
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
    mapQuery: 'Mount Kenya Sirimon Gate Kenya',
    googleMapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Mount+Kenya+Sirimon+Gate+Kenya&travelmode=walking',
    allTrailsUrl: 'https://www.alltrails.com/trail/kenya/central/mount-kenya-summit-sirimon-route',
  },
  {
    id: 'longonot-trail',
    title: 'Mount Longonot crater trail',
    location: 'Naivasha',
    difficulty: 'Moderate — steep sections, 3–4 hours up',
    duration: 'Half day',
    budget: 'Under $35 total from Nairobi',
    description: `Rim hike with Rift Valley views
matatu to Naivasha then taxi to gate.`,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    mapQuery: 'Mount Longonot National Park Kenya',
    googleMapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Mount+Longonot+National+Park+Kenya&travelmode=walking',
    allTrailsUrl: 'https://www.alltrails.com/trail/kenya/rift-valley/mount-longonot',
    slug: 'longonot',
  },
];

export const kenyaEvents: KenyaEvent[] = generatedKenyaEvents;

export const seedEventChat: EventChatMessage[] = [
  {
    id: 'ec-1',
    eventId: 'event-lamu-cultural-festival',
    author: 'Fatma A.',
    message: 'Dhow race just finished — incredible energy at the waterfront!',
    postedAgo: '5 min ago',
    isLive: true,
  },
  {
    id: 'ec-2',
    eventId: 'event-lamu-cultural-festival',
    author: 'Chris O.',
    message: 'Food stalls near the fort are cheap and busy — get there before 8pm.',
    postedAgo: '18 min ago',
    isLive: true,
  },
  {
    id: 'ec-3',
    eventId: 'event-nairobi-night-market',
    author: 'Joy K.',
    message: 'Music is live now, line for nyama choma is long but moving fast.',
    postedAgo: '2 min ago',
    isLive: true,
  },
];

export const HIKE_RECORDS_KEY = 'kenya-hike-records';
export const eventChatKey = (eventId: string) => `kenya-event-chat-${eventId}`;

/** Merged local spots + events for Supabase fallback and one-click admin import. */
export function getAllLocalCategoryCards(): CategorySpot[] {
  const eventCards: CategorySpot[] = kenyaEvents.map((event) => ({
    id: event.id,
    categoryId: 'events',
    title: event.title,
    location: event.location,
    budget: event.budget,
    description: event.description,
    image: event.image,
    slug: event.slug,
    mapQuery: event.mapQuery,
    dateLabel: event.dateLabel,
    eventStatus: event.status,
  }));

  return [...categorySpots, ...eventCards];
}

export function categorySpotToEvent(spot: CategorySpot): KenyaEvent | null {
  if (spot.categoryId !== 'events' || !spot.eventStatus) {
    return null;
  }

  return {
    id: spot.id,
    title: spot.title,
    location: spot.location,
    dateLabel: spot.dateLabel ?? '',
    status: spot.eventStatus,
    budget: spot.budget,
    description: spot.description,
    image: spot.image,
    slug: spot.slug,
    mapQuery: spot.mapQuery,
  };
}
