import { savannaTrails, type RecordedHikeTrack, type SavannaTrail } from '../data/savannaTrails';
import { formatPostedAgo } from '../lib/format';
import { isSupabaseConfigured } from '../lib/config';
import { getSupabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import type { ElevationPoint, GpsPoint, LatLng } from '../lib/trailUtils';
import { buildElevationProfile, polylineDistanceKm } from '../lib/trailUtils';
import type { TrailReview, TrailWaypoint } from '../data/savannaTrails';

type TrailRow = Database['public']['Tables']['trails']['Row'];
type HikeTrackRow = Database['public']['Tables']['hike_tracks']['Row'];
type TrailReviewRow = Database['public']['Tables']['trail_reviews']['Row'];

export const LOCAL_CUSTOM_TRAILS_KEY = 'savanna-custom-trails';
export const SAVANNA_GPS_TRACKS_KEY = 'savanna-gps-tracks';

function parseJsonArray<T>(value: unknown, fallback: T[]): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  return fallback;
}

function mapTrailRow(row: TrailRow): SavannaTrail {
  const coordinates = parseJsonArray<LatLng>(row.coordinates, []);
  const waypoints = parseJsonArray<TrailWaypoint>(row.waypoints, []);
  const elevationProfile = parseJsonArray<ElevationPoint>(row.elevation_profile, []);

  return {
    id: row.id,
    title: row.title,
    location: row.location,
    difficulty: row.difficulty,
    difficultyLabel: row.difficulty_label,
    duration: row.duration,
    distanceKm: Number(row.distance_km),
    elevationGainM: row.elevation_gain_m,
    budget: row.budget,
    description: row.description,
    image: row.image,
    mapQuery: row.map_query,
    googleMapsUrl: row.google_maps_url,
    slug: row.destination_slug ?? undefined,
    routeType: row.route_type,
    coordinates,
    waypoints,
    elevationProfile,
    tips: row.tips ?? [],
  };
}

function mapHikeTrackRow(row: HikeTrackRow): RecordedHikeTrack {
  return {
    id: row.id,
    trailId: row.trail_id ?? undefined,
    trailName: row.trail_name,
    startedAt: row.started_at,
    endedAt: row.ended_at ?? undefined,
    points: parseJsonArray<GpsPoint>(row.track_points, []),
    distanceKm: Number(row.distance_km),
    notes: row.notes ?? undefined,
    synced: true,
  };
}

function readLocalCustomTrails(): SavannaTrail[] {
  const stored = localStorage.getItem(LOCAL_CUSTOM_TRAILS_KEY);
  if (!stored) {
    return [];
  }

  return JSON.parse(stored) as SavannaTrail[];
}

function writeLocalCustomTrails(trails: SavannaTrail[]) {
  localStorage.setItem(LOCAL_CUSTOM_TRAILS_KEY, JSON.stringify(trails));
}

function readLocalTracks(): RecordedHikeTrack[] {
  const stored = localStorage.getItem(SAVANNA_GPS_TRACKS_KEY);
  if (!stored) {
    return [];
  }

  return JSON.parse(stored) as RecordedHikeTrack[];
}

function writeLocalTracks(tracks: RecordedHikeTrack[]) {
  localStorage.setItem(SAVANNA_GPS_TRACKS_KEY, JSON.stringify(tracks));
}

function mergeTrails(remote: SavannaTrail[], localCustom: SavannaTrail[]): SavannaTrail[] {
  const merged = new Map<string, SavannaTrail>();

  for (const trail of savannaTrails) {
    merged.set(trail.id, trail);
  }

  for (const trail of remote) {
    merged.set(trail.id, trail);
  }

  for (const trail of localCustom) {
    merged.set(trail.id, trail);
  }

  return Array.from(merged.values());
}

export async function fetchTrails(): Promise<SavannaTrail[]> {
  const localCustom = readLocalCustomTrails();
  const supabase = getSupabase();

  if (!supabase) {
    return mergeTrails([], localCustom);
  }

  const { data, error } = await supabase
    .from('trails')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const rows = data as TrailRow[] | null;

  if (error || !rows) {
    console.warn('Supabase trails fallback:', error?.message);
    return mergeTrails([], localCustom);
  }

  return mergeTrails(rows.map(mapTrailRow), localCustom);
}

