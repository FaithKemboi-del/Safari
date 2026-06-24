export type DestinationCategoryId =
  | 'hiking'
  | 'waterfalls'
  | 'camping'
  | 'wildlife'
  | 'hidden-gems'
  | 'coast'
  | 'staycations'
  | 'events';

/** @deprecated Use category instead */
export type DestinationExperienceType = 'hike' | 'standard';

export type DestinationBudget = {
  transport: number;
  accommodation: number;
  entryFee: number;
  guideFee: number;
  food: number;
  activity: number;
};

export type DestinationBudgetEstimates = {
  dayTrip: number;
  weekend: number;
  total: number;
};

export type HikingCategoryFields = {
  difficulty?: string;
  trail_length?: string;
  elevation_gain?: string;
  hiking_duration?: string;
  fitness_level?: string;
  packing_list?: string;
  trail_information?: string;
};

export type WaterfallsCategoryFields = {
  waterfall_height?: string;
  swimming_allowed?: string;
  family_friendly?: string;
  best_season?: string;
  nearby_attractions?: string;
};

export type CampingCategoryFields = {
  facilities?: string;
  security_rating?: string;
  tent_rental?: string;
  fire_pit?: string;
  washrooms?: string;
  showers?: string;
  parking?: string;
  electricity?: string;
};

export type WildlifeCategoryFields = {
  wildlife_highlights?: string;
  animals_seen?: string;
  game_drives?: string;
  safari_tips?: string;
  viewing_season?: string;
};

export type HiddenGemsCategoryFields = {
  why_special?: string;
  why_hidden?: string;
  unique_experiences?: string;
  photo_spots?: string;
};

export type CoastCategoryFields = {
  beach_activities?: string;
  swimming?: string;
  snorkeling?: string;
  diving?: string;
  family_friendly?: string;
  nearby_restaurants?: string;
  nearby_hotels?: string;
};

export type StaycationsCategoryFields = {
  accommodation_type?: string;
  amenities?: string;
  wifi?: string;
  pool?: string;
  restaurant?: string;
  bonfire?: string;
  pet_friendly?: string;
  ideal_for?: string;
};

export type EventsCategoryFields = {
  event_date?: string;
  event_time?: string;
  venue?: string;
  ticket_price?: string;
  ticket_link?: string;
  organizer?: string;
  event_description?: string;
};

export type DestinationCategoryFields =
  | HikingCategoryFields
  | WaterfallsCategoryFields
  | CampingCategoryFields
  | WildlifeCategoryFields
  | HiddenGemsCategoryFields
  | CoastCategoryFields
  | StaycationsCategoryFields
  | EventsCategoryFields;

export type Destination = {
  slug: string;
  title: string;
  location: string;
  region: string;
  category: DestinationCategoryId;
  /** @deprecated */
  experienceType?: DestinationExperienceType;
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
  featuredOnHome?: boolean;
  featuredSortOrder?: number;
  trendingOnHome?: boolean;
  trendingTag?: string;
  trendingSearches?: string;
  trendingSortOrder?: number;
  /** @deprecated migrated into budget */
  pricing?: string;
  /** @deprecated */
  transportAndLogistics?: string;
  /** @deprecated */
  additionalInfo?: string;
  /** @deprecated */
  hikeDifficulty?: string;
};
