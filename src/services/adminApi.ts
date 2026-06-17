import { getSupabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { getAllLocalCategoryCards } from '../categoryContent';
import type {
  AdminCategorySpot,
  AdminDestination,
  AdminItinerary,
  AdminMetrics,
  AdminRoute,
  CategorySpotInput,
  DestinationInput,
  ItineraryInput,
  RouteInput,
} from '../types/admin';

type DestinationRow = Database['public']['Tables']['destinations']['Row'];
type ItineraryRow = Database['public']['Tables']['itineraries']['Row'];
type ItineraryDayRow = Database['public']['Tables']['itinerary_days']['Row'];
type RouteRow = Database['public']['Tables']['routes']['Row'];
type CategorySpotRow = Database['public']['Tables']['category_spots']['Row'];

function requireSupabase() {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase is not configured. Admin changes require a connected database.');
  }
  return supabase;
}

function mapAdminDestination(row: DestinationRow): AdminDestination {
  return {
    id: row.id,
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
    gallery: row.gallery ?? [],
    highlights: row.highlights ?? [],
    mapQuery: row.map_query,
    status: row.status,
    featuredOnHome: row.featured_on_home ?? false,
    featuredSortOrder: row.featured_sort_order ?? 0,
    trendingOnHome: row.trending_on_home ?? false,
    trendingTag: row.trending_tag ?? undefined,
    trendingSearches: row.trending_searches ?? undefined,
    trendingSortOrder: row.trending_sort_order ?? 0,
    updatedAt: row.updated_at,
  };
}

function mapAdminItinerary(row: ItineraryRow, days: ItineraryDayRow[]): AdminItinerary {
  return {
    id: row.id,
    title: row.title,
    duration: row.duration,
    route: row.route,
    price: row.price,
    style: row.style,
    image: row.image,
    status: row.status,
    featuredOnHome: row.featured_on_home ?? false,
    featuredSortOrder: row.featured_sort_order ?? 0,
    updatedAt: row.updated_at,
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

function mapAdminRoute(row: RouteRow): AdminRoute {
  return {
    id: row.id,
    name: row.name,
    routeType: row.route_type,
    distance: row.distance,
    status: row.status,
    updatedAt: row.updated_at,
  };
}

function destinationToRow(input: DestinationInput) {
  return {
    slug: input.slug,
    title: input.title,
    location: input.location,
    region: input.region,
    experience_type: input.experienceType,
    description: input.description,
    pricing: input.pricing ?? null,
    safety_and_conditions: input.safetyAndConditions ?? null,
    transport_and_logistics: input.transportAndLogistics ?? null,
    additional_info: input.additionalInfo ?? null,
    hike_difficulty: input.hikeDifficulty ?? null,
    image: input.image,
    gallery: input.gallery,
    highlights: input.highlights,
    map_query: input.mapQuery,
    status: input.status,
    featured_on_home: input.featuredOnHome,
    featured_sort_order: input.featuredSortOrder,
    trending_on_home: input.trendingOnHome,
    trending_tag: input.trendingTag ?? null,
    trending_searches: input.trendingSearches ?? null,
    trending_sort_order: input.trendingSortOrder,
  };
}

function itineraryHeaderToRow(input: ItineraryInput) {
  return {
    id: input.id,
    title: input.title,
    duration: input.duration,
    route: input.route,
    price: input.price,
    style: input.style,
    image: input.image,
    status: input.status,
    featured_on_home: input.featuredOnHome,
    featured_sort_order: input.featuredSortOrder,
  };
}

function routeToRow(input: RouteInput) {
  return {
    name: input.name,
    route_type: input.routeType,
    distance: input.distance,
    status: input.status,
  };
}

export async function fetchAdminDestinations(): Promise<AdminDestination[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data as DestinationRow[] | null) ?? []).map(mapAdminDestination);
}

export async function createDestination(input: DestinationInput): Promise<AdminDestination> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('destinations')
    .insert(destinationToRow(input) as never)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not create destination.');
  }

  return mapAdminDestination(data as DestinationRow);
}

