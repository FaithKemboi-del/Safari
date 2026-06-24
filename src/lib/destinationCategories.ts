import type { DestinationBudget, DestinationBudgetEstimates, DestinationCategoryId } from '../types/destination';

export type CategoryFieldDef = {
  key: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'select' | 'url';
  options?: string[];
};

export type DestinationCategoryConfig = {
  id: DestinationCategoryId;
  label: string;
  icon: string;
  fields: CategoryFieldDef[];
};

export const DESTINATION_CATEGORIES: DestinationCategoryConfig[] = [
  {
    id: 'hiking',
    label: 'Hiking',
    icon: 'hiking',
    fields: [
      { key: 'difficulty', label: 'Difficulty level', type: 'select', options: ['Easy', 'Moderate', 'Hard'] },
      { key: 'trail_length', label: 'Trail length', placeholder: 'e.g. 7 km loop' },
      { key: 'elevation_gain', label: 'Elevation gain', placeholder: 'e.g. 580 m' },
      { key: 'hiking_duration', label: 'Estimated hiking time', placeholder: 'e.g. 4–6 hours' },
      { key: 'fitness_level', label: 'Fitness level required', placeholder: 'e.g. Moderate fitness' },
      { key: 'packing_list', label: 'Packing list', type: 'textarea' },
      { key: 'trail_information', label: 'Trail information', type: 'textarea' },
    ],
  },
  {
    id: 'waterfalls',
    label: 'Waterfalls',
    icon: 'waterfall',
    fields: [
      { key: 'waterfall_height', label: 'Waterfall height', placeholder: 'e.g. 74 m' },
      { key: 'swimming_allowed', label: 'Swimming allowed', placeholder: 'Yes / No / Seasonal' },
      { key: 'family_friendly', label: 'Family friendly', placeholder: 'Yes / No' },
      { key: 'best_season', label: 'Best season', placeholder: 'e.g. After rains, Apr–Jun' },
      { key: 'nearby_attractions', label: 'Nearby attractions', type: 'textarea' },
    ],
  },
  {
    id: 'camping',
    label: 'Camping',
    icon: 'camping',
    fields: [
      { key: 'facilities', label: 'Campsite facilities', type: 'textarea' },
      { key: 'security_rating', label: 'Security rating', placeholder: 'e.g. Good / Fair' },
      { key: 'tent_rental', label: 'Tent rental', placeholder: 'Available / Bring your own' },
      { key: 'fire_pit', label: 'Fire pit', placeholder: 'Yes / No' },
      { key: 'washrooms', label: 'Washrooms', placeholder: 'Shared / Private / None' },
      { key: 'showers', label: 'Showers', placeholder: 'Yes / Cold only / No' },
      { key: 'parking', label: 'Parking', placeholder: 'Free / Paid / Limited' },
      { key: 'electricity', label: 'Electricity', placeholder: 'Yes / Generator hours / No' },
    ],
  },
  {
    id: 'wildlife',
    label: 'Wildlife',
    icon: 'wildlife',
    fields: [
      { key: 'wildlife_highlights', label: 'Wildlife highlights', type: 'textarea' },
      { key: 'animals_seen', label: 'Animals commonly seen', type: 'textarea' },
      { key: 'game_drives', label: 'Game drive availability', type: 'textarea' },
      { key: 'safari_tips', label: 'Safari tips', type: 'textarea' },
      { key: 'viewing_season', label: 'Best viewing season', placeholder: 'e.g. Jul–Oct migration' },
    ],
  },
  {
    id: 'hidden-gems',
    label: 'Hidden gems',
    icon: 'gem',
    fields: [
      { key: 'why_special', label: 'Why it is special', type: 'textarea' },
      { key: 'why_hidden', label: 'Why most travelers miss it', type: 'textarea' },
      { key: 'unique_experiences', label: 'Unique experiences', type: 'textarea' },
      { key: 'photo_spots', label: 'Photography spots', type: 'textarea' },
    ],
  },
  {
    id: 'coast',
    label: 'Coast',
    icon: 'coast',
    fields: [
      { key: 'beach_activities', label: 'Beach activities', type: 'textarea' },
      { key: 'swimming', label: 'Swimming', placeholder: 'Safe / Seasonal / Check tides' },
      { key: 'snorkeling', label: 'Snorkeling', placeholder: 'Yes / Hire gear locally' },
      { key: 'diving', label: 'Diving', placeholder: 'Shops nearby / Not available' },
      { key: 'family_friendly', label: 'Family friendly', placeholder: 'Yes / No' },
      { key: 'nearby_restaurants', label: 'Nearby restaurants', type: 'textarea' },
      { key: 'nearby_hotels', label: 'Nearby hotels', type: 'textarea' },
    ],
  },
  {
    id: 'staycations',
    label: 'Staycations',
    icon: 'camping',
    fields: [
      { key: 'accommodation_type', label: 'Accommodation type', placeholder: 'Lodge / Cottage / Glamping' },
      { key: 'amenities', label: 'Amenities', type: 'textarea' },
      { key: 'wifi', label: 'WiFi', placeholder: 'Yes / Limited / No' },
      { key: 'pool', label: 'Pool', placeholder: 'Yes / No' },
      { key: 'restaurant', label: 'Restaurant', placeholder: 'On-site / Nearby' },
      { key: 'bonfire', label: 'Bonfire', placeholder: 'Yes / On request' },
      { key: 'pet_friendly', label: 'Pet friendly', placeholder: 'Yes / No' },
      { key: 'ideal_for', label: 'Ideal for', placeholder: 'Couples, families, friends, solo' },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    icon: 'events',
    fields: [
      { key: 'event_date', label: 'Event date', placeholder: 'e.g. 12 Jul 2026' },
      { key: 'event_time', label: 'Event time', placeholder: 'e.g. 10:00 – 18:00' },
      { key: 'venue', label: 'Venue', placeholder: 'Venue name and area' },
      { key: 'ticket_price', label: 'Ticket price', placeholder: 'From KES 500' },
      { key: 'ticket_link', label: 'Ticket link', type: 'url' },
      { key: 'organizer', label: 'Organizer' },
      { key: 'event_description', label: 'What to expect', type: 'textarea' },
    ],
  },
];

export const DESTINATION_CATEGORY_MAP = Object.fromEntries(
  DESTINATION_CATEGORIES.map((category) => [category.id, category]),
) as Record<DestinationCategoryId, DestinationCategoryConfig>;

export const DESTINATION_CATEGORY_OPTIONS = DESTINATION_CATEGORIES.map((category) => ({
  value: category.id,
  label: category.label,
}));

export function getCategoryConfig(categoryId: DestinationCategoryId): DestinationCategoryConfig {
  return DESTINATION_CATEGORY_MAP[categoryId] ?? DESTINATION_CATEGORY_MAP.wildlife;
}

export function computeBudgetEstimates(budget: DestinationBudget): DestinationBudgetEstimates {
  const dayTrip =
    budget.transport + budget.entryFee + budget.guideFee + budget.food + budget.activity;
  const weekend = dayTrip * 2 + budget.accommodation * 2;
  const total =
    budget.transport +
    budget.accommodation +
    budget.entryFee +
    budget.guideFee +
    budget.food +
    budget.activity;

  return { dayTrip, weekend, total };
}

export function formatBudgetKes(amount: number): string {
  if (!amount || amount <= 0) {
    return '—';
  }

  return `KES ${Math.round(amount).toLocaleString()}`;
}

export function inferCategoryFromLegacy(input: {
  experienceType?: string;
  slug?: string;
}): DestinationCategoryId {
  if (input.experienceType === 'hike') {
    return 'hiking';
  }

  if (input.slug === 'diani') {
    return 'coast';
  }

  return 'wildlife';
}
