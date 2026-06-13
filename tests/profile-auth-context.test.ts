import assert from 'node:assert/strict';
import test from 'node:test';

import { createProfileAuthContext } from '../src/lib/server-helpers/profile-auth-context';
import type { HatidSupabaseClient } from '../src/lib/supabase/server-client';

function createMockClient(userId: string | null, error: Error | null = null): HatidSupabaseClient {
  return {
    auth: {
      async getUser() {
        return {
          data: {
            user: userId ? ({ id: userId } as never) : null,
          },
          error,
        };
      },
    },
    from() {
      throw new Error('profile storage should not be called by auth context creation');
    },
  } as unknown as HatidSupabaseClient;
}

test('profile auth context returns auth_required when user is missing', async () => {
  const result = await createProfileAuthContext(createMockClient(null));

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.equal(result.error.code, 'auth_required');
  }
});

test('profile auth context builds service for authenticated user', async () => {
  const result = await createProfileAuthContext(createMockClient('user-1'));

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.equal(result.data.userId, 'user-1');
    assert.equal(typeof result.data.service.readBundle, 'function');
    assert.equal(typeof result.data.service.saveBase, 'function');
    assert.equal(typeof result.data.service.saveRider, 'function');
  }
});
