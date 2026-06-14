export type WriteJsonResult = { ok: true } | { ok: false; error: string };

export function readJson<T>(key: string, fallback: T): T {
  const stored = localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }

  try {
    return JSON.parse(stored) as T;
  } catch (error) {
    console.warn(`Corrupt localStorage key "${key}", using fallback.`, error);
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): WriteJsonResult {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not save data on this device.';
    console.error(`Failed to write localStorage key "${key}":`, error);
    return { ok: false, error: message };
  }
}
