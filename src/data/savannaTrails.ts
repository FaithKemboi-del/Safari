import type { ElevationPoint, GpsPoint, LatLng } from '../lib/trailUtils';

export type { ElevationPoint };

export type TrailWaypoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  elevationM?: number;
  kind: 'start' | 'checkpoint' | 'summit' | 'camp';
};

export type TrailReview = {
  id: string;
  trailId: string;
  author: string;
  rating: number;
  comment: string;
  postedAgo: string;
};

export type SavannaTrail = {
  id: string;
  title: string;
  location: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  difficultyLabel: string;
  duration: string;
  distanceKm: number;
  elevationGainM: number;
  budget: string;
  description: string;
  image: string;
  mapQuery: string;
  googleMapsUrl: string;
  slug?: string;
  routeType: 'loop' | 'out-and-back' | 'point-to-point';
  coordinates: LatLng[];
  waypoints: TrailWaypoint[];
  elevationProfile: ElevationPoint[];
  tips: string[];
};

export type RecordedHikeTrack = {
  id: string;
  trailId?: string;
  trailName: string;
  startedAt: string;
  endedAt?: string;
  points: GpsPoint[];
  distanceKm: number;
  notes?: string;
};

export const SAVANNA_TRAILS_KEY = 'savanna-trail-reviews';
export const SAVANNA_GPS_TRACKS_KEY = 'savanna-gps-tracks';

