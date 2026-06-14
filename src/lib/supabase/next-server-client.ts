import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import type { Database } from './database.types';
import { readSupabasePublicConfig, type SupabasePublicEnv } from './server-env';
import type { HatidSupabaseClient } from './server-client';

export async function createSupabaseCookieServerClientFromEnv(
  env: SupabasePublicEnv = process.env,
): Promise<HatidSupabaseClient> {
  const config = readSupabasePublicConfig(env);
  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Cookie writes are intentionally deferred until middleware or server actions are wired.
      },
    },
  });
}

export type SupabaseCookieServerClient = HatidSupabaseClient;
