import assert from 'node:assert/strict';
import test from 'node:test';

import { tryCreateClient } from '../src/platform/supabase-client-init';

test('browser Supabase initialization degrades safely when public env is unavailable', () => {
  const envError = new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  const result = tryCreateClient(() => {
    throw envError;
  });

  assert.equal(result.client, null);
  assert.equal(result.error, envError);
});
