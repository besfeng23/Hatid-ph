import {
  createSupabasePublicClient,
  type HatidSupabaseClient,
} from './server-client';
import { readSupabasePublicConfig, type SupabasePublicEnv } from './server-env';

export function createProfileSupabaseServerClient(
  env: SupabasePublicEnv,
): HatidSupabaseClient {
  return createSupabasePublicClient(readSupabasePublicConfig(env));
}