export async function fetchUserHikeTracks(userId: string): Promise<RecordedHikeTrack[]> {
  const localTracks = readLocalTracks();
  const supabase = getSupabase();

  if (!supabase) {
    return localTracks;
  }

  const { data, error } = await supabase
    .from('hike_tracks')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false });

  const rows = data as HikeTrackRow[] | null;

  if (error || !rows) {
    console.warn('Supabase hike tracks fallback:', error?.message);
    return localTracks;
  }

  const remote = rows.map(mapHikeTrackRow);
  const remoteIds = new Set(remote.map((track) => track.id));
  const unsyncedLocal = localTracks.filter((track) => !track.synced && !remoteIds.has(track.id));

  return [...remote, ...unsyncedLocal];
}

export async function saveHikeTrack(input: {
  userId?: string;
  trailId?: string;
  trailName: string;
  points: GpsPoint[];
  startedAt: string;
  endedAt: string;
  notes?: string;
}): Promise<RecordedHikeTrack> {
  const distanceKm = polylineDistanceKm(input.points);
  const supabase = getSupabase();

  if (supabase && input.userId) {
    const payload = {
      trail_id: input.trailId ?? null,
      user_id: input.userId,
      trail_name: input.trailName,
      track_points: input.points,
      distance_km: distanceKm,
      started_at: input.startedAt,
      ended_at: input.endedAt,
      notes: input.notes ?? null,
    };

    const { data, error } = await supabase.from('hike_tracks').insert(payload).select('*').single();
    const row = data as HikeTrackRow | null;

    if (!error && row) {
      const saved = mapHikeTrackRow(row);
      const local = readLocalTracks().filter((track) => track.id !== saved.id);
      writeLocalTracks([saved, ...local]);
      return saved;
    }

    console.warn('Supabase hike track save fallback:', error?.message);
  }

  const localTrack: RecordedHikeTrack = {
    id: `track-${Date.now()}`,
    trailId: input.trailId,
    trailName: input.trailName,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    points: input.points,
    distanceKm,
    notes: input.notes,
    synced: false,
  };

  const next = [localTrack, ...readLocalTracks()];
  writeLocalTracks(next);
  return localTrack;
}

export async function syncLocalTracksToCloud(userId: string): Promise<number> {
  const localTracks = readLocalTracks().filter((track) => !track.synced);
  let syncedCount = 0;

  const unsyncedIds = new Set(localTracks.map((track) => track.id));

  for (const track of localTracks) {
    await saveHikeTrack({
      userId,
      trailId: track.trailId,
      trailName: track.trailName,
      points: track.points,
      startedAt: track.startedAt,
      endedAt: track.endedAt ?? new Date().toISOString(),
      notes: track.notes,
    });
    syncedCount += 1;
  }

  if (syncedCount > 0) {
    writeLocalTracks(readLocalTracks().filter((track) => !unsyncedIds.has(track.id) || track.synced));
  }

  return syncedCount;
}

export async function createTrail(input: {
  userId?: string;
  trail: SavannaTrail;
}): Promise<SavannaTrail> {
  const supabase = getSupabase();

  if (supabase && input.userId) {
    const payload = {
      id: input.trail.id,
      slug: input.trail.id,
      title: input.trail.title,
      location: input.trail.location,
      difficulty: input.trail.difficulty,
      difficulty_label: input.trail.difficultyLabel,
      duration: input.trail.duration,
      distance_km: input.trail.distanceKm,
      elevation_gain_m: input.trail.elevationGainM,
      budget: input.trail.budget,
      description: input.trail.description,
      image: input.trail.image,
      map_query: input.trail.mapQuery,
      google_maps_url: input.trail.googleMapsUrl,
      destination_slug: input.trail.slug ?? null,
      route_type: input.trail.routeType,
      coordinates: input.trail.coordinates,
      waypoints: input.trail.waypoints,
      elevation_profile: input.trail.elevationProfile,
      tips: input.trail.tips,
      status: 'published' as const,
      created_by_user_id: input.userId,
    };

    const { data, error } = await supabase.from('trails').insert(payload).select('*').single();
    const row = data as TrailRow | null;

    if (!error && row) {
      return mapTrailRow(row);
    }

    console.warn('Supabase trail create fallback:', error?.message);
  }

  const localCustom = readLocalCustomTrails();
  const next = [input.trail, ...localCustom.filter((trail) => trail.id !== input.trail.id)];
  writeLocalCustomTrails(next);
  return input.trail;
}

