export type DestinationExperienceType = 'hike' | 'standard';

export type Destination = {
  slug: string;
  title: string;
  location: string;
  region: string;
  experienceType: DestinationExperienceType;
  description: string;
  pricing?: string;
  safetyAndConditions?: string;
  transportAndLogistics?: string;
  additionalInfo?: string;
  hikeDifficulty?: string;
  image: string;
  gallery: string[];
  highlights: string[];
  mapQuery: string;
};

export type CommunityUpdate = {
  id: string;
  destinationSlug: string;
  author: string;
  avatar: string;
  postedAgo: string;
  isOnGround: boolean;
  isLive: boolean;
  comment: string;
};

export type Itinerary = {
  id: string;
  title: string;
  duration: string;
  route: string;
  price: string;
  style: string;
  image: string;
  days: {
    day: string;
    title: string;
    details: string;
  }[];
};

export const destinations: Destination[] = [
  {
    slug: 'maasai-mara',
    title: 'Maasai Mara National Reserve',
    location: 'Narok County',
    region: 'Savanna',
    experienceType: 'standard',
    description:
      'Kenya’s most iconic safari landscape with rolling golden plains, big cats, dramatic river crossings, and luxury tented camps that bring guests close to the action.',
    pricing:
      'From $620 per person per day for premium conservancy stays. Balloon safaris from $450 pp extra.',
    safetyAndConditions:
      'Dry-season tracks are well maintained. Early mornings are cool; pack layers. Follow guide instructions near river crossings and predator sightings.',
    transportAndLogistics:
      'Fly from Wilson Airport to Mara airstrips (45 min) or drive via Narok in 5–6 hours. Most camps include airstrip transfers and twice-daily game drives.',
    additionalInfo:
      'Peak migration window is July–October. January–March is excellent for big cats with fewer crowds.',
    image:
      'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: ['Great Migration', 'Big cats', 'Hot-air balloon safaris', 'Private conservancies'],
    mapQuery: 'Maasai Mara National Reserve Kenya',
  },
  {
    slug: 'amboseli',
    title: 'Amboseli National Park',
    location: 'Kajiado County',
    region: 'Mountain views',
    experienceType: 'standard',
    description:
      'A cinematic safari setting known for immense elephant herds, open wetlands, and unforgettable views of Mount Kilimanjaro rising beyond the plains.',
    pricing:
      'From $480 per person per day including lodge, meals, and shared game drives. Private vehicle from $180 per day.',
    safetyAndConditions:
      'Open plains mean strong sun — bring SPF and a hat. Wetlands can be dusty in dry season. Wildlife always has right of way on tracks.',
    transportAndLogistics:
      '4-hour drive from Nairobi or 30-minute charter to Amboseli airstrip. Road transfers from $120 pp one way.',
    additionalInfo:
      'Best Kilimanjaro views at dawn, June–October and January–February. Cultural visits to Maasai communities available nearby.',
    image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504432842672-1a79f78e4084?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: ['Elephant herds', 'Kilimanjaro views', 'Wetland birding', 'Luxury lodges'],
    mapQuery: 'Amboseli National Park Kenya',
  },
  {
    slug: 'samburu',
    title: 'Samburu National Reserve',
    location: 'Samburu County',
    region: 'Arid wilderness',
    experienceType: 'standard',
    description:
      'A rugged northern circuit destination along the Ewaso Ngiro River, home to rare species, dramatic kopjes, and refined desert-style camps.',
    pricing:
      'From $540 per person per day for boutique camps. Night drives from $95 pp where permitted.',
    safetyAndConditions:
      'Arid heat midday — plan drives for early morning and late afternoon. River levels affect wildlife density seasonally.',
    transportAndLogistics:
      'Fly to Samburu airstrip (1 hr 15 min from Nairobi) or drive via Isiolo in ~6 hours. Remote roads favor 4x4 vehicles.',
    additionalInfo:
      'Look for the Samburu Special Five. Strong leopard activity near the river June–October and December–March.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552410260-0fd9b577afa6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534567110243-8875d64ca8ff?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: ['Samburu Special Five', 'River safaris', 'Cultural visits', 'Leopard sightings'],
    mapQuery: 'Samburu National Reserve Kenya',
  },
  {
    slug: 'lake-nakuru',
    title: 'Lake Nakuru National Park',
    location: 'Nakuru County',
    region: 'Rift Valley',
    experienceType: 'standard',
    description:
      'A compact Rift Valley jewel with flamingo-fringed shores, white rhino conservation areas, acacia woodland, and sweeping escarpment viewpoints.',
    pricing:
      'From $350 per person per day lodge-based. Park entry ~$70 for non-residents. Day trips from Nairobi from $180 pp.',
    safetyAndConditions:
      'Flamingo numbers vary with water levels. Baboons near picnic sites — secure food and bags. Rhino areas are well patrolled.',
    transportAndLogistics:
      '3-hour drive from Nairobi via Rift Valley viewpoints. Ideal as a first or last safari stop on a longer circuit.',
    additionalInfo:
      'Year-round rhino sightings. Best birding after rains. Short escarpment hikes available with a guide at select viewpoints.',
    image:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521651201144-634f700b36ef?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: ['Rhino sightings', 'Flamingos', 'Rift Valley views', 'Short safari access'],
    mapQuery: 'Lake Nakuru National Park Kenya',
  },
  {
    slug: 'tsavo',
    title: 'Tsavo East & West',
    location: 'Taita-Taveta County',
    region: 'Wild frontier',
    experienceType: 'standard',
    description:
      'A vast wilderness of red-earth elephants, lava flows, springs, baobab-studded horizons, and immersive routes between Nairobi and the coast.',
    pricing:
      'From $420 per person per day for private 4x4 safaris. SGR + lodge packages from $310 pp per night.',
    safetyAndConditions:
      'Vast park — wildlife spreads out in wet season. Carry extra water. Lava rock areas can be sharp; wear closed shoes on walking stops.',
    transportAndLogistics:
      'SGR to Voi or Mtito Andei plus road transfer, private 4x4 from Nairobi (~5 hrs), or charter to Tsavo airstrips.',
    additionalInfo:
      'Classic Nairobi-to-coast corridor. Mzima Springs and red elephant photography are highlights. Dry season June–October is prime.',
    image:
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504173010664-32509aeebb62?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: ['Red elephants', 'Mzima Springs', 'Lava landscapes', 'Nairobi-to-coast route'],
    mapQuery: 'Tsavo East National Park Kenya',
  },
  {
    slug: 'laikipia',
    title: 'Laikipia Conservancies',
    location: 'Laikipia Plateau',
    region: 'Private conservancy',
    experienceType: 'standard',
    description:
      'A premium conservation-led safari region with rhino tracking, horseback rides, walking safaris, and intimate owner-run lodges below Mount Kenya.',
    pricing:
      'From $760 per person per day for exclusive conservancy lodges. Rhino tracking and horseback from $120 pp per activity.',
    safetyAndConditions:
      'Walking safaris require fitness and closed shoes. Conservancy rules limit off-road driving. Night temperatures drop on the plateau.',
    transportAndLogistics:
      'Fly to Nanyuki or Loisaba airstrips, or drive from Nairobi in 4–5 hours. Many lodges include charter coordination.',
    additionalInfo:
      'Strong conservation impact stays. Combine with Mount Kenya hikes nearby. Best wildlife viewing June–September and December–March.',
    image:
      'https://images.unsplash.com/photo-1519885277449-12eee5564d68?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: ['Rhino tracking', 'Walking safaris', 'Horseback riding', 'Conservation impact'],
    mapQuery: 'Laikipia Kenya conservancy',
  },
  {
    slug: 'hells-gate',
    title: "Hell's Gate National Park",
    location: 'Naivasha, Nakuru County',
    region: 'Rift Valley',
    experienceType: 'hike',
    description:
      'A dramatic Rift Valley park of cliffs, geothermal steam vents, and cycling trails — one of Kenya’s best day-hike and adventure landscapes.',
    hikeDifficulty:
      'Moderate — 3–4 hour canyon loop with some rocky sections and sun exposure. Suitable for fit beginners with water and a guide.',
    transportAndLogistics:
      '2-hour drive from Nairobi. Bikes available at the gate (~$15). Most visitors combine with Lake Naivasha boat lunch.',
    additionalInfo:
      'Arrive before 9am to avoid heat. Buffalo and baboons present — keep distance. Fischer’s Tower and Central Tower are photo highlights.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521651201144-634f700b36ef?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: ['Canyon hikes', 'Cycling trails', 'Geothermal vents', 'Day-trip from Nairobi'],
    mapQuery: "Hell's Gate National Park Kenya",
  },
];

