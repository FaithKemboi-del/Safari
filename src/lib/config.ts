export const supabaseUrl = readEnv('VITE_SUPABASE_URL');
export const supabaseAnonKey = readEnv('VITE_SUPABASE_ANON_KEY');

export const BRAND_NAME = 'Safiri';
export const BRAND_TAGLINE = 'Budget Kenya Travel';
export const TRAILS_FEATURE_NAME = 'Safiri Trails';

function readEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string | undefined {
  const value = import.meta.env[name];
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.includes('YOUR_PROJECT') || trimmed.includes('your_supabase')) {
    return undefined;
  }

  return trimmed;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