export async function updateDestination(
  id: string,
  input: DestinationInput,
): Promise<AdminDestination> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('destinations')
    .update(destinationToRow(input))
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not update destination.');
  }

  return mapAdminDestination(data as DestinationRow);
}

export async function deleteDestination(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('destinations').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchAdminItineraries(): Promise<AdminItinerary[]> {
  const supabase = requireSupabase();
  const { data: itineraryData, error } = await supabase
    .from('itineraries')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const itineraries = (itineraryData as ItineraryRow[] | null) ?? [];
  if (itineraries.length === 0) {
    return [];
  }

  const { data: dayData, error: daysError } = await supabase
    .from('itinerary_days')
    .select('*')
    .in(
      'itinerary_id',
      itineraries.map((item) => item.id),
    )
    .order('day_order');

  if (daysError) {
    throw new Error(daysError.message);
  }

  const days = (dayData as ItineraryDayRow[] | null) ?? [];
  return itineraries.map((row) => mapAdminItinerary(row, days));
}

async function replaceItineraryDays(itineraryId: string, days: ItineraryInput['days']) {
  const supabase = requireSupabase();
  const { error: deleteError } = await supabase
    .from('itinerary_days')
    .delete()
    .eq('itinerary_id', itineraryId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (days.length === 0) {
    return;
  }

  const payload = days.map((day, index) => ({
    itinerary_id: itineraryId,
    day_order: index + 1,
    day_label: day.day,
    title: day.title,
    details: day.details,
  }));

  const { error: insertError } = await supabase.from('itinerary_days').insert(payload as never);
  if (insertError) {
    throw new Error(insertError.message);
  }
}

export async function createItinerary(input: ItineraryInput): Promise<AdminItinerary> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('itineraries')
    .insert(itineraryHeaderToRow(input) as never)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not create itinerary.');
  }

  await replaceItineraryDays(input.id, input.days);
  return mapAdminItinerary(data as ItineraryRow, input.days.map((day, index) => ({
    id: `${input.id}-${index}`,
    itinerary_id: input.id,
    day_order: index + 1,
    day_label: day.day,
    title: day.title,
    details: day.details,
  })));
}

export async function updateItinerary(input: ItineraryInput): Promise<AdminItinerary> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('itineraries')
    .update(itineraryHeaderToRow(input))
    .eq('id', input.id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not update itinerary.');
  }

  await replaceItineraryDays(input.id, input.days);
  return mapAdminItinerary(data as ItineraryRow, input.days.map((day, index) => ({
    id: `${input.id}-${index}`,
    itinerary_id: input.id,
    day_order: index + 1,
    day_label: day.day,
    title: day.title,
    details: day.details,
  })));
}

export async function deleteItinerary(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('itineraries').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchAdminRoutes(): Promise<AdminRoute[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data as RouteRow[] | null) ?? []).map(mapAdminRoute);
}

export async function createRoute(input: RouteInput): Promise<AdminRoute> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('routes').insert(routeToRow(input) as never).select('*').single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not create route.');
  }

  return mapAdminRoute(data as RouteRow);
}

export async function updateRoute(id: string, input: RouteInput): Promise<AdminRoute> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('routes')
    .update(routeToRow(input))
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not update route.');
  }

  return mapAdminRoute(data as RouteRow);
}

export async function deleteRoute(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('routes').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  const supabase = requireSupabase();
  const [destinations, itineraries, routes, categorySpots] = await Promise.all([
    supabase.from('destinations').select('status'),
    supabase.from('itineraries').select('status'),
    supabase.from('routes').select('status'),
    supabase.from('category_spots').select('status'),
  ]);

  if (destinations.error || itineraries.error || routes.error || categorySpots.error) {
    throw new Error(
      destinations.error?.message ??
        itineraries.error?.message ??
        routes.error?.message ??
        categorySpots.error?.message ??
        'Could not load metrics.',
    );
  }

  const destinationRows = (destinations.data as { status: string }[] | null) ?? [];
  const itineraryRows = (itineraries.data as { status: string }[] | null) ?? [];
  const routeRows = (routes.data as { status: string }[] | null) ?? [];
  const categoryRows = (categorySpots.data as { status: string }[] | null) ?? [];

  return {
    publishedDestinations: destinationRows.filter((row) => row.status === 'published').length,
    draftDestinations: destinationRows.filter((row) => row.status === 'draft').length,
    liveItineraries: itineraryRows.filter((row) => row.status === 'live').length,
    activeRoutes: routeRows.filter((row) => row.status === 'active').length,
    publishedCategoryCards: categoryRows.filter((row) => row.status === 'published').length,
  };
}

