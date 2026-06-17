import type { Destination, Itinerary, TrendingItem } from '../data';

export const LANDING_FEATURED_DESTINATIONS_LIMIT = 3;
export const LANDING_FEATURED_ITINERARIES_LIMIT = 3;
export const LANDING_TRENDING_LIMIT = 3;

function sortByOrder<T extends { featuredSortOrder?: number }>(items: T[]): T[] {
  return [...items].sort(
    (left, right) => (left.featuredSortOrder ?? 0) - (right.featuredSortOrder ?? 0),
  );
}

function sortTrendingByOrder(items: Destination[]): Destination[] {
  return [...items].sort(
    (left, right) => (left.trendingSortOrder ?? 0) - (right.trendingSortOrder ?? 0),
  );
}

export function pickFeaturedDestinations(destinations: Destination[]): Destination[] {
  const featured = sortByOrder(destinations.filter((item) => item.featuredOnHome));
  if (featured.length > 0) {
    return featured.slice(0, LANDING_FEATURED_DESTINATIONS_LIMIT);
  }

  return destinations.slice(0, LANDING_FEATURED_DESTINATIONS_LIMIT);
}

export function pickFeaturedItineraries(itineraries: Itinerary[]): Itinerary[] {
  const featured = sortByOrder(itineraries.filter((item) => item.featuredOnHome));
  if (featured.length > 0) {
    return featured.slice(0, LANDING_FEATURED_ITINERARIES_LIMIT);
  }

  return itineraries.slice(0, LANDING_FEATURED_ITINERARIES_LIMIT);
}

export function destinationToTrendingItem(destination: Destination): TrendingItem {
  return {
    id: destination.slug,
    title: destination.title,
    location: destination.location,
    tag: destination.trendingTag ?? destination.region,
    searches: destination.trendingSearches ?? 'Trending now',
    image: destination.image,
    slug: destination.slug,
    mapQuery: destination.mapQuery,
  };
}

export function pickTrendingItems(
  destinations: Destination[],
  fallback: TrendingItem[],
): TrendingItem[] {
  const featured = sortTrendingByOrder(destinations.filter((item) => item.trendingOnHome)).map(
    destinationToTrendingItem,
  );

  if (featured.length > 0) {
    return featured.slice(0, LANDING_TRENDING_LIMIT);
  }

  return fallback.slice(0, LANDING_TRENDING_LIMIT);
}
