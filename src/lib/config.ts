export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const BRAND_NAME = 'Safiri';
export const BRAND_TAGLINE = 'Budget Kenya Travel';
export const TRAILS_FEATURE_NAME = 'Safiri Trails';

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
