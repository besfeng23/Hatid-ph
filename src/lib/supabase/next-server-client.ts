import {
  createSupabasePublicClient,
  type HatidSupabaseClient,
} from './server-client';
import { readSupabasePublicConfig, type SupabasePublicEnv } from './server-env';

export function createSupabaseCookieServerClientFromEnv(
  env: SupabasePublicEnv,
): HatidSupabaseClient {
  return createSupabasePublicClient(readSupabasePublicConfig(env));
}

export type SupabaseCookieServerClient = HatidSupabaseClient;
