import type { HatidSupabaseClient } from './server-client';

export function createSupabaseCookieServerClientFromEnv(): never {
  throw new Error('Cookie-bound Supabase client wiring is deferred until the profile UI form is wired.');
}

export type SupabaseCookieServerClient = HatidSupabaseClient;
