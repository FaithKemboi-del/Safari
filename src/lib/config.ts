export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const BRAND_NAME = 'Safiri';
export const BRAND_TAGLINE = 'Budget Kenya Travel';
export const TRAILS_FEATURE_NAME = 'Safiri Trails';

/** Authorized admin account — must match Supabase auth user + profiles.is_admin */
export const ADMIN_EMAIL = 'fchepkosgei21@gmail.com';

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
