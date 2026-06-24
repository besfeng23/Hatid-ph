import assert from 'node:assert/strict';
import test from 'node:test';

import {
  findRideRequestCandidates,
  type DispatchCandidateRpcClient,
} from '../src/lib/dispatch/candidates';

test('dispatch candidate helper calls candidate RPC with clamped limit', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: DispatchCandidateRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: [
          {
            driver_user_id: 'driver-1',
            vehicle_id: 'vehicle-1',
            vehicle_type: 'sedan',
            vehicle_status: 'active',
            availability_status: 'online',
            distance_km: 1.75,
            last_heartbeat_at: '2026-06-24T21:00:00Z',
            heartbeat_expires_at: '2026-06-24T21:02:00Z',
            metadata: { hidden: true },
          },
        ] as TRow,
        error: null,
      };
    },
  };

  const result = await findRideRequestCandidates(client, { requestId: 'request-1', limit: 100 });

  assert.deepEqual(calls, [
    { name: 'find_ride_request_candidates', args: { p_request_id: 'request-1', p_limit: 25 } },
  ]);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.length, 1);
    assert.equal(result.data[0].distance_km, 1.75);
    assert.equal('metadata' in result.data[0], false);
  }
});

test('dispatch candidate helper maps backend errors safely', async () => {
  const client = {
    async rpc<TRow>() {
      return { data: null as TRow | null, error: { message: 'internal dispatch.find_ride_request_candidates denied' } };
    },
  };

  const result = await findRideRequestCandidates(client, { requestId: 'request-1' });

  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.message.includes('dispatch.find_ride_request_candidates'), false);
});
