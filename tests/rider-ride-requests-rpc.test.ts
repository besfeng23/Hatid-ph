import assert from 'node:assert/strict';
import test from 'node:test';

import {
  cancelMyRideRequest,
  createMyRideRequest,
  getMyRideRequests,
  type RideRequestRpcClient,
} from '../src/lib/rider/ride-requests';

test('ride request helpers call only approved RPCs', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: RideRequestRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: {
          id: 'request-1',
          quote_id: 'quote-1',
          pickup_address_text: '  Alabang  ',
          dropoff_address_text: '  Makati  ',
          service_type: 'standard',
          estimate_minor: 17000,
          currency: 'PHP',
          status: 'requested',
          metadata: { hidden: true },
          user_id: 'hidden',
        } as TRow,
        error: null,
      };
    },
  };

  const listResult = await getMyRideRequests(client);
  const createResult = await createMyRideRequest(client, { quoteId: 'quote-1', riderNotes: '  lobby  ' });
  const cancelResult = await cancelMyRideRequest(client, 'request-1');

  assert.deepEqual(calls, [
    { name: 'get_my_ride_requests', args: undefined },
    { name: 'create_my_ride_request', args: { p_quote_id: 'quote-1', p_rider_notes: 'lobby' } },
    { name: 'cancel_my_ride_request', args: { p_request_id: 'request-1' } },
  ]);
  assert.equal(listResult.ok, true);
  assert.equal(createResult.ok, true);
  assert.equal(cancelResult.ok, true);
  if (createResult.ok) {
    assert.equal(createResult.data.pickup_address_text, 'Alabang');
    assert.equal(createResult.data.dropoff_address_text, 'Makati');
    assert.equal('metadata' in createResult.data, false);
    assert.equal('user_id' in createResult.data, false);
  }
});

test('ride request helpers map backend errors safely', async () => {
  const client = {
    async rpc<TRow>() {
      return { data: null as TRow | null, error: { message: 'internal rider.ride_requests denied' } };
    },
  };

  const listResult = await getMyRideRequests(client);
  const createResult = await createMyRideRequest(client, { quoteId: 'quote-1' });
  const cancelResult = await cancelMyRideRequest(client, 'request-1');

  assert.equal(listResult.ok, false);
  assert.equal(createResult.ok, false);
  assert.equal(cancelResult.ok, false);
  if (!listResult.ok) assert.equal(listResult.error.message.includes('rider.ride_requests'), false);
  if (!createResult.ok) assert.equal(createResult.error.message.includes('rider.ride_requests'), false);
  if (!cancelResult.ok) assert.equal(cancelResult.error.message.includes('rider.ride_requests'), false);
});
