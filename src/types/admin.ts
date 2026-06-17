import type { DestinationExperienceType } from '../data';

export type ContentStatus = 'published' | 'draft' | 'review';
export type ItineraryStatus = 'live' | 'draft' | 'review';
export type RouteStatus = 'active' | 'draft';

export type AdminDestination = {
  id: string;
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
  status: ContentStatus;
  featuredOnHome: boolean;
  featuredSortOrder: number;
  trendingOnHome: boolean;
  trendingTag?: string;
  trendingSearches?: string;
  trendingSortOrder: number;
  updatedAt: string;
};

export type AdminItineraryDay = {
  day: string;
  title: string;
  details: string;
};

export type AdminItinerary = {
  id: string;
  title: string;
  duration: string;
  route: string;
  price: string;
  style: string;
  image: string;
  status: ItineraryStatus;
  featuredOnHome: boolean;
  featuredSortOrder: number;
  days: AdminItineraryDay[];
  updatedAt: string;
};

export type AdminRoute = {
  id: string;
  name: string;
  routeType: string;
  distance: string;
  status: RouteStatus;
  updatedAt: string;
};

export type AdminMetrics = {
  publishedDestinations: number;
  draftDestinations: number;
  liveItineraries: number;
  activeRoutes: number;
  publishedCategoryCards: number;
};

export type AdminCategorySpot = {
  id: string;
  categoryId: string;
  title: string;
  location: string;
  budget: string;
  description: string;
  image: string;
  slug?: string;
  trailId?: string;
  mapQuery?: string;
  dateLabel?: string;
  eventStatus?: 'happening-now' | 'upcoming' | 'past';
  status: ContentStatus;
  sortOrder: number;
  updatedAt: string;
};

export type DestinationInput = Omit<AdminDestination, 'id' | 'updatedAt'>;
export type ItineraryInput = Omit<AdminItinerary, 'updatedAt'>;
export type RouteInput = Omit<AdminRoute, 'id' | 'updatedAt'>;
export type CategorySpotInput = Omit<AdminCategorySpot, 'updatedAt'>;
