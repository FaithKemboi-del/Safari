import type { Destination, Itinerary } from '../data';

const PLANNING_KEYWORDS = [
  'itinerary',
  'route',
  'plan',
  'days',
  'day trip',
  'weekend',
  'budget trip',
  'how do i',
  'how can i',
  'suggest',
  'recommend',
  'where should',
  'what route',
];

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'for',
  'from',
  'to',
  'in',
  'on',
  'with',
  'kenya',
  'trip',
  'travel',
  'want',
  'need',
  'looking',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function scoreOverlap(messageTokens: string[], candidateText: string): number {
  const candidateTokens = new Set(tokenize(candidateText));
  return messageTokens.reduce((score, token) => score + (candidateTokens.has(token) ? 1 : 0), 0);
}

export function looksLikeItineraryQuestion(message: string, kind: string): boolean {
  if (kind !== 'question') {
    return false;
  }

  const lower = message.toLowerCase();
  return PLANNING_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export function suggestItinerariesForMessage(message: string, itineraries: Itinerary[]): Itinerary[] {
  const tokens = tokenize(message);
  if (tokens.length === 0) {
    return [];
  }

  return itineraries
    .map((itinerary) => ({
      itinerary,
      score: scoreOverlap(tokens, `${itinerary.title} ${itinerary.route} ${itinerary.style} ${itinerary.duration}`),
    }))
    .filter((item) => item.score >= 2)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((item) => item.itinerary);
}

export function suggestDestinationsForMessage(message: string, destinations: Destination[]): Destination[] {
  const tokens = tokenize(message);
  if (tokens.length === 0) {
    return [];
  }

  return destinations
    .map((destination) => ({
      destination,
      score: scoreOverlap(
        tokens,
        `${destination.title} ${destination.location} ${destination.region} ${destination.slug}`,
      ),
    }))
    .filter((item) => item.score >= 2)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((item) => item.destination);
}
