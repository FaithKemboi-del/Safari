import { readJson, writeJson } from './storage';

export const SPOT_INQUIRIES_KEY = 'safiri-spot-inquiries';

export function readLocalSpotInquiries<T>(): T[] {
  return readJson<T[]>(SPOT_INQUIRIES_KEY, []);
}

export function writeLocalSpotInquiries<T>(inquiries: T[]): { ok: true } | { ok: false; error: string } {
  return writeJson(SPOT_INQUIRIES_KEY, inquiries);
}
