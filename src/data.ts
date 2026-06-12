export type Destination = {
  slug: string;
  title: string;
  location: string;
  region: string;
  description: string;
  budget: string;
  difficulty: 'Easy' | 'Moderate' | 'Adventurous';
  bestTime: string;
  transport: string;
  image: string;
  gallery: string[];
  highlights: string[];
  mapQuery: string;
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
    description:
      'Kenya’s most iconic safari landscape with rolling golden plains, big cats, dramatic river crossings, and luxury tented camps that bring guests close to the action.',
    budget: 'From $620 per person per day for premium conservancy stays',
    difficulty: 'Easy',
    bestTime: 'July to October for the migration, January to March for big cat sightings',
    transport:
      'Fly from Wilson Airport to Mara airstrips or travel by private 4x4 via Narok in about 5 to 6 hours.',
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
    description:
      'A cinematic safari setting known for immense elephant herds, open wetlands, and unforgettable views of Mount Kilimanjaro rising beyond the plains.',
    budget: 'From $480 per person per day with lodge and game drives',
    difficulty: 'Easy',
    bestTime: 'June to October and January to February for clear skies',
    transport:
      'Drive from Nairobi in about 4 hours or take a short charter flight to Amboseli airstrip.',
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
    description:
      'A rugged northern circuit destination along the Ewaso Ngiro River, home to rare species, dramatic kopjes, and refined desert-style camps.',
    budget: 'From $540 per person per day for boutique camp experiences',
    difficulty: 'Moderate',
    bestTime: 'June to October and December to March when wildlife gathers near the river',
    transport:
      'Fly to Samburu airstrip or drive north from Nairobi through Isiolo in about 6 hours.',
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
    description:
      'A compact Rift Valley jewel with flamingo-fringed shores, white rhino conservation areas, acacia woodland, and sweeping escarpment viewpoints.',
    budget: 'From $350 per person per day for lodge-based safaris',
    difficulty: 'Easy',
    bestTime: 'Year-round, with excellent birding after seasonal rains',
    transport:
      'Drive from Nairobi through the Great Rift Valley viewpoint in about 3 hours.',
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
    description:
      'A vast wilderness of red-earth elephants, lava flows, springs, baobab-studded horizons, and immersive routes between Nairobi and the coast.',
    budget: 'From $420 per person per day for private 4x4 safaris',
    difficulty: 'Adventurous',
    bestTime: 'June to October and January to February for dry-season wildlife',
    transport:
      'Access by SGR train to Voi or Mtito Andei, private road transfer, or charter flight.',
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
    description:
      'A premium conservation-led safari region with rhino tracking, horseback rides, walking safaris, and intimate owner-run lodges below Mount Kenya.',
    budget: 'From $760 per person per day for exclusive-use conservancy lodges',
    difficulty: 'Moderate',
    bestTime: 'June to September and December to March for dry trails and strong wildlife viewing',
    transport:
      'Fly to Nanyuki or Loisaba airstrips, or drive from Nairobi in about 4 to 5 hours.',
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
