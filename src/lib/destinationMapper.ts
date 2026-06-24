import type { Database } from './database.types';
import { computeBudgetEstimates, inferCategoryFromLegacy } from './destinationCategories';
import type { Destination, DestinationBudget, DestinationCategoryId } from '../types/destination';

type DestinationRow = Database['public']['Tables']['destinations']['Row'];

function parseCategoryFields(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, fieldValue]) => fieldValue != null && String(fieldValue).trim())
      .map(([key, fieldValue]) => [key, String(fieldValue)]),
  );
}

function rowBudget(row: DestinationRow): DestinationBudget {
  return {
    transport: Number(row.budget_transport ?? 0),
    accommodation: Number(row.budget_accommodation ?? 0),
    entryFee: Number(row.budget_entry_fee ?? 0),
    guideFee: Number(row.budget_guide_fee ?? 0),
    food: Number(row.budget_food ?? 0),
    activity: Number(row.budget_activity ?? 0),
  };
}

export function mapDestinationRow(row: DestinationRow): Destination {
  const category =
    (row.category as DestinationCategoryId | null) ??
    inferCategoryFromLegacy({ experienceType: row.experience_type, slug: row.slug });
  const categoryFields = parseCategoryFields(row.category_fields);

  if (row.hike_difficulty && category === 'hiking' && !categoryFields.difficulty) {
    categoryFields.difficulty = row.hike_difficulty.split('—')[0]?.trim() ?? row.hike_difficulty;
    categoryFields.trail_information = categoryFields.trail_information ?? row.hike_difficulty;
  }

  if (category === 'wildlife' && row.highlights?.length && !categoryFields.wildlife_highlights) {
    categoryFields.wildlife_highlights = row.highlights.join(', ');
  }

  return {
    slug: row.slug,
    title: row.title,
    location: row.location,
    region: row.region,
    category,
    experienceType: row.experience_type,
    description: row.description,
    county: row.county ?? row.location ?? row.region,
    nearestTown: row.nearest_town ?? undefined,
    distanceFromNairobiKm: row.distance_from_nairobi_km ?? undefined,
    travelTimeFromNairobi: row.travel_time_from_nairobi ?? undefined,
    bestTimeToVisit: row.best_time_to_visit ?? undefined,
    budget: rowBudget(row),
    directions: row.directions ?? row.transport_and_logistics ?? undefined,
    roadConditions: row.road_conditions ?? undefined,
    publicTransport: row.public_transport ?? undefined,
    safetyAndConditions: row.safety_and_conditions ?? undefined,
    whatToCarry: row.what_to_carry ?? undefined,
    travelTips: row.travel_tips ?? row.additional_info ?? undefined,
    familyFriendly: row.family_friendly ?? false,
    categoryFields,
    image: row.image,
    gallery: row.gallery ?? [],
    highlights: row.highlights ?? [],
    mapQuery: row.map_query,
    featuredOnHome: row.featured_on_home ?? false,
    featuredSortOrder: row.featured_sort_order ?? 0,
    trendingOnHome: row.trending_on_home ?? false,
    trendingTag: row.trending_tag ?? undefined,
    trendingSearches: row.trending_searches ?? undefined,
    trendingSortOrder: row.trending_sort_order ?? 0,
    pricing: row.pricing ?? undefined,
    transportAndLogistics: row.transport_and_logistics ?? undefined,
    additionalInfo: row.additional_info ?? undefined,
    hikeDifficulty: row.hike_difficulty ?? undefined,
  };
}