export async function fetchTrailReviews(trailId: string): Promise<TrailReview[]> {
  const supabase = getSupabase();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('trail_reviews')
    .select('*')
    .eq('trail_id', trailId)
    .order('created_at', { ascending: false });

  const rows = data as TrailReviewRow[] | null;

  if (error || !rows) {
    return [];
  }

  return rows.map((row) => ({
    id: row.id,
    trailId: row.trail_id,
    author: row.author_name,
    rating: row.rating,
    comment: row.comment,
    postedAgo: formatPostedAgo(row.created_at),
  }));
}

export async function postTrailReview(input: {
  trailId: string;
  userId: string;
  authorName: string;
  rating: number;
  comment: string;
}): Promise<TrailReview | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('trail_reviews')
    .insert({
      trail_id: input.trailId,
      user_id: input.userId,
      author_name: input.authorName,
      rating: input.rating,
      comment: input.comment,
    })
    .select('*')
    .single();

  const row = data as TrailReviewRow | null;

  if (error || !row) {
    console.error('Failed to post trail review:', error?.message);
    return null;
  }

  return {
    id: row.id,
    trailId: row.trail_id,
    author: row.author_name,
    rating: row.rating,
    comment: row.comment,
    postedAgo: 'Just now',
  };
}

export function slugifyTrailId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function buildTrailFromRoute(input: {
  title: string;
  location: string;
  description: string;
  budget: string;
  difficulty: SavannaTrail['difficulty'];
  routeType: SavannaTrail['routeType'];
  coordinates: LatLng[];
  image?: string;
}): SavannaTrail {
  const distanceKm = polylineDistanceKm(input.coordinates);
  const elevationProfile = buildElevationProfile(input.coordinates);
  const elevations = elevationProfile.map((point) => point.elevationM);
  const elevationGainM =
    elevations.length > 1 ? Math.max(...elevations) - Math.min(...elevations) : 0;
  const first = input.coordinates[0];
  const last = input.coordinates[input.coordinates.length - 1];
  let highestIndex = 0;
  let highestElevation = Number.NEGATIVE_INFINITY;

  input.coordinates.forEach((point, index) => {
    const elevation = elevationProfile[index]?.elevationM ?? 0;
    if (elevation > highestElevation) {
      highestElevation = elevation;
      highestIndex = index;
    }
  });

  const waypoints: TrailWaypoint[] = [
    {
      id: 'start',
      name: 'Trail start',
      lat: first.lat,
      lng: first.lng,
      elevationM: elevationProfile[0]?.elevationM,
      kind: 'start',
    },
    {
      id: 'summit',
      name: 'High point',
      lat: input.coordinates[highestIndex]?.lat ?? first.lat,
      lng: input.coordinates[highestIndex]?.lng ?? first.lng,
      elevationM: highestElevation > Number.NEGATIVE_INFINITY ? highestElevation : undefined,
      kind: 'summit',
    },
    {
      id: 'finish',
      name: 'Trail end',
      lat: last.lat,
      lng: last.lng,
      kind: 'checkpoint',
    },
  ];

  const id = `${slugifyTrailId(input.title)}-${Date.now()}`;
  const mapQuery = `${input.title} ${input.location} Kenya`;

  return {
    id,
    title: input.title,
    location: input.location,
    difficulty: input.difficulty,
    difficultyLabel: `${input.difficulty.charAt(0).toUpperCase()}${input.difficulty.slice(1)}`,
    duration: distanceKm < 5 ? '1–2 hours' : distanceKm < 12 ? 'Half day' : 'Full day+',
    distanceKm: Number(distanceKm.toFixed(1)),
    elevationGainM: Math.round(elevationGainM),
    budget: input.budget,
    description: input.description,
    image:
      input.image ??
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    mapQuery,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
    routeType: input.routeType,
    coordinates: input.coordinates,
    waypoints,
    elevationProfile,
    tips: ['Share accurate conditions so other budget hikers know what to expect.'],
  };
}

export function trailsDataSourceLabel(): 'supabase' | 'local' {
  return isSupabaseConfigured() ? 'supabase' : 'local';
}
