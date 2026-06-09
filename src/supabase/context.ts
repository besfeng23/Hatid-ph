'use client';

import { createContext } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

export const SupabaseContext = createContext<{
  supabase: SupabaseClient | null;
}>({ supabase: null });