export const communityUpdates: CommunityUpdate[] = [
  {
    id: 'mara-1',
    destinationSlug: 'maasai-mara',
    author: 'Wanjiku M.',
    avatar: 'WM',
    postedAgo: '12 min ago',
    isOnGround: true,
    isLive: true,
    comment:
      'Just watched a crossing at Mara River — absolutely electric this morning. Conservancy roads are dry and guides are spacing vehicles well.',
  },
  {
    id: 'mara-2',
    destinationSlug: 'maasai-mara',
    author: 'Daniel K.',
    avatar: 'DK',
    postedAgo: '2 hr ago',
    isOnGround: false,
    isLive: false,
    comment:
      'Visited last week. Worth the splurge for a private conservancy — we had a leopard sighting all to ourselves at dusk.',
  },
  {
    id: 'amboseli-1',
    destinationSlug: 'amboseli',
    author: 'Priya S.',
    avatar: 'PS',
    postedAgo: '28 min ago',
    isOnGround: true,
    isLive: true,
    comment:
      'Kilimanjaro is fully visible at sunrise today. Elephant herds are gathering near the swamps — bring a zoom lens.',
  },
  {
    id: 'hells-1',
    destinationSlug: 'hells-gate',
    author: 'Tom R.',
    avatar: 'TR',
    postedAgo: '45 min ago',
    isOnGround: true,
    isLive: true,
    comment:
      'Did the gorge hike this morning — moderate is accurate. Started at 7am and finished before the heat. Rocky in two spots, otherwise stunning.',
  },
  {
    id: 'hells-2',
    destinationSlug: 'hells-gate',
    author: 'Amina H.',
    avatar: 'AH',
    postedAgo: 'Yesterday',
    isOnGround: false,
    isLive: false,
    comment:
      'Cycled the lower loop last month. Rent bikes at the gate and hire a guide for the canyon — worth it for safety and context.',
  },
  {
    id: 'diani-1',
    destinationSlug: 'tsavo',
    author: 'Leo F.',
    avatar: 'LF',
    postedAgo: '1 hr ago',
    isOnGround: true,
    isLive: true,
    comment:
      'Red elephants near Mudanda Rock this afternoon. Roads from Voi are smooth after the rains — SGR connection was seamless.',
  },
];

