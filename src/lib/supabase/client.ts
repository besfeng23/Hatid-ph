import { createBrowserClient } from '@supabase/ssr';

import { assertPublicSupabaseEnv } from '@/lib/env/hatid-env';
import type { Database } from './database.types';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createBrowserSupabaseClient() {
  if (browserClient) {
    return browserClient;
  }

  const env = assertPublicSupabaseEnv();

  browserClient = createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
  return browserClient;
}
