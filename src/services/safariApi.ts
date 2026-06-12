import type { CommunityUpdate, Destination, Itinerary } from '../data';
import { communityUpdates as localCommunity, destinations as localDestinations, itineraries as localItineraries } from '../data';
import { formatPostedAgo, isLiveUpdate } from '../lib/format';
import { isSupabaseConfigured } from '../lib/config';
import { getSupabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type DestinationRow = Database['public']['Tables']['destinations']['Row'];
type ItineraryRow = Database['public']['Tables']['itineraries']['Row'];
type ItineraryDayRow = Database['public']['Tables']['itinerary_days']['Row'];
type CommunityRow = Database['public']['Tables']['community_updates']['Row'];

function mapDestination(row: DestinationRow): Destination {
  return {
    slug: row.slug,
    title: row.title,
    location: row.location,
    region: row.region,
    experienceType: row.experience_type,
    description: row.description,
    pricing: row.pricing ?? undefined,
    safetyAndConditions: row.safety_and_conditions ?? undefined,
    transportAndLogistics: row.transport_and_logistics ?? undefined,
    additionalInfo: row.additional_info ?? undefined,
    hikeDifficulty: row.hike_difficulty ?? undefined,
    image: row.image,
    gallery: row.gallery,
    highlights: row.highlights,
    mapQuery: row.map_query,
  };
}

function mapItinerary(row: ItineraryRow, days: ItineraryDayRow[]): Itinerary {
  return {
    id: row.id,
    title: row.title,
    duration: row.duration,
    route: row.route,
    price: row.price,
    style: row.style,
    image: row.image,
    days: days
      .filter((day) => day.itinerary_id === row.id)
      .sort((a, b) => a.day_order - b.day_order)
      .map((day) => ({
        day: day.day_label,
        title: day.title,
        details: day.details,
      })),
  };
}

function mapCommunityUpdate(row: CommunityRow): CommunityUpdate {
  return {
    id: row.id,
    destinationSlug: row.destination_slug,
    author: row.author_name,
    avatar: row.author_name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    postedAgo: formatPostedAgo(row.created_at),
    isOnGround: row.is_on_ground,
    isLive: isLiveUpdate(row.is_on_ground, row.created_at),
    comment: row.comment,
  };
}

export async function fetchDestinations(): Promise<Destination[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return localDestinations;
  }

  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('status', 'published')
    .order('title');

  const rows = data as DestinationRow[] | null;

  if (error || !rows?.length) {
    console.warn('Supabase destinations fallback:', error?.message);
    return localDestinations;
  }

  return rows.map(mapDestination);
}

export async function fetchItineraries(): Promise<Itinerary[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return localItineraries;
  }

  const { data: itineraryData, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('status', 'live')
    .order('title');

  const itineraries = itineraryData as ItineraryRow[] | null;

  if (error || !itineraries?.length) {
    console.warn('Supabase itineraries fallback:', error?.message);
    return localItineraries;
  }

  const { data: dayData, error: daysError } = await supabase
    .from('itinerary_days')
    .select('*')
    .in(
      'itinerary_id',
      itineraries.map((item) => item.id),
    )
    .order('day_order');

  const days = dayData as ItineraryDayRow[] | null;

  if (daysError) {
    console.warn('Supabase itinerary days fallback:', daysError.message);
    return localItineraries;
  }

  return itineraries.map((row) => mapItinerary(row, days ?? []));
}

export async function fetchCommunityUpdates(destinationSlug: string): Promise<CommunityUpdate[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return localCommunity.filter((update) => update.destinationSlug === destinationSlug);
  }

  const { data, error } = await supabase
    .from('community_updates')
    .select('*')
    .eq('destination_slug', destinationSlug)
    .order('created_at', { ascending: false });

  const rows = data as CommunityRow[] | null;

  if (error || !rows) {
    console.warn('Supabase community fallback:', error?.message);
    return localCommunity.filter((update) => update.destinationSlug === destinationSlug);
  }

  return rows.map(mapCommunityUpdate);
}

export async function postCommunityUpdate(input: {
  destinationSlug: string;
  userId: string;
  authorName: string;
  comment: string;
  isOnGround: boolean;
}): Promise<CommunityUpdate | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  const payload = {
    destination_slug: input.destinationSlug,
    user_id: input.userId,
    author_name: input.authorName,
    comment: input.comment,
    is_on_ground: input.isOnGround,
  };

  const { data, error } = await supabase.from('community_updates').insert(payload).select('*').single();

  const row = data as CommunityRow | null;

  if (error || !row) {
    console.error('Failed to post community update:', error?.message);
    return null;
  }

  return mapCommunityUpdate(row);
}

export function getDataSourceLabel(): 'supabase' | 'local' {
  return isSupabaseConfigured() ? 'supabase' : 'local';
}