export const itineraries: Itinerary[] = [
  {
    id: 'migration-luxe',
    title: 'Great Migration Luxe Escape',
    duration: '5 days',
    route: 'Nairobi -> Maasai Mara -> Nairobi',
    price: 'From $3,850 pp',
    style: 'Fly-in luxury camp',
    image:
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1400&q=80',
    days: [
      {
        day: 'Day 1',
        title: 'Arrive in Nairobi',
        details:
          'VIP meet-and-assist, private transfer, and a relaxed evening at a leafy boutique hotel.',
      },
      {
        day: 'Day 2',
        title: 'Fly to the Mara',
        details:
          'Scenic light-aircraft flight into the reserve, afternoon game drive, and sundowners over the plains.',
      },
      {
        day: 'Day 3',
        title: 'Big cat country',
        details:
          'Full-day safari across predator territories with an optional hot-air balloon experience at dawn.',
      },
      {
        day: 'Day 4',
        title: 'River crossing watch',
        details:
          'Track migration herds, pause for a bush lunch, and return to camp for a lantern-lit dinner.',
      },
      {
        day: 'Day 5',
        title: 'Return to Nairobi',
        details:
          'Final sunrise drive before your flight back to Nairobi for onward connections.',
      },
    ],
  },
  {
    id: 'big-five-beach',
    title: 'Big Five to Barefoot Coast',
    duration: '8 days',
    route: 'Nairobi -> Amboseli -> Tsavo -> Diani',
    price: 'From $4,940 pp',
    style: 'Safari and beach',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    days: [
      {
        day: 'Day 1',
        title: 'Nairobi welcome',
        details:
          'Settle in with a city-view dinner and a briefing on the route from savanna to coast.',
      },
      {
        day: 'Day 2',
        title: 'Amboseli elephants',
        details:
          'Drive to Amboseli for your first game drive beneath Mount Kilimanjaro.',
      },
      {
        day: 'Day 3',
        title: 'Kilimanjaro sunrise',
        details:
          'Morning and afternoon drives focused on elephants, wetlands, and photographic viewpoints.',
      },
      {
        day: 'Day 4',
        title: 'Into Tsavo West',
        details:
          'Travel through lava country, visit Mzima Springs, and sleep in a lodge overlooking wildlife paths.',
      },
      {
        day: 'Day 5',
        title: 'Red-earth safari',
        details:
          'Explore Tsavo East in search of red elephants, lions, giraffes, and open-horizon drama.',
      },
      {
        day: 'Days 6-8',
        title: 'Diani reset',
        details:
          'Board the SGR or fly to the coast for white-sand downtime, ocean activities, and spa-led recovery.',
      },
    ],
  },
  {
    id: 'rift-valley',
    title: 'Rift Valley Signature Circuit',
    duration: '6 days',
    route: 'Nairobi -> Lake Nakuru -> Laikipia -> Nairobi',
    price: 'From $4,250 pp',
    style: 'Conservation and scenery',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
    days: [
      {
        day: 'Day 1',
        title: 'Rift Valley descent',
        details:
          'Depart Nairobi for scenic viewpoints and an afternoon rhino drive in Lake Nakuru.',
      },
      {
        day: 'Day 2',
        title: 'Birdlife and rhinos',
        details:
          'Explore lake shores, acacia forests, and viewpoints before a slow lodge evening.',
      },
      {
        day: 'Day 3',
        title: 'North to Laikipia',
        details:
          'Transfer to a private conservancy with Mount Kenya views and a night drive after dinner.',
      },
      {
        day: 'Day 4',
        title: 'Conservation immersion',
        details:
          'Track rhinos with guides, visit conservation teams, and enjoy a private bush picnic.',
      },
      {
        day: 'Day 5',
        title: 'Active safari day',
        details:
          'Choose horseback riding, walking safari, camel trekking, or a photographic hide session.',
      },
      {
        day: 'Day 6',
        title: 'Return to Nairobi',
        details:
          'Leisurely breakfast and private transfer or flight to Nairobi.',
      },
    ],
  },
];

