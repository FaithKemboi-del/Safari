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
import { isSupabaseConfigured } from '../lib/config';
import { getSupabase } from '../lib/supabase';
import { initialsFromName } from '../lib/format';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  /** True while the initial Supabase session is being restored. */
  loading: boolean;
  /** True while the admin flag is being loaded from profiles. */
  adminLoading: boolean;
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

const ADMIN_PROFILE_TIMEOUT_MS = 12_000;
const SESSION_BOOTSTRAP_TIMEOUT_MS = 10_000;

async function fetchIsAdmin(user: User | null): Promise<boolean> {
  if (!user) {
    return false;
  }

  const supabase = getSupabase();
  if (!supabase) {
    return false;
  }

  try {
    const profileQuery = supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    const { data, error } = await Promise.race([
      profileQuery,
      new Promise<Awaited<typeof profileQuery>>((_, reject) => {
        window.setTimeout(
          () => reject(new Error('Admin profile check timed out')),
          ADMIN_PROFILE_TIMEOUT_MS,
        );
      }),
    ]);

    if (error) {
      console.error('Failed to load admin profile:', error);
      return false;
    }

    return Boolean(data?.is_admin);
  } catch (profileError) {
    console.error('Failed to load admin profile:', profileError);
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const isConfigured = isSupabaseConfigured();

  const syncAdminStatus = useCallback(async (nextUser: User | null) => {
    if (!nextUser) {
      setIsAdmin(false);
      setAdminLoading(false);
      return false;
    }

    setAdminLoading(true);

    try {
      const admin = await fetchIsAdmin(nextUser);
      setIsAdmin(admin);
      return admin;
    } finally {
      setAdminLoading(false);
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabase();

    if (!supabase) {
      setLoading(false);
      setAdminLoading(false);
      return;
    }

    let cancelled = false;

    const finishBootstrap = () => {
      if (!cancelled) {
        setLoading(false);
      }
    };

    const bootstrapTimeout = window.setTimeout(finishBootstrap, SESSION_BOOTSTRAP_TIMEOUT_MS);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) {
          return;
        }

        setSession(data.session);
        setUser(data.session?.user ?? null);
        finishBootstrap();
        window.setTimeout(() => {
          void syncAdminStatus(data.session?.user ?? null);
        }, 0);
      })
      .catch((sessionError) => {
        console.error('Failed to restore auth session:', sessionError);
        finishBootstrap();
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (cancelled) {
        return;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      finishBootstrap();

      // Defer async profile work — awaiting inside this callback can deadlock getSession().
      window.setTimeout(() => {
        void syncAdminStatus(nextSession?.user ?? null);
      }, 0);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(bootstrapTimeout);
      subscription.unsubscribe();
    };
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
      adminLoading,
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
          return { error: 'Admin sign-in is not available right now.' };
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { error: 'Invalid email or password.' };
        }

        setAdminLoading(true);

        try {
          const admin = await fetchIsAdmin(data.user);
          if (!admin) {
            await supabase.auth.signOut();
            return { error: 'You do not have access to this area.' };
          }

          setUser(data.user);
          setSession(data.session);
          setIsAdmin(true);
          return {};
        } finally {
          setAdminLoading(false);
        }
      },
      async signOut() {
        const supabase = getSupabase();
        sessionStorage.removeItem('safari-signed-in');
        setIsAdmin(false);
        setAdminLoading(false);
        if (!supabase) {
          setUser(null);
          setSession(null);
          return;
        }
        await supabase.auth.signOut();
      },
    }),
    [user, session, loading, adminLoading, isConfigured, isAdmin, displayName, avatarInitials],
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
