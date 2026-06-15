const SUPABASE_URL_KEYS = ['VITE_SUPABASE_URL', 'SUPABASE_URL'] as const;
const SUPABASE_ANON_KEY_KEYS = ['VITE_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY'] as const;

export const BRAND_NAME = 'Safiri';
export const BRAND_TAGLINE = 'Budget Kenya Travel';
export const TRAILS_FEATURE_NAME = 'Safiri Trails';

export type SupabaseEnvDiagnostic = {
  urlFound: boolean;
  keyFound: boolean;
  urlUsable: boolean;
  keyUsable: boolean;
  hint: string;
};

function readEnv(keys: readonly string[]): string | undefined {
  for (const name of keys) {
    const value = import.meta.env[name];
    if (typeof value !== 'string') {
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed || isPlaceholderValue(trimmed)) {
      continue;
    }

    return trimmed;
  }

  return undefined;
}

function isPlaceholderValue(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes('your_project') ||
    normalized.includes('your_supabase') ||
    normalized === 'https://your_project_ref.supabase.co'
  );
}

function hasRawEnv(keys: readonly string[]): boolean {
  return keys.some((name) => {
    const value = import.meta.env[name];
    return typeof value === 'string' && value.trim().length > 0;
  });
}

export function getSupabaseUrl(): string | undefined {
  return readEnv(SUPABASE_URL_KEYS);
}

export function getSupabaseAnonKey(): string | undefined {
  return readEnv(SUPABASE_ANON_KEY_KEYS);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function getSupabaseEnvDiagnostic(): SupabaseEnvDiagnostic {
  const urlFound = hasRawEnv(SUPABASE_URL_KEYS);
  const keyFound = hasRawEnv(SUPABASE_ANON_KEY_KEYS);
  const urlUsable = Boolean(getSupabaseUrl());
  const keyUsable = Boolean(getSupabaseAnonKey());

  let hint = '';

  if (!urlFound && !keyFound) {
    hint =
      'No Supabase env vars were loaded. Create .env.local in the project root (next to package.json), add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart npm run dev.';
  } else if (!urlFound) {
    hint = 'VITE_SUPABASE_URL is missing. Add it to .env.local and restart npm run dev.';
  } else if (!keyFound) {
    hint =
      'VITE_SUPABASE_ANON_KEY is missing. Add it to .env.local and restart npm run dev.';
  } else if (!urlUsable) {
    hint =
      'VITE_SUPABASE_URL is still a placeholder. Replace it with your real Supabase project URL.';
  } else if (!keyUsable) {
    hint =
      'VITE_SUPABASE_ANON_KEY is still a placeholder. Replace it with your real anon public key.';
  } else if (import.meta.env.PROD) {
    hint = 'Supabase is configured.';
  } else {
    hint = 'Supabase env vars look good. Use npm run dev (not npm run preview) for local login.';
  }

  return {
    urlFound,
    keyFound,
    urlUsable,
    keyUsable,
    hint,
  };
}
