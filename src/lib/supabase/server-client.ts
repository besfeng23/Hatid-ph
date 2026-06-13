import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types';
import {
  readSupabasePublicConfig,
  readSupabaseServiceConfig,
  type SupabasePublicConfig,
  type SupabasePublicEnv,
  type SupabaseServiceConfig,
  type SupabaseServiceEnv,
} from './server-env';

export type HatidSupabaseClient = SupabaseClient<Database>;

export function createSupabasePublicClient(config: SupabasePublicConfig): HatidSupabaseClient {
  return createClient<Database>(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createSupabaseServiceClient(config: SupabaseServiceConfig): HatidSupabaseClient {
  return createClient<Database>(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createSupabasePublicClientFromEnv(env: SupabasePublicEnv): HatidSupabaseClient {
  return createSupabasePublicClient(readSupabasePublicConfig(env));
}

export function createSupabaseServiceClientFromEnv(env: SupabaseServiceEnv): HatidSupabaseClient {
  return createSupabaseServiceClient(readSupabaseServiceConfig(env));
}
