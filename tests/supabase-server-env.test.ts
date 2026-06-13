import assert from 'node:assert/strict';
import test from 'node:test';

import {
  readSupabasePublicConfig,
  readSupabaseServiceConfig,
} from '../src/lib/supabase/server-env';

test('readSupabasePublicConfig requires public url and anon key', () => {
  assert.throws(
    () => readSupabasePublicConfig({}),
    /NEXT_PUBLIC_SUPABASE_URL is required/,
  );

  assert.throws(
    () =>
      readSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      }),
    /NEXT_PUBLIC_SUPABASE_ANON_KEY is required/,
  );

  assert.deepEqual(
    readSupabasePublicConfig({
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
    }),
    {
      url: 'https://example.supabase.co',
      anonKey: 'anon-key',
    },
  );
});

test('readSupabaseServiceConfig requires service role key server-side', () => {
  assert.throws(
    () =>
      readSupabaseServiceConfig({
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
      }),
    /SUPABASE_SERVICE_ROLE_KEY is required/,
  );

  assert.deepEqual(
    readSupabaseServiceConfig({
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'service-key',
    }),
    {
      url: 'https://example.supabase.co',
      anonKey: 'anon-key',
      serviceRoleKey: 'service-key',
    },
  );
});
