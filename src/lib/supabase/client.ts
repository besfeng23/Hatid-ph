import { assertPublicSupabaseEnv } from '@/lib/env/hatid-env';

/**
 * Sprint 0B placeholder.
 *
 * Real implementation begins after:
 * - @supabase/supabase-js is installed
 * - lockfile is regenerated
 * - CI verifies clean install
 */
export function createBrowserSupabaseClient() {
  const env = assertPublicSupabaseEnv();

  return {
    status: 'placeholder' as const,
    url: env.supabaseUrl,
    anonKeyConfigured: Boolean(env.supabaseAnonKey),
  };
}
