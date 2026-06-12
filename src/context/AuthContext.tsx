import {
  createContext,
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
  loading: boolean;
  isConfigured: boolean;
  displayName: string;
  avatarInitials: string;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    const supabase = getSupabase();

    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      async signOut() {
        const supabase = getSupabase();
        sessionStorage.removeItem('safari-signed-in');
        if (!supabase) {
          return;
        }
        await supabase.auth.signOut();
      },
    }),
    [user, session, loading, isConfigured, displayName, avatarInitials],
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
