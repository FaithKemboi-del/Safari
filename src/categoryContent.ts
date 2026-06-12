export type CategorySpot = {
  id: string;
  categoryId: string;
  title: string;
  location: string;
  budget: string;
  description: string;
  image: string;
  slug?: string;
  mapQuery?: string;
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

export type EventStatus = 'happening-now' | 'upcoming' | 'past';

export type KenyaEvent = {
  id: string;
  title: string;
  location: string;
  dateLabel: string;
  status: EventStatus;
  budget: string;
  description: string;
  image: string;
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
};

export const categorySpots: CategorySpot[] = [
  {
    id: 'hike-hells-gate',
    categoryId: 'hiking',
    title: "Hell's Gate Gorge",
    location: 'Naivasha',
    budget: 'From $15 park entry + $15 bike hire',
    description: 'Canyon loop with geothermal steam and Fischer\'s Tower — easy matatu day trip from Nairobi.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    slug: 'hells-gate',
    mapQuery: "Hell's Gate National Park Kenya",
  },
  {
    id: 'hike-longonot',
    categoryId: 'hiking',
    title: 'Mount Longonot crater rim',
    location: 'Naivasha',
    budget: 'From $26 entry + matatu ~$8',
    description: 'Steep but rewarding crater rim hike — start early to beat the heat.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Mount Longonot National Park Kenya',
  },
  {
    id: 'hike-karura',
    categoryId: 'hiking',
    title: 'Karura Forest trails',
    location: 'Nairobi',
    budget: 'From $4 entry',
    description: 'Shaded city forest walks, waterfalls, and caves — perfect budget escape in Nairobi.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Karura Forest Nairobi',
  },
  {
    id: 'water-thomson',
    categoryId: 'waterfalls',
    title: 'Thomson\'s Falls',
    location: 'Nyahururu',
    budget: 'From $3 entry',
    description: '74m waterfall on the Ewaso Narok River — budget stop on a Rift Valley route.',
    image: 'https://images.unsplash.com/photo-1432405972613-c60ab874ab1d?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Thomson Falls Nyahururu Kenya',
  },
  {
    id: 'water-karura-falls',
    categoryId: 'waterfalls',
    title: 'Karura Waterfall loop',
    location: 'Nairobi',
    budget: 'From $4 forest entry',
    description: 'Short forest trail to a waterfall inside Karura — cheapest waterfall fix near the city.',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Karura Forest waterfall Nairobi',
  },
  {
    id: 'water-chaka',
    categoryId: 'waterfalls',
    title: 'Chaka Ranch falls',
    location: 'Nyeri',
    budget: 'From $5 day visit',
    description: 'Hidden cascade on the slopes near Nyeri — combine with local food stops.',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Chaka Ranch Nyeri Kenya',
  },
  {
    id: 'camp-hells',
    categoryId: 'camping',
    title: 'Hell\'s Gate campsites',
    location: 'Naivasha',
    budget: 'From $20/night camping',
    description: 'Budget public campsite near the gorge — bring your own tent or rent locally.',
    image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=900&q=80',
    slug: 'hells-gate',
  },
  {
    id: 'camp-lake-elem',
    categoryId: 'camping',
    title: 'Lake Elementaita community camp',
    location: 'Elementaita',
    budget: 'From $18/night',
    description: 'Simple lakeside camping with flamingo views — quieter than Naivasha.',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84b84c7?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Lake Elementaita Kenya',
  },
  {
    id: 'camp-kedong',
    categoryId: 'camping',
    title: 'Kedong Ranch camp',
    location: 'Naivasha',
    budget: 'From $22/night',
    description: 'Open grassland camping popular with overlanders and weekend cyclists.',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5e0a90ace?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Kedong Ranch Naivasha',
  },
  {
    id: 'road-nairobi-mombasa',
    categoryId: 'roadtrips',
    title: 'Nairobi → Mombasa via SGR',
    location: 'Nairobi to Coast',
    budget: 'From $12 SGR economy',
    description: 'Fast budget hop to the coast — book early for cheapest fares.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Nairobi SGR Terminus',
  },
  {
    id: 'road-rift-loop',
    categoryId: 'roadtrips',
    title: 'Great Rift Valley loop',
    location: 'Nairobi → Naivasha → Nakuru',
    budget: 'From $25 shared van day',
    description: 'Matatu and shared van circuit through viewpoints, lakes, and camps.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Great Rift Valley Viewpoint Kenya',
  },
  {
    id: 'road-tsavo-coast',
    categoryId: 'roadtrips',
    title: 'Tsavo to Diani overland',
    location: 'Voi → Coast',
    budget: 'From $18 bus + $6 tuk-tuk',
    description: 'Budget wildlife stop then bus to the beach — classic backpacker corridor.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    slug: 'tsavo',
  },
  {
    id: 'gem-samburu',
    categoryId: 'hidden-gems',
    title: 'Samburu river bends',
    location: 'Northern Kenya',
    budget: 'From $40/day budget camp',
    description: 'Rare species and dramatic kopjes — less crowded than southern parks.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    slug: 'samburu',
  },
  {
    id: 'gem-kerio',
    categoryId: 'hidden-gems',
    title: 'Kerio Valley viewpoints',
    location: 'Elgeyo-Marakwet',
    budget: 'From $10 local guide tip',
    description: 'Stunning valley escarpments and running trails — bring cash for village guides.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Kerio Valley Kenya',
  },
  {
    id: 'gem-lamu',
    categoryId: 'hidden-gems',
    title: 'Lamu Old Town lanes',
    location: 'Lamu Archipelago',
    budget: 'From $35/night guesthouse',
    description: 'UNESCO stone town, dhow culture, and no cars — slow travel at its best.',
    image: 'https://images.unsplash.com/photo-1544551763-77aef23d0ce3?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Lamu Old Town Kenya',
  },
  {
    id: 'wild-nakuru',
    categoryId: 'wildlife',
    title: 'Lake Nakuru rhino drive',
    location: 'Nakuru',
    budget: 'From $70 park + $35 shared van',
    description: 'Compact park — great half-day rhino and flamingo trip from Nairobi.',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80',
    slug: 'lake-nakuru',
  },
  {
    id: 'wild-nairobi',
    categoryId: 'wildlife',
    title: 'Nairobi National Park day trip',
    location: 'Nairobi',
    budget: 'From $43 entry + $60 shared tour',
    description: 'Skyline safari minutes from the city — book shared vans to split costs.',
    image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Nairobi National Park Kenya',
  },
  {
    id: 'wild-amboseli',
    categoryId: 'wildlife',
    title: 'Amboseli elephant day',
    location: 'Kajiado',
    budget: 'From $55 day trip',
    description: 'Shared van from Nairobi with Kilimanjaro views — go dry season for clear skies.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80',
    slug: 'amboseli',
  },
  {
    id: 'coast-diani',
    categoryId: 'coast',
    title: 'Diani public beach',
    location: 'Kwale',
    budget: 'From $25/night hostel',
    description: 'White sand, tuk-tuk hops, and street food — peak budget coast base.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Diani Beach Kenya',
  },
  {
    id: 'coast-kilifi',
    categoryId: 'coast',
    title: 'Kilifi creek dhows',
    location: 'Kilifi',
    budget: 'From $20/night camping',
    description: 'Laid-back creek town — cheaper than Diani with great swimming holes.',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Kilifi Creek Kenya',
  },
  {
    id: 'coast-watamu',
    categoryId: 'coast',
    title: 'Watamu snorkel bay',
    location: 'Kilifi County',
    budget: 'From $30 snorkel trip',
    description: 'Budget boat snorkel trips in the marine park — haggle at the beach jetty.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Watamu Marine National Park',
  },
];

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
    slug: 'hells-gate',
  },
  {
    id: 'mt-kenya-sirimon',
    title: 'Mount Kenya — Sirimon Route',
    location: 'Nanyuki',
    difficulty: 'Moderate to challenging — gentler ascent than Naromoru',
    duration: '3 days typical for Lenana',
    budget: 'From ~$130 pp with community guides',
    description: 'Gradual trail through montane forest — popular with budget trekking groups from Nanyuki.',
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
    description: 'Rim hike with Rift Valley views — matatu to Naivasha then taxi to gate.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    mapQuery: 'Mount Longonot National Park Kenya',
    googleMapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Mount+Longonot+National+Park+Kenya&travelmode=walking',
    allTrailsUrl: 'https://www.alltrails.com/trail/kenya/rift-valley/mount-longonot',
  },
];

