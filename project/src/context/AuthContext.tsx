import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { AppUser } from '@/types';

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<{ full_name: string } | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .maybeSingle();
  if (error) return null;
  return data;
}

function sessionToUser(session: Session): AppUser {
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'User',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      if (data.session) {
        const profile = await fetchProfile(data.session.user.id);
        if (!mounted) return;
        const u = sessionToUser(data.session);
        if (profile?.full_name) u.name = profile.full_name;
        setUser(u);
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          return;
        }
        const profile = await fetchProfile(session.user.id);
        const u = sessionToUser(session);
        if (profile?.full_name) u.name = profile.full_name;
        setUser(u);
      })();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message === 'Invalid login credentials') {
        throw new Error(
          'That email and password combination is not correct. If you have forgotten your password, use the "Forgot password?" link below.'
        );
      }
      if (error.message === 'Email not confirmed') {
        throw new Error('Please confirm your email address first — check your inbox for the confirmation link.');
      }
      if (error.message === 'Email address is invalid') {
        throw new Error('Please enter a valid email address.');
      }
      throw new Error(error.message);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        throw new Error('An account with this email already exists. Try signing in instead.');
      }
      throw new Error(error.message);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