export type Category = {
  id: string;
  label: string;
  icon: 'hiking' | 'waterfall' | 'camping' | 'roadtrip' | 'gem' | 'wildlife' | 'coast';
};

export type TrendingItem = {
  id: string;
  title: string;
  location: string;
  tag: string;
  searches: string;
  image: string;
  slug: string;
};

export const categories: Category[] = [
  { id: 'hiking', label: 'Hiking', icon: 'hiking' },
  { id: 'waterfalls', label: 'Waterfalls', icon: 'waterfall' },
  { id: 'camping', label: 'Camping', icon: 'camping' },
  { id: 'roadtrips', label: 'Road trips', icon: 'roadtrip' },
  { id: 'hidden-gems', label: 'Hidden gems', icon: 'gem' },
  { id: 'wildlife', label: 'Wildlife', icon: 'wildlife' },
  { id: 'coast', label: 'Coast', icon: 'coast' },
];

export const trendingThisWeek: TrendingItem[] = [
  {
    id: 'mara-crossing',
    title: 'Mara River crossings',
    location: 'Maasai Mara',
    tag: 'Wildlife',
    searches: '+42% searches',
    image:
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=900&q=80',
    slug: 'maasai-mara',
  },
  {
    id: 'diani-coast',
    title: 'Diani barefoot escapes',
    location: 'Kwale Coast',
    tag: 'Coast',
    searches: '+31% searches',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    slug: 'tsavo',
  },
  {
    id: 'hells-gate',
    title: 'Hell\'s Gate cycling trails',
    location: 'Naivasha',
    tag: 'Hiking',
    searches: '+28% searches',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    slug: 'lake-nakuru',
  },
  {
    id: 'samburu-north',
    title: 'Samburu night drives',
    location: 'Northern Kenya',
    tag: 'Hidden gems',
    searches: '+24% searches',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    slug: 'samburu',
  },
];

export const testimonials = [
  {
    quote:
      'Every detail felt curated, from the camp arrival to the sunrise balloon flight. Kenya felt cinematic and deeply personal.',
    name: 'Amara L.',
    role: 'Luxury honeymoon traveler',
  },
  {
    quote:
      'The itinerary balanced adventure and comfort perfectly. Our guide knew where to be before the crowds arrived.',
    name: 'Jonas M.',
    role: 'Wildlife photographer',
  },
  {
    quote:
      'The dashboard mockups made it easy for our team to imagine managing destinations and routes at scale.',
    name: 'Grace W.',
    role: 'Safari operations lead',
  },
];
