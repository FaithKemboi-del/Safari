/** Kenya's former provinces — used for destination filtering and place lookup. */
export const KENYA_PROVINCES = [
  'Central',
  'Coast',
  'Eastern',
  'Nairobi',
  'North Eastern',
  'Nyanza',
  'Rift Valley',
  'Western',
] as const;

export type KenyaProvince = (typeof KENYA_PROVINCES)[number];

export const KENYA_PROVINCE_FILTER_OPTIONS = ['All', ...KENYA_PROVINCES] as const;

type PlaceEntry = {
  province: KenyaProvince;
  aliases: string[];
};

/** Counties, cities, and landmarks mapped to their province. */
const PLACE_REGISTRY: PlaceEntry[] = [
  {
    province: 'Nairobi',
    aliases: ['nairobi', 'nairobi county', 'karen', 'westlands', 'eastleigh', 'karura'],
  },
  {
    province: 'Central',
    aliases: [
      'central',
      'nyeri',
      'nyeri county',
      'kiambu',
      'kiambu county',
      'muranga',
      "murang'a",
      'kirinyaga',
      'nyandarua',
      'thika',
      'mount kenya',
      'aberdare',
    ],
  },
  {
    province: 'Coast',
    aliases: [
      'coast',
      'mombasa',
      'mombasa county',
      'kwale',
      'kwale county',
      'kilifi',
      'kilifi county',
      'lamu',
      'lamu county',
      'taita taveta',
      'taita-taveta',
      'diani',
      'watamu',
      'malindi',
      'tsavo',
      'voi',
      'shimoni',
      'wasini',
    ],
  },
  {
    province: 'Eastern',
    aliases: [
      'eastern',
      'machakos',
      'machakos county',
      'kitui',
      'kitui county',
      'makueni',
      'makueni county',
      'embu',
      'embu county',
      'meru',
      'meru county',
      'tharaka nithi',
      'isiolo',
      'isiolo county',
      'marsabit',
      'marsabit county',
      'samburu',
      'samburu county',
      'chuka',
      'maua',
    ],
  },
  {
    province: 'North Eastern',
    aliases: [
      'north eastern',
      'northeastern',
      'garissa',
      'garissa county',
      'wajir',
      'wajir county',
      'mandera',
      'mandera county',
    ],
  },
  {
    province: 'Nyanza',
    aliases: [
      'nyanza',
      'kisumu',
      'kisumu county',
      'siaya',
      'siaya county',
      'homa bay',
      'migori',
      'migori county',
      'kisii',
      'kisii county',
      'nyamira',
      'lake victoria',
      'homa-bay',
    ],
  },
  {
    province: 'Rift Valley',
    aliases: [
      'rift valley',
      'riftvalley',
      'nakuru',
      'nakuru county',
      'naivasha',
      'narok',
      'narok county',
      'kajiado',
      'kajiado county',
      'kericho',
      'kericho county',
      'bomet',
      'bomet county',
      'uasin gishu',
      'uasin-gishu',
      'eldoret',
      'trans nzoia',
      'kitale',
      'nandi',
      'elgeyo marakwet',
      'elgeyo-marakwet',
      'baringo',
      'baringo county',
      'laikipia',
      'laikipia county',
      'nanyuki',
      'west pokot',
      'turkana',
      'turkana county',
      'longonot',
      "hell's gate",
      'hells gate',
      'maasai mara',
      'mara',
      'amboseli',
      'elementaita',
      'nyahururu',
      'thomson falls',
    ],
  },
  {
    province: 'Western',
    aliases: [
      'western',
      'kakamega',
      'kakamega county',
      'bungoma',
      'bungoma county',
      'busia',
      'busia county',
      'vihiga',
      'vihiga county',
    ],
  },
];

const placeToProvinceMap = new Map<string, KenyaProvince>();

for (const entry of PLACE_REGISTRY) {
  for (const alias of entry.aliases) {
    placeToProvinceMap.set(normalizePlaceKey(alias), entry.province);
  }
}

function normalizePlaceKey(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/\s+/g, ' ');
}

export function lookupProvinceForQuery(query: string): KenyaProvince | null {
  const normalized = normalizePlaceKey(query);
  if (!normalized) {
    return null;
  }

  if (placeToProvinceMap.has(normalized)) {
    return placeToProvinceMap.get(normalized)!;
  }

  for (const [place, province] of placeToProvinceMap.entries()) {
    if (normalized.includes(place) || place.includes(normalized)) {
      return province;
    }
  }

  return null;
}

export function destinationMatchesProvince(
  destination: { region: string },
  province: string,
): boolean {
  return province === 'All' || destination.region === province;
}

export function destinationMatchesSearch(
  destination: { title: string; location: string; description: string; region: string },
  query: string,
): boolean {
  const normalizedQuery = normalizePlaceKey(query);
  if (!normalizedQuery) {
    return true;
  }

  const searchable = normalizePlaceKey(
    `${destination.title} ${destination.location} ${destination.description} ${destination.region}`,
  );

  if (searchable.includes(normalizedQuery)) {
    return true;
  }

  const provinceFromPlace = lookupProvinceForQuery(normalizedQuery);
  return provinceFromPlace !== null && destination.region === provinceFromPlace;
}