export const kenyaEvents: KenyaEvent[] = [
  {
    id: 'lamu-cultural',
    title: 'Lamu Cultural Festival',
    location: 'Lamu Old Town',
    dateLabel: 'Happening this week',
    status: 'happening-now',
    budget: 'Free street events / from $35 guesthouse',
    description: 'Dhow races, Swahili poetry, and night markets in the old town alleys.',
    image: 'https://images.unsplash.com/photo-1544551763-77aef23d0ce3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'nairobi-night-market',
    title: 'Nairobi Night Market',
    location: 'Westlands',
    dateLabel: 'Tonight · 6pm',
    status: 'happening-now',
    budget: 'Street food from $2',
    description: 'Live DJs, street food stalls, and local makers — pay as you go.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rift-music',
    title: 'Rift Valley Acoustic Sessions',
    location: 'Naivasha',
    dateLabel: 'Next Saturday',
    status: 'upcoming',
    budget: 'From $5 entry',
    description: 'Lakefront acoustic sets and campfire stories — bring a blanket.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'mara-community',
    title: 'Mara Community Run',
    location: 'Maasai Mara gateway',
    dateLabel: '12 July',
    status: 'upcoming',
    budget: 'From $10 registration',
    description: 'Conservation run with local guides — proceeds support schools.',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'diani-reggae',
    title: 'Diani Beach Reggae Sundowner',
    location: 'Diani',
    dateLabel: 'Last month',
    status: 'past',
    budget: 'Free entry',
    description: 'Sunset sets on the sand with local food vendors.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'nairobi-cycling',
    title: 'Nairobi Cycling Festival',
    location: 'Karura Forest',
    dateLabel: 'March 2026',
    status: 'past',
    budget: 'From $8 entry',
    description: 'Forest loops, repair workshops, and budget gear swap stalls.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
  },
];

export const seedEventChat: EventChatMessage[] = [
  {
    id: 'ec-1',
    eventId: 'lamu-cultural',
    author: 'Fatma A.',
    message: 'Dhow race just finished — incredible energy at the waterfront!',
    postedAgo: '5 min ago',
    isLive: true,
  },
  {
    id: 'ec-2',
    eventId: 'lamu-cultural',
    author: 'Chris O.',
    message: 'Food stalls near the fort are cheap and busy — get there before 8pm.',
    postedAgo: '18 min ago',
    isLive: true,
  },
  {
    id: 'ec-3',
    eventId: 'nairobi-night-market',
    author: 'Joy K.',
    message: 'Music is live now, line for nyama choma is long but moving fast.',
    postedAgo: '2 min ago',
    isLive: true,
  },
];

export const HIKE_RECORDS_KEY = 'kenya-hike-records';
export const eventChatKey = (eventId: string) => `kenya-event-chat-${eventId}`;