export function mapLegacyDestination(legacy: {
  slug: string;
  title: string;
  location: string;
  region: string;
  experienceType?: 'hike' | 'standard';
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
  featuredOnHome?: boolean;
  featuredSortOrder?: number;
  trendingOnHome?: boolean;
  trendingTag?: string;
  trendingSearches?: string;
  trendingSortOrder?: number;
  category?: DestinationCategoryId;
  county?: string;
  nearestTown?: string;
  distanceFromNairobiKm?: number;
  travelTimeFromNairobi?: string;
  bestTimeToVisit?: string;
  budget?: Partial<DestinationBudget>;
  directions?: string;
  roadConditions?: string;
  publicTransport?: string;
  whatToCarry?: string;
  travelTips?: string;
  familyFriendly?: boolean;
  categoryFields?: Record<string, string>;
}): Destination {
  const category =
    legacy.category ?? inferCategoryFromLegacy({ experienceType: legacy.experienceType, slug: legacy.slug });
  const categoryFields = { ...(legacy.categoryFields ?? {}) };

  if (legacy.hikeDifficulty && category === 'hiking') {
    categoryFields.difficulty = categoryFields.difficulty ?? legacy.hikeDifficulty.split('—')[0]?.trim();
    categoryFields.trail_information = categoryFields.trail_information ?? legacy.hikeDifficulty;
  }

  if (category === 'wildlife' && legacy.highlights.length && !categoryFields.wildlife_highlights) {
    categoryFields.wildlife_highlights = legacy.highlights.join(', ');
  }

  const budget: DestinationBudget = {
    transport: legacy.budget?.transport ?? 0,
    accommodation: legacy.budget?.accommodation ?? 0,
    entryFee: legacy.budget?.entryFee ?? 0,
    guideFee: legacy.budget?.guideFee ?? 0,
    food: legacy.budget?.food ?? 0,
    activity: legacy.budget?.activity ?? 0,
  };

  return {
    slug: legacy.slug,
    title: legacy.title,
    location: legacy.location,
    region: legacy.region,
    category,
    experienceType: legacy.experienceType,
    description: legacy.description,
    county: legacy.county ?? legacy.location,
    nearestTown: legacy.nearestTown,
    distanceFromNairobiKm: legacy.distanceFromNairobiKm,
    travelTimeFromNairobi: legacy.travelTimeFromNairobi,
    bestTimeToVisit: legacy.bestTimeToVisit,
    budget,
    directions: legacy.directions ?? legacy.transportAndLogistics,
    roadConditions: legacy.roadConditions,
    publicTransport: legacy.publicTransport,
    safetyAndConditions: legacy.safetyAndConditions,
    whatToCarry: legacy.whatToCarry,
    travelTips: legacy.travelTips ?? legacy.additionalInfo,
    familyFriendly: legacy.familyFriendly ?? false,
    categoryFields,
    image: legacy.image,
    gallery: legacy.gallery,
    highlights: legacy.highlights,
    mapQuery: legacy.mapQuery,
    featuredOnHome: legacy.featuredOnHome,
    featuredSortOrder: legacy.featuredSortOrder,
    trendingOnHome: legacy.trendingOnHome,
    trendingTag: legacy.trendingTag,
    trendingSearches: legacy.trendingSearches,
    trendingSortOrder: legacy.trendingSortOrder,
    pricing: legacy.pricing,
    transportAndLogistics: legacy.transportAndLogistics,
    additionalInfo: legacy.additionalInfo,
    hikeDifficulty: legacy.hikeDifficulty,
  };
}

export function destinationToRow(input: {
  slug: string;
  title: string;
  location: string;
  region: string;
  category: DestinationCategoryId;
  experienceType?: 'hike' | 'standard';
  description: string;
  county: string;
  nearestTown?: string;
  distanceFromNairobiKm?: number;
  travelTimeFromNairobi?: string;
  bestTimeToVisit?: string;
  budget: DestinationBudget;
  directions?: string;
  roadConditions?: string;
  publicTransport?: string;
  safetyAndConditions?: string;
  whatToCarry?: string;
  travelTips?: string;
  familyFriendly: boolean;
  categoryFields: Record<string, string>;
  image: string;
  gallery: string[];
  highlights: string[];
  mapQuery: string;
  status: 'published' | 'draft' | 'review';
  featuredOnHome: boolean;
  featuredSortOrder: number;
  trendingOnHome: boolean;
  trendingTag?: string;
  trendingSearches?: string;
  trendingSortOrder: number;
  pricing?: string;
  hikeDifficulty?: string;
}) {
  const hikeDifficulty =
    input.category === 'hiking'
      ? input.categoryFields.trail_information ??
        input.categoryFields.difficulty ??
        input.hikeDifficulty ??
        null
      : input.hikeDifficulty ?? null;

  return {
    slug: input.slug,
    title: input.title,
    location: input.location,
    region: input.region,
    experience_type: (input.category === 'hiking' ? 'hike' : 'standard') as 'hike' | 'standard',
    category: input.category,
    description: input.description,
    county: input.county,
    nearest_town: input.nearestTown ?? null,
    distance_from_nairobi_km: input.distanceFromNairobiKm ?? null,
    travel_time_from_nairobi: input.travelTimeFromNairobi ?? null,
    best_time_to_visit: input.bestTimeToVisit ?? null,
    budget_transport: input.budget.transport,
    budget_accommodation: input.budget.accommodation,
    budget_entry_fee: input.budget.entryFee,
    budget_guide_fee: input.budget.guideFee,
    budget_food: input.budget.food,
    budget_activity: input.budget.activity,
    directions: input.directions ?? null,
    road_conditions: input.roadConditions ?? null,
    public_transport: input.publicTransport ?? null,
    safety_and_conditions: input.safetyAndConditions ?? null,
    what_to_carry: input.whatToCarry ?? null,
    travel_tips: input.travelTips ?? null,
    family_friendly: input.familyFriendly,
    category_fields: input.categoryFields,
    pricing: input.pricing ?? null,
    transport_and_logistics: input.directions ?? null,
    additional_info: input.travelTips ?? null,
    hike_difficulty: hikeDifficulty,
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

export function getDestinationBudgetEstimates(destination: Destination) {
  return computeBudgetEstimates(destination.budget);
}
