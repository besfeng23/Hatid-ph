import assert from 'node:assert/strict';
import test from 'node:test';

import { createProfileDataClient } from '../src/lib/server-helpers/profile-runtime-client';
import type { HatidSupabaseClient } from '../src/lib/supabase/server-client';

test('createProfileDataClient delegates supported profile tables', () => {
  const calls: string[] = [];
  const builder = { marker: 'query-builder' };
  const client = {
    from(table: string) {
      calls.push(table);
      return builder;
    },
  } as unknown as HatidSupabaseClient;

  const dataClient = createProfileDataClient(client);

  assert.equal(dataClient.from('profiles'), builder);
  assert.equal(dataClient.from('rider_profiles'), builder);
  assert.deepEqual(calls, ['profiles', 'rider_profiles']);
});
