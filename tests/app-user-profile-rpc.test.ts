import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getMyAppUserProfile,
  saveMyAppUserProfile,
  type AppUserProfileRpcClient,
} from '../src/lib/profile/app-user-profile';

test('getMyAppUserProfile calls only the safe profile read RPC with no args', async () => {
  const calls: Array<{ name: string; args?: Record<string, string> }> = [];
  const client: AppUserProfileRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, string>) {
      calls.push({ name, args });
      return {
        data: [
          {
            user_id: 'not-exposed',
            display_name: 'Maria Santos',
            phone: '+639171234567',
            status: 'active',
            metadata: { ignored: true },
            organization_id: 'not-exposed',
            role: 'admin',
            membership: 'owner',
          },
        ] as TRow[],
        error: null,
      };
    },
  };

  const result = await getMyAppUserProfile(client);

  assert.deepEqual(calls, [{ name: 'get_my_app_user_profile', args: undefined }]);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.data, {
      display_name: 'Maria Santos',
      phone: '+639171234567',
    });
    assert.equal(result.data !== null && 'user_id' in result.data, false);
    assert.equal(result.data !== null && 'status' in result.data, false);
    assert.equal(result.data !== null && 'metadata' in result.data, false);
    assert.equal(result.data !== null && 'organization_id' in result.data, false);
    assert.equal(result.data !== null && 'role' in result.data, false);
    assert.equal(result.data !== null && 'membership' in result.data, false);
  }
});

test('getMyAppUserProfile returns null when the safe profile read RPC has no row', async () => {
  const client: AppUserProfileRpcClient = {
    async rpc<TRow>() {
      return {
        data: [] as TRow[],
        error: null,
      };
    },
  };

  const result = await getMyAppUserProfile(client);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data, null);
  }
});

test('getMyAppUserProfile maps RPC failures to a safe error', async () => {
  const client: AppUserProfileRpcClient = {
    async rpc<TRow>() {
      return {
        data: null as TRow | null,
        error: { message: 'internal policy name and database detail' },
      };
    },
  };

  const result = await getMyAppUserProfile(client);

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error.message, 'We could not load your saved profile right now.');
    assert.equal(result.error.message.includes('internal policy'), false);
  }
});

test('saveMyAppUserProfile calls only the audited profile RPC with narrow args', async () => {
  const calls: Array<{ name: string; args?: Record<string, string> }> = [];
  const client: AppUserProfileRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, string>) {
      calls.push({ name, args });
      return {
        data: [
          {
            user_id: 'not-exposed',
            display_name: 'Maria Santos',
            phone: '+639171234567',
            status: 'pending',
            metadata: { ignored: true },
            role: 'admin',
          },
        ] as TRow[],
        error: null,
      };
    },
  };

  const result = await saveMyAppUserProfile(client, {
    display_name: '  Maria Santos  ',
    phone: '  +639171234567  ',
  });

  assert.deepEqual(calls, [
    {
      name: 'upsert_my_app_user_profile',
      args: {
        p_display_name: 'Maria Santos',
        p_phone: '+639171234567',
      },
    },
  ]);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.data, {
      display_name: 'Maria Santos',
      phone: '+639171234567',
    });
    assert.equal('user_id' in result.data, false);
    assert.equal('status' in result.data, false);
    assert.equal('metadata' in result.data, false);
    assert.equal('role' in result.data, false);
  }
});

test('saveMyAppUserProfile maps RPC failures to a safe error', async () => {
  const client: AppUserProfileRpcClient = {
    async rpc<TRow>() {
      return {
        data: null as TRow | null,
        error: { message: 'internal policy name and database detail' },
      };
    },
  };

  const result = await saveMyAppUserProfile(client, {
    display_name: 'Maria Santos',
    phone: '+639171234567',
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error.message, 'We could not save your profile right now. Please try again.');
    assert.equal(result.error.message.includes('internal policy'), false);
  }
});
