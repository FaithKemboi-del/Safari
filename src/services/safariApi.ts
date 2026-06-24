import type { CommunityUpdate, Itinerary } from '../data';
import type { Destination } from '../types/destination';
import { communityUpdates as localCommunity, destinations as localDestinations, itineraries as localItineraries } from '../data';
import type { CategorySpot } from '../categoryContent';
import { getAllLocalCategoryCards } from '../categoryContent';
import { formatPostedAgo, isLiveUpdate } from '../lib/format';
import { mapDestinationRow } from '../lib/destinationMapper';
import { isSupabaseConfigured } from '../lib/config';
import { getSupabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type DestinationRow = Database['public']['Tables']['destinations']['Row'];
type ItineraryRow = Database['public']['Tables']['itineraries']['Row'];
type ItineraryDayRow = Database['public']['Tables']['itinerary_days']['Row'];
type CommunityRow = Database['public']['Tables']['community_updates']['Row'];
type CategorySpotRow = Database['public']['Tables']['category_spots']['Row'];

function mapCategorySpot(row: CategorySpotRow): CategorySpot {
  return {
    id: row.id,
    categoryId: row.category_id,
    title: row.title,
    location: row.location,
    budget: row.budget,
    description: row.description,
    image: row.image,
    slug: row.slug ?? undefined,
    trailId: row.trail_id ?? undefined,
    mapQuery: row.map_query ?? undefined,
    dateLabel: row.date_label ?? undefined,
    eventStatus: row.event_status ?? undefined,
  };
}

function mapDestination(row: DestinationRow): Destination {
  return mapDestinationRow(row);
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
    featuredOnHome: row.featured_on_home ?? false,
    featuredSortOrder: row.featured_sort_order ?? 0,
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

export async function fetchCategorySpots(): Promise<CategorySpot[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return getAllLocalCategoryCards();
  }

  const { data, error } = await supabase
    .from('category_spots')
    .select('*')
    .eq('status', 'published')
    .order('category_id')
    .order('sort_order')
    .order('title');

  const rows = data as CategorySpotRow[] | null;

  if (error || !rows?.length) {
    console.warn('Supabase category spots fallback:', error?.message);
    return getAllLocalCategoryCards();
  }

  return rows.map(mapCategorySpot);
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
    console.warn('Failed to post community update: Supabase client not configured.');
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
