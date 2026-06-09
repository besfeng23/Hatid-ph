'use client';

import { useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

import { SupabaseContext } from './context';
import { createSupabaseClient } from './client';

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState<SupabaseClient>(() =>
    createSupabaseClient()
  );

  return (
    <SupabaseContext.Provider value={{ supabase: supabaseClient }}>
      {children}
    </SupabaseContext.Provider>
  );
}