function mapAdminCategorySpot(row: CategorySpotRow): AdminCategorySpot {
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
    status: row.status,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
}

function categorySpotToRow(input: CategorySpotInput) {
  return {
    id: input.id,
    category_id: input.categoryId,
    title: input.title,
    location: input.location,
    budget: input.budget,
    description: input.description,
    image: input.image,
    slug: input.slug ?? null,
    trail_id: input.trailId ?? null,
    map_query: input.mapQuery ?? null,
    date_label: input.categoryId === 'events' ? input.dateLabel ?? null : null,
    event_status: input.categoryId === 'events' ? input.eventStatus ?? null : null,
    status: input.status,
    sort_order: input.sortOrder,
  };
}

export async function fetchAdminCategorySpots(): Promise<AdminCategorySpot[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('category_spots')
    .select('*')
    .order('category_id')
    .order('sort_order')
    .order('title');

  if (error) {
    throw new Error(error.message);
  }

  return ((data as CategorySpotRow[] | null) ?? []).map(mapAdminCategorySpot);
}

export async function createCategorySpot(input: CategorySpotInput): Promise<AdminCategorySpot> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('category_spots')
    .insert(categorySpotToRow(input) as never)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not create category card.');
  }

  return mapAdminCategorySpot(data as CategorySpotRow);
}

export async function updateCategorySpot(input: CategorySpotInput): Promise<AdminCategorySpot> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('category_spots')
    .update(categorySpotToRow(input) as never)
    .eq('id', input.id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not update category card.');
  }

  return mapAdminCategorySpot(data as CategorySpotRow);
}

export async function deleteCategorySpot(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('category_spots').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function importDemoCategorySpots(): Promise<number> {
  const existing = await fetchAdminCategorySpots();
  if (existing.length > 0) {
    throw new Error('Category cards already exist. Delete them first or edit individually.');
  }

  const localCards = getAllLocalCategoryCards();
  let imported = 0;

  for (const [index, card] of localCards.entries()) {
    await createCategorySpot({
      id: card.id,
      categoryId: card.categoryId,
      title: card.title,
      location: card.location,
      budget: card.budget,
      description: card.description,
      image: card.image,
      slug: card.slug,
      trailId: card.trailId,
      mapQuery: card.mapQuery,
      dateLabel: card.dateLabel,
      eventStatus: card.eventStatus,
      status: 'published',
      sortOrder: index,
    });
    imported += 1;
  }

  return imported;
}

type CommunityPostRow = Database['public']['Tables']['community_posts']['Row'];

function mapAdminCommunityPost(row: CommunityPostRow) {
  return {
    id: row.id,
    authorName: row.author_name,
    message: row.message,
    kind: row.kind,
    destinationSlug: row.destination_slug ?? undefined,
    itineraryId: row.itinerary_id ?? undefined,
    isPinned: row.is_pinned,
    status: row.status,
    updatedAt: row.updated_at,
  };
}

export async function fetchAdminCommunityPosts() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data as CommunityPostRow[] | null) ?? []).map(mapAdminCommunityPost);
}

export async function updateCommunityPostModeration(
  id: string,
  input: { status?: 'published' | 'hidden'; isPinned?: boolean },
) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('community_posts')
    .update({
      status: input.status,
      is_pinned: input.isPinned,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not update community post.');
  }

  return mapAdminCommunityPost(data as CommunityPostRow);
}

export async function deleteCommunityPost(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('community_posts').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
}
