import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getMyRiderProfile,
  saveMyRiderProfile,
  type RiderProfileRpcClient,
} from '../src/lib/rider/rider-profile';

test('getMyRiderProfile calls only get_my_rider_profile RPC with no args', async () => {
  const calls: Array<{ name: string; args?: Record<string, string> }> = [];
  const client: RiderProfileRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, string>) {
      calls.push({ name, args });
      return {
        data: [
          {
            id: 'not-exposed',
            user_id: 'not-exposed',
            display_name: '  Maria Santos  ',
            phone: '  +639171234567  ',
            status: 'active',
            audit_trail: { ignored: true },
            role: 'admin',
          },
        ] as TRow[],
        error: null,
      };
    },
  };

  const result = await getMyRiderProfile(client);

  assert.deepEqual(calls, [{ name: 'get_my_rider_profile', args: undefined }]);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.data, {
      display_name: 'Maria Santos',
      phone: '+639171234567',
      status: 'active',
    });
    assert.equal(result.data !== null && 'id' in result.data, false);
    assert.equal(result.data !== null && 'user_id' in result.data, false);
    assert.equal(result.data !== null && 'audit_trail' in result.data, false);
    assert.equal(result.data !== null && 'role' in result.data, false);
  }
});

test('getMyRiderProfile maps backend failures to a safe generic UI error', async () => {
  const client: RiderProfileRpcClient = {
    async rpc<TRow>() {
      return {
        data: null as TRow | null,
        error: { message: 'relation rider.rider_profiles denied by internal policy' },
      };
    },
  };

  const result = await getMyRiderProfile(client);

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error.message, 'We could not load your rider profile right now.');
    assert.equal(result.error.message.includes('rider.rider_profiles'), false);
  }
});

test('saveMyRiderProfile calls only upsert_my_rider_profile RPC with safe args', async () => {
  const calls: Array<{ name: string; args?: Record<string, string> }> = [];
  const client: RiderProfileRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, string>) {
      calls.push({ name, args });
      return {
        data: {
          id: 'not-exposed',
          user_id: 'not-exposed',
          display_name: '  Juan Dela Cruz  ',
          phone: '  +639991112222  ',
          status: 'pending_review',
          admin_notes: 'not exposed',
        } as TRow,
        error: null,
      };
    },
  };

  const result = await saveMyRiderProfile(client, {
    display_name: '  Juan Dela Cruz  ',
    phone: '  +639991112222  ',
    status: 'malicious-client-status',
    admin_notes: 'do not send',
  } as Parameters<typeof saveMyRiderProfile>[1] & { status: string; admin_notes: string });

  assert.deepEqual(calls, [
    {
      name: 'upsert_my_rider_profile',
      args: {
        p_display_name: 'Juan Dela Cruz',
        p_phone: '+639991112222',
      },
    },
  ]);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.data, {
      display_name: 'Juan Dela Cruz',
      phone: '+639991112222',
      status: 'pending_review',
    });
    assert.equal('id' in result.data, false);
    assert.equal('user_id' in result.data, false);
    assert.equal('admin_notes' in result.data, false);
  }
});

test('saveMyRiderProfile maps backend failures to a safe generic UI error', async () => {
  const client: RiderProfileRpcClient = {
    async rpc<TRow>() {
      return {
        data: null as TRow | null,
        error: { message: 'constraint rider profile internal database detail' },
      };
    },
  };

  const result = await saveMyRiderProfile(client, {
    display_name: 'Maria Santos',
    phone: '+639171234567',
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error.message, 'We could not save your rider profile right now. Please try again.');
    assert.equal(result.error.message.includes('constraint'), false);
  }
});

test('rider profile helper client has no direct table access surface', async () => {
  const client = {
    from() {
      throw new Error('direct table access must not be used');
    },
    async rpc<TRow>() {
      return { data: null as TRow | null, error: null };
    },
  };

  const getResult = await getMyRiderProfile(client);
  const saveResult = await saveMyRiderProfile(client, { display_name: 'A', phone: 'B' });

  assert.equal(getResult.ok, true);
  assert.equal(saveResult.ok, true);
});
