import type { Destination, DestinationCategoryId } from '../types/destination';
import { computeBudgetEstimates } from './destinationCategories';

export type DestinationFilters = {
  search: string;
  category: DestinationCategoryId | 'all';
  county: string;
  maxBudget: number | null;
  maxDistanceKm: number | null;
  familyFriendlyOnly: boolean;
  featuredOnly: boolean;
};

export const DEFAULT_DESTINATION_FILTERS: DestinationFilters = {
  search: '',
  category: 'all',
  county: 'All',
  maxBudget: null,
  maxDistanceKm: null,
  familyFriendlyOnly: false,
  featuredOnly: false,
};

export function destinationMatchesSearch(destination: Destination, search: string): boolean {
  const query = search.trim().toLowerCase();
  if (!query) {
    return true;
  }

  return [destination.title, destination.location, destination.county, destination.description, destination.region]
    .join(' ')
    .toLowerCase()
    .includes(query);
}

export function filterDestinations(
  destinations: Destination[],
  filters: DestinationFilters,
): Destination[] {
  return destinations.filter((destination) => {
    if (!destinationMatchesSearch(destination, filters.search)) {
      return false;
    }

    if (filters.category !== 'all' && destination.category !== filters.category) {
      return false;
    }

    if (filters.county !== 'All' && destination.county !== filters.county && destination.region !== filters.county) {
      return false;
    }

    if (filters.familyFriendlyOnly && !destination.familyFriendly) {
      return false;
    }

    if (filters.featuredOnly && !destination.featuredOnHome) {
      return false;
    }

    if (filters.maxDistanceKm != null && destination.distanceFromNairobiKm != null) {
      if (destination.distanceFromNairobiKm > filters.maxDistanceKm) {
        return false;
      }
    }

    if (filters.maxBudget != null) {
      const dayTrip = computeBudgetEstimates(destination.budget).dayTrip;
      if (dayTrip > 0 && dayTrip > filters.maxBudget) {
        return false;
      }
    }

    return true;
  });
}

export function getDestinationCounties(destinations: Destination[]): string[] {
  return ['All', ...new Set(destinations.map((destination) => destination.county).filter(Boolean))];
}