export const savannaTrails: SavannaTrail[] = [
  {
    id: 'mt-kenya-naromoru',
    title: 'Mount Kenya — Naromoru Route',
    location: 'Nyeri County',
    difficulty: 'expert',
    difficultyLabel: 'Expert — multi-day, high altitude',
    duration: '3–4 days to Point Lenana',
    distanceKm: 46.5,
    elevationGainM: 2400,
    budget: 'From ~$120–$180 pp (park fees, guide, basic hut)',
    description:
      'Classic budget approach to Point Lenana via Naromoru Gate. Steep sections through the Teleki Valley — hire guides at the gate and acclimatize slowly.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    mapQuery: 'Mount Kenya Naromoru Gate Trailhead Kenya',
    googleMapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Mount+Kenya+Naromoru+Gate+Kenya&travelmode=walking',
    slug: 'hells-gate',
    routeType: 'out-and-back',
    coordinates: [
      { lat: -0.1634, lng: 37.0182 },
      { lat: -0.1588, lng: 37.0245 },
      { lat: -0.1521, lng: 37.0318 },
      { lat: -0.1455, lng: 37.0382 },
      { lat: -0.1388, lng: 37.0425 },
      { lat: -0.1312, lng: 37.0468 },
      { lat: -0.1235, lng: 37.0512 },
      { lat: -0.1158, lng: 37.0555 },
      { lat: -0.1082, lng: 37.0598 },
      { lat: -0.1005, lng: 37.0642 },
      { lat: -0.0928, lng: 37.0685 },
      { lat: -0.0852, lng: 37.0728 },
      { lat: -0.0775, lng: 37.0772 },
      { lat: -0.0698, lng: 37.0815 },
      { lat: -0.0622, lng: 37.0858 },
      { lat: -0.0545, lng: 37.0902 },
      { lat: -0.0468, lng: 37.0945 },
      { lat: -0.0392, lng: 37.0988 },
      { lat: -0.0315, lng: 37.1032 },
      { lat: -0.0238, lng: 37.1075 },
      { lat: -0.0162, lng: 37.1118 },
      { lat: -0.0085, lng: 37.1162 },
      { lat: -0.0008, lng: 37.1205 },
      { lat: 0.0068, lng: 37.1248 },
      { lat: 0.0145, lng: 37.1292 },
      { lat: 0.0222, lng: 37.1335 },
      { lat: 0.0298, lng: 37.1378 },
      { lat: 0.0375, lng: 37.1422 },
      { lat: 0.0452, lng: 37.1465 },
      { lat: 0.0528, lng: 37.1508 },
      { lat: 0.0605, lng: 37.1552 },
      { lat: 0.0682, lng: 37.1595 },
      { lat: 0.0758, lng: 37.1638 },
      { lat: 0.0835, lng: 37.1682 },
      { lat: 0.0912, lng: 37.1725 },
      { lat: 0.0988, lng: 37.1768 },
      { lat: 0.1065, lng: 37.1812 },
      { lat: 0.1142, lng: 37.1855 },
      { lat: 0.1218, lng: 37.1898 },
      { lat: 0.1295, lng: 37.1942 },
      { lat: 0.1372, lng: 37.1985 },
      { lat: 0.1448, lng: 37.2028 },
      { lat: 0.1525, lng: 37.2072 },
      { lat: 0.1602, lng: 37.2115 },
      { lat: 0.1678, lng: 37.2158 },
      { lat: 0.1755, lng: 37.2202 },
      { lat: 0.1832, lng: 37.2245 },
      { lat: 0.1908, lng: 37.2288 },
      { lat: 0.1985, lng: 37.2332 },
    ],
    waypoints: [
      { id: 'naromoru-gate', name: 'Naromoru Gate', lat: -0.1634, lng: 37.0182, elevationM: 2400, kind: 'start' },
      { id: 'met-station', name: 'Met Station Camp', lat: -0.0928, lng: 37.0685, elevationM: 3050, kind: 'camp' },
      { id: 'mackinders', name: "Mackinder's Camp", lat: 0.0298, lng: 37.1378, elevationM: 4200, kind: 'camp' },
      { id: 'point-lenana', name: 'Point Lenana', lat: 0.1985, lng: 37.2332, elevationM: 4985, kind: 'summit' },
    ],
    elevationProfile: [
      { distanceKm: 0, elevationM: 2400 },
      { distanceKm: 5, elevationM: 2800 },
      { distanceKm: 10, elevationM: 3050 },
      { distanceKm: 15, elevationM: 3400 },
      { distanceKm: 20, elevationM: 3800 },
      { distanceKm: 25, elevationM: 4000 },
      { distanceKm: 30, elevationM: 4200 },
      { distanceKm: 35, elevationM: 4500 },
      { distanceKm: 40, elevationM: 4750 },
      { distanceKm: 46.5, elevationM: 4985 },
    ],
    tips: [
      'Carry warm layers — nights at altitude are cold even near the equator.',
      'Budget for park fees, guide, and hut/camping permits at the gate.',
      'Acclimatize: add an extra night at Mackinder\'s if you feel symptoms.',
    ],
  },
  {
    id: 'mt-kenya-sirimon',
    title: 'Mount Kenya — Sirimon Route',
    location: 'Nanyuki',
    difficulty: 'hard',
    difficultyLabel: 'Hard — gentler ascent, still high altitude',
    duration: '3 days typical for Lenana',
    distanceKm: 49.7,
    elevationGainM: 2752,
    budget: 'From ~$130 pp with community guides',
    description:
      'Gradual trail through montane forest and moorland — popular with budget trekking groups starting from Nanyuki.',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
    mapQuery: 'Mount Kenya Sirimon Gate Kenya',
    googleMapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Mount+Kenya+Sirimon+Gate+Kenya&travelmode=walking',
    routeType: 'out-and-back',
    coordinates: [
      { lat: 0.0702, lng: 37.0351 },
      { lat: 0.0785, lng: 37.0412 },
      { lat: 0.0868, lng: 37.0475 },
      { lat: 0.0952, lng: 37.0538 },
      { lat: 0.1035, lng: 37.0602 },
      { lat: 0.1118, lng: 37.0665 },
      { lat: 0.1202, lng: 37.0728 },
      { lat: 0.1285, lng: 37.0792 },
      { lat: 0.1368, lng: 37.0855 },
      { lat: 0.1452, lng: 37.0918 },
      { lat: 0.1535, lng: 37.0982 },
      { lat: 0.1618, lng: 37.1045 },
      { lat: 0.1702, lng: 37.1108 },
      { lat: 0.1785, lng: 37.1172 },
      { lat: 0.1868, lng: 37.1235 },
      { lat: 0.1952, lng: 37.1298 },
      { lat: 0.2035, lng: 37.1362 },
      { lat: 0.2118, lng: 37.1425 },
      { lat: 0.2202, lng: 37.1488 },
      { lat: 0.2285, lng: 37.1552 },
      { lat: 0.2368, lng: 37.1615 },
      { lat: 0.2452, lng: 37.1678 },
      { lat: 0.2535, lng: 37.1742 },
      { lat: 0.2618, lng: 37.1805 },
      { lat: 0.2702, lng: 37.1868 },
      { lat: 0.2785, lng: 37.1932 },
      { lat: 0.2868, lng: 37.1995 },
      { lat: 0.2952, lng: 37.2058 },
      { lat: 0.3035, lng: 37.2122 },
      { lat: 0.3118, lng: 37.2185 },
      { lat: 0.3202, lng: 37.2248 },
    ],
    waypoints: [
      { id: 'sirimon-gate', name: 'Sirimon Gate', lat: 0.0702, lng: 37.0351, elevationM: 2650, kind: 'start' },
      { id: 'old-moses', name: 'Old Moses Camp', lat: 0.1452, lng: 37.0918, elevationM: 3300, kind: 'camp' },
      { id: 'likii-north', name: 'Likii North Camp', lat: 0.2285, lng: 37.1552, elevationM: 3990, kind: 'camp' },
      { id: 'lenana-sirimon', name: 'Point Lenana', lat: 0.3202, lng: 37.2248, elevationM: 4985, kind: 'summit' },
    ],
    elevationProfile: [
      { distanceKm: 0, elevationM: 2650 },
      { distanceKm: 6, elevationM: 3000 },
      { distanceKm: 12, elevationM: 3300 },
      { distanceKm: 18, elevationM: 3600 },
      { distanceKm: 24, elevationM: 3800 },
      { distanceKm: 30, elevationM: 3990 },
      { distanceKm: 36, elevationM: 4300 },
      { distanceKm: 42, elevationM: 4600 },
      { distanceKm: 49.7, elevationM: 4985 },
    ],
    tips: [
      'Sirimon is gentler than Naromoru — good for first-time high-altitude trekkers.',
      'Shared transport from Nanyuki to the gate keeps costs low.',
      'Book community guides through local trekking groups for fair rates.',
    ],
  },
  {
    id: 'longonot-trail',
    title: 'Mount Longonot crater trail',
    location: 'Naivasha',
    difficulty: 'moderate',
    difficultyLabel: 'Moderate — steep rim sections',
    duration: 'Half day (4–6 hours)',
    distanceKm: 11.7,
    elevationGainM: 1016,
    budget: 'Under $35 total from Nairobi',
    description:
      'Popular crater rim loop with sweeping Rift Valley views — matatu to Naivasha, then taxi to the gate.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    mapQuery: 'Mount Longonot National Park Kenya',
    googleMapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Mount+Longonot+National+Park+Kenya&travelmode=walking',
    routeType: 'loop',
    coordinates: [
      { lat: -0.9142, lng: 36.4561 },
      { lat: -0.908, lng: 36.462 },
      { lat: -0.9, lng: 36.468 },
      { lat: -0.892, lng: 36.472 },
      { lat: -0.884, lng: 36.475 },
      { lat: -0.876, lng: 36.476 },
      { lat: -0.868, lng: 36.474 },
      { lat: -0.86, lng: 36.47 },
      { lat: -0.853, lng: 36.464 },
      { lat: -0.848, lng: 36.456 },
      { lat: -0.845, lng: 36.448 },
      { lat: -0.848, lng: 36.44 },
      { lat: -0.855, lng: 36.434 },
      { lat: -0.865, lng: 36.432 },
      { lat: -0.876, lng: 36.434 },
      { lat: -0.886, lng: 36.44 },
      { lat: -0.896, lng: 36.448 },
      { lat: -0.905, lng: 36.452 },
      { lat: -0.9142, lng: 36.4561 },
    ],
    waypoints: [
      { id: 'longonot-gate', name: 'Park Gate', lat: -0.9142, lng: 36.4561, elevationM: 2148, kind: 'start' },
      { id: 'rim-east', name: 'Crater Rim (east)', lat: -0.876, lng: 36.476, elevationM: 2600, kind: 'checkpoint' },
      { id: 'rim-peak', name: 'Highest Rim Point', lat: -0.848, lng: 36.456, elevationM: 2776, kind: 'summit' },
      { id: 'longonot-finish', name: 'Back to Gate', lat: -0.9142, lng: 36.4561, elevationM: 2148, kind: 'checkpoint' },
    ],
    elevationProfile: [
      { distanceKm: 0, elevationM: 2148 },
      { distanceKm: 1.5, elevationM: 2350 },
      { distanceKm: 3, elevationM: 2520 },
      { distanceKm: 4.5, elevationM: 2680 },
      { distanceKm: 6, elevationM: 2776 },
      { distanceKm: 7.5, elevationM: 2650 },
      { distanceKm: 9, elevationM: 2450 },
      { distanceKm: 10.5, elevationM: 2280 },
      { distanceKm: 11.7, elevationM: 2148 },
    ],
    tips: [
      'Start early to beat midday heat — there is little shade on the rim.',
      'Bring 2L+ water; the climb is steep and dusty.',
      'Matatu from Nairobi to Naivasha, then shared taxi to the gate.',
    ],
  },
];

export const seedTrailReviews: TrailReview[] = [
  {
    id: 'tr-1',
    trailId: 'longonot-trail',
    author: 'Wanjiku M.',
    rating: 5,
    comment: 'Steep but worth it. Gate opens early — we finished by noon and caught the matatu back.',
    postedAgo: '2 days ago',
  },
  {
    id: 'tr-2',
    trailId: 'mt-kenya-naromoru',
    author: 'James O.',
    rating: 4,
    comment: 'Budget hut at Met Station saved us. Teleki Valley is brutal — poles help.',
    postedAgo: '1 week ago',
  },
  {
    id: 'tr-3',
    trailId: 'mt-kenya-sirimon',
    author: 'Amina K.',
    rating: 5,
    comment: 'Gentler than Naromoru. Our Nanyuki guide was fair on price — ask at the market.',
    postedAgo: '3 weeks ago',
  },
];

export function getSavannaTrail(id: string): SavannaTrail | undefined {
  return savannaTrails.find((trail) => trail.id === id);
}
