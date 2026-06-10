'use client';

import React, { createContext, useContext, type ReactNode } from 'react';

type HatidUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  photoUrl?: string | null;
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
  return (
    <PlatformContext.Provider
      value={{
        areServicesAvailable: true,
        user: null,
        isUserLoading: false,
        userError: null,
      }}
    >
      {children}
    </PlatformContext.Provider>
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
