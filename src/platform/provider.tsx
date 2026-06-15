'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { mapSupabaseUser } from '@/lib/supabase/auth-ui';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export type HatidUser = {
  id: string;
  uid: string;
  email?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  name?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
};

interface PlatformProviderProps {
  children: ReactNode;
}

export interface PlatformContextState {
  areServicesAvailable: boolean;
  user: HatidUser | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface UserHookResult {
  user: HatidUser | null;
  isUserLoading: boolean;
  userError: Error | null;
}

const PlatformContext = createContext<PlatformContextState | undefined>(undefined);

export function PlatformProvider({ children }: PlatformProviderProps) {
  const [user, setUser] = useState<HatidUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    let isMounted = true;

    const applySession = (_event: AuthChangeEvent, session: Session | null) => {
      if (!isMounted) return;
      setUser(mapSupabaseUser(session?.user ?? null));
      setUserError(null);
      setIsUserLoading(false);
    };

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;

      if (error) {
        setUser(null);
        setUserError(error);
        setIsUserLoading(false);
        return;
      }

      applySession('INITIAL_SESSION', data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(applySession);

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<PlatformContextState>(
    () => ({
      areServicesAvailable: !userError,
      user,
      isUserLoading,
      userError,
    }),
    [user, isUserLoading, userError],
  );

  return (
    <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
  );
}

export function usePlatform(): PlatformContextState {
  const context = useContext(PlatformContext);

  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider.');
  }

  return context;
}

export function useUser(): UserHookResult {
  const { user, isUserLoading, userError } = usePlatform();
  return { user, isUserLoading, userError };
}
