import type { CategorySpotInput } from '../types/admin';

export type CategoryCardFieldConfig = {
  eyebrow: string;
  sectionTitle: string;
  sectionLead: string;
  budgetLabel: string;
  budgetPlaceholder: string;
  descriptionPlaceholder: string;
  previewLines: string[];
  showDestinationSlug: boolean;
  showTrailId: boolean;
  showMapQuery: boolean;
  showEventFields: boolean;
  destinationSlugLabel: string;
  destinationSlugPlaceholder: string;
  destinationSlugHelp: string;
  trailIdLabel: string;
  trailIdPlaceholder: string;
  trailIdHelp: string;
  mapQueryLabel: string;
  mapQueryPlaceholder: string;
  mapQueryHelp: string;
  dateLabelLabel: string;
  dateLabelPlaceholder: string;
  eventStatusLabel: string;
};

const genericConfig = (
  eyebrow: string,
  options: Partial<CategoryCardFieldConfig> = {},
): CategoryCardFieldConfig => ({
  eyebrow,
  sectionTitle: 'Budget-friendly picks',
  sectionLead: 'Hand-picked Kenyan spots that keep costs low without skipping the experience.',
  budgetLabel: 'Budget line (shown on card badge)',
  budgetPlaceholder: 'From $15 park entry',
  descriptionPlaceholder: 'Short teaser shown on the category card.',
  previewLines: [
    'Budget badge at top of card',
    'Title and location',
    'Description paragraph',
    'View details + Open in Maps buttons',
  ],
  showDestinationSlug: true,
  showTrailId: false,
  showMapQuery: true,
  showEventFields: false,
  destinationSlugLabel: 'Destination slug (View details link)',
  destinationSlugPlaceholder: 'hells-gate',
  destinationSlugHelp: 'Links to #destination/your-slug on the public site.',
  trailIdLabel: 'Trail ID (View details link)',
  trailIdPlaceholder: 'longonot-trail',
  trailIdHelp: 'Links to #trail/your-trail-id instead of a destination page.',
  mapQueryLabel: 'Map query (Open in Maps)',
  mapQueryPlaceholder: "Hell's Gate National Park Kenya",
  mapQueryHelp: 'Used when travelers tap Open in Maps on the card.',
  dateLabelLabel: 'Date label',
  dateLabelPlaceholder: 'Happening this week',
  eventStatusLabel: 'Event status badge',
  ...options,
});

export const CATEGORY_CARD_CONFIG: Record<string, CategoryCardFieldConfig> = {
  hiking: genericConfig('Hiking', {
    sectionTitle: 'More budget hiking destinations',
    sectionLead: 'Budget hike cards below the interactive trail maps on the hiking page.',
    budgetPlaceholder: 'From $15 park entry + $15 bike hire',
    descriptionPlaceholder:
      "Canyon loop with geothermal steam — easy matatu day trip from Nairobi.",
    previewLines: [
      'Budget badge, title, location, description',
      'View details → destination page or trail map',
      'Open in Maps',
    ],
    showTrailId: true,
    destinationSlugHelp: 'Most hiking cards link to a destination detail page.',
    trailIdHelp: 'Use instead of destination slug to open an interactive trail map.',
  }),
  waterfalls: genericConfig('Waterfalls', {
    budgetPlaceholder: 'From $3 entry',
    descriptionPlaceholder: '74m waterfall on the Ewaso Narok River — budget Rift Valley stop.',
    mapQueryPlaceholder: "Thomson's Falls Nyahururu Kenya",
  }),
  camping: genericConfig('Camping', {
    budgetPlaceholder: 'From $20/night camping',
    descriptionPlaceholder: 'Budget public campsite — bring your own tent or rent locally.',
    mapQueryPlaceholder: "Hell's Gate National Park Kenya",
  }),
  roadtrips: genericConfig('Road trips', {
    budgetPlaceholder: 'From $12 SGR economy',
    descriptionPlaceholder: 'Fast budget hop to the coast — book early for cheapest fares.',
    mapQueryPlaceholder: 'Nairobi SGR Terminus',
    destinationSlugHelp: 'Optional — link to a related destination page if you have one.',
  }),
  'hidden-gems': genericConfig('Hidden gems', {
    budgetPlaceholder: 'From $35/night guesthouse',
    descriptionPlaceholder: 'UNESCO stone town, dhow culture, and no cars — slow travel at its best.',
    mapQueryPlaceholder: 'Lamu Old Town Kenya',
  }),
  wildlife: genericConfig('Wildlife', {
    budgetPlaceholder: 'From $43 entry + $60 shared tour',
    descriptionPlaceholder: 'Skyline safari minutes from the city — book shared vans to split costs.',
    mapQueryPlaceholder: 'Nairobi National Park Kenya',
  }),
  coast: genericConfig('Coast', {
    budgetPlaceholder: 'From $25/night hostel',
    descriptionPlaceholder: 'White sand, tuk-tuk hops, and street food — peak budget coast base.',
    mapQueryPlaceholder: 'Diani Beach Kenya',
  }),
  events: genericConfig('Events', {
    sectionTitle: 'Event listings',
    sectionLead: 'Cards filtered by Happening now / Upcoming / Past on the events page.',
    budgetLabel: 'Budget line (shown below status badge)',
    budgetPlaceholder: 'Free street events / from $35 guesthouse',
    descriptionPlaceholder: 'Dhow races, Swahili poetry, and night markets in the old town alleys.',
    previewLines: [
      'Status badge (happening now / upcoming / past)',
      'Budget badge, title, location · date label',
      'Description',
      'View details + Open in Maps',
      'Join live chat button when status is happening now',
    ],
    showEventFields: true,
    showTrailId: false,
    destinationSlugLabel: 'Destination slug (optional View details link)',
    destinationSlugPlaceholder: 'diani',
    destinationSlugHelp: 'Optional link for travelers who want a full destination write-up.',
    mapQueryPlaceholder: 'Lamu Old Town Kenya',
  }),
};

export function getCategoryCardConfig(categoryId: string): CategoryCardFieldConfig {
  return CATEGORY_CARD_CONFIG[categoryId] ?? CATEGORY_CARD_CONFIG.hiking;
}

export function sanitizeCategorySpotInputForCategory(input: CategorySpotInput): CategorySpotInput {
  const config = getCategoryCardConfig(input.categoryId);

  return {
    ...input,
    trailId: config.showTrailId ? input.trailId : '',
    dateLabel: config.showEventFields ? input.dateLabel : '',
    eventStatus: config.showEventFields ? input.eventStatus : undefined,
  };
}
