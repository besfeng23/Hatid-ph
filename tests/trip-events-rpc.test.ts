import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getMyDriverTripEvents,
  getMyRiderTripEvents,
  type TripEventRpcClient,
} from '../src/lib/trip/trip-events';

test('trip event helpers call approved timeline RPCs', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: TripEventRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: [
          {
            id: 'event-1',
            trip_id: 'trip-1',
            actor_user_id: 'driver-1',
            event_type: 'status_changed',
            trip_status: 'arrived_pickup',
            occurred_at: '2026-06-24T21:00:00Z',
            note: null,
            metadata: { hidden: true },
          },
        ] as TRow,
        error: null,
      };
    },
  };

  const riderResult = await getMyRiderTripEvents(client, { tripId: 'trip-1' });
  const driverResult = await getMyDriverTripEvents(client, { tripId: 'trip-1' });

  assert.deepEqual(calls, [
    { name: 'get_my_rider_trip_events', args: { p_trip_id: 'trip-1' } },
    { name: 'get_my_driver_trip_events', args: { p_trip_id: 'trip-1' } },
  ]);
  assert.equal(riderResult.ok, true);
  assert.equal(driverResult.ok, true);
  if (driverResult.ok) {
    assert.equal(driverResult.data[0].trip_status, 'arrived_pickup');
    assert.equal('metadata' in driverResult.data[0], false);
  }
});

test('trip event helpers hide backend errors', async () => {
  const client = {
    async rpc<TRow>() {
      return { data: null as TRow | null, error: { message: 'internal trip.trip_events denied' } };
    },
  };

  const riderResult = await getMyRiderTripEvents(client, { tripId: 'trip-1' });
  const driverResult = await getMyDriverTripEvents(client, { tripId: 'trip-1' });

  assert.equal(riderResult.ok, false);
  assert.equal(driverResult.ok, false);
  if (!riderResult.ok) assert.equal(riderResult.error.message.includes('trip.trip_events'), false);
  if (!driverResult.ok) assert.equal(driverResult.error.message.includes('trip.trip_events'), false);
});
