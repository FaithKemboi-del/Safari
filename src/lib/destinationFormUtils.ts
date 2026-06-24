import type { DestinationInput, AdminDestination } from '../types/admin';
import type { DestinationCategoryId } from '../types/destination';
import { DESTINATION_CATEGORY_OPTIONS, getCategoryConfig } from './destinationCategories';

export { DESTINATION_CATEGORY_OPTIONS, getCategoryConfig };

export function emptyDestinationInput(category: DestinationCategoryId = 'wildlife'): DestinationInput {
  return {
    slug: '',
    title: '',
    location: '',
    region: 'Rift Valley',
    category,
    experienceType: category === 'hiking' ? 'hike' : 'standard',
    description: '',
    county: '',
    nearestTown: '',
    distanceFromNairobiKm: undefined,
    travelTimeFromNairobi: '',
    bestTimeToVisit: '',
    budget: {
      transport: 0,
      accommodation: 0,
      entryFee: 0,
      guideFee: 0,
      food: 0,
      activity: 0,
    },
    directions: '',
    roadConditions: '',
    publicTransport: '',
    safetyAndConditions: '',
    whatToCarry: '',
    travelTips: '',
    familyFriendly: false,
    categoryFields: {},
    image: '',
    gallery: [],
    highlights: [],
    mapQuery: '',
    status: 'draft',
    featuredOnHome: false,
    featuredSortOrder: 0,
    trendingOnHome: false,
    trendingSortOrder: 0,
    pricing: '',
    hikeDifficulty: '',
  };
}

export function adminDestinationToInput(item: AdminDestination): DestinationInput {
  const { id: _id, updatedAt: _updatedAt, ...rest } = item;
  return rest;
}
