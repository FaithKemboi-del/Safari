import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isAdminEmail, isSupabaseConfigured } from '../lib/config';
import { getSupabase } from '../lib/supabase';
import { initialsFromName } from '../lib/format';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isAdmin: boolean;
  displayName: string;
  avatarInitials: string;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  adminSignIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchIsAdmin(user: User | null): Promise<boolean> {
  if (!user || !isAdminEmail(user.email)) {
    return false;
  }

  const supabase = getSupabase();
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load admin profile:', error);
    return false;
  }

  return Boolean(data?.is_admin);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const isConfigured = isSupabaseConfigured();

  const syncAdminStatus = useCallback(async (nextUser: User | null) => {
    const admin = await fetchIsAdmin(nextUser);
    setIsAdmin(admin);
    return admin;
  }, []);

  useEffect(() => {
    const supabase = getSupabase();

    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        setSession(data.session);
        setUser(data.session?.user ?? null);
        await syncAdminStatus(data.session?.user ?? null);
        setLoading(false);
      })
      .catch((sessionError) => {
        console.error('Failed to restore auth session:', sessionError);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      await syncAdminStatus(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [syncAdminStatus]);

  const displayName = useMemo(() => {
    if (!user) {
      return '';
    }

    return (
      (user.user_metadata?.full_name as string | undefined) ||
      user.email?.split('@')[0] ||
      'Traveler'
    );
  }, [user]);

  const avatarInitials = useMemo(() => initialsFromName(displayName || 'Traveler'), [displayName]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      isConfigured,
      isAdmin,
      displayName,
      avatarInitials,
      async signIn(email, password) {
        const supabase = getSupabase();
        if (!supabase) {
          sessionStorage.setItem('safari-signed-in', 'true');
          return {};
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message };
      },
      async signUp(email, password, fullName) {
        const supabase = getSupabase();
        if (!supabase) {
          sessionStorage.setItem('safari-signed-in', 'true');
          return {};
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        return { error: error?.message };
      },
      async adminSignIn(email, password) {
        const supabase = getSupabase();
        if (!supabase) {
          return {
            error:
              'Admin login requires Supabase. Configure .env.local and seed the admin user first.',
          };
        }

        if (!isAdminEmail(email)) {
          return { error: 'This email is not authorized for admin access.' };
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { error: error.message };
        }

        const admin = await fetchIsAdmin(data.user);
        if (!admin) {
          await supabase.auth.signOut();
          return {
            error:
              'Account found but admin access is not enabled. Run scripts/seed-admin-user.mjs and migration 004.',
          };
        }

        setUser(data.user);
        setSession(data.session);
        setIsAdmin(true);
        return {};
      },
      async signOut() {
        const supabase = getSupabase();
        sessionStorage.removeItem('safari-signed-in');
        setIsAdmin(false);
        if (!supabase) {
          setUser(null);
          setSession(null);
          return;
        }
        await supabase.auth.signOut();
      },
    }),
    [user, session, loading, isConfigured, isAdmin, displayName, avatarInitials],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useIsSignedIn(): boolean {
  const { user, isConfigured } = useAuth();

  if (isConfigured) {
    return Boolean(user);
  }

  return sessionStorage.getItem('safari-signed-in') === 'true';
}
