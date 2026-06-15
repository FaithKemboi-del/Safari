import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from './config';
import type { Database } from './database.types';

let client: SupabaseClient<Database> | null = null;
let cachedUrl: string | null = null;
let cachedKey: string | null = null;

export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    client = null;
    cachedUrl = null;
    cachedKey = null;
    return null;
  }

  const supabaseUrl = getSupabaseUrl()!;
  const supabaseAnonKey = getSupabaseAnonKey()!;

  if (!client || cachedUrl !== supabaseUrl || cachedKey !== supabaseAnonKey) {
    client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    cachedUrl = supabaseUrl;
    cachedKey = supabaseAnonKey;
  }

  return client;
}
