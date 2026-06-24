import assert from 'node:assert/strict';
import test from 'node:test';

import {
  advanceMyDriverTrip,
  getMyDriverTrips,
  getMyRiderTrips,
  type TripRpcClient,
} from '../src/lib/trip/trips';

test('trip lifecycle helpers call only approved RPCs with safe args', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: TripRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: {
          id: 'trip-1',
          request_id: 'request-1',
          accepted_offer_id: 'offer-1',
          rider_user_id: 'rider-1',
          driver_user_id: 'driver-1',
          vehicle_id: 'vehicle-1',
          trip_status: 'en_route_pickup',
          pickup_address_text: 'Alabang',
          dropoff_address_text: 'Makati',
          service_type: 'standard',
          estimate_minor: 17000,
          currency: 'PHP',
          accepted_at: '2026-06-24T21:00:00Z',
          metadata: { hidden: true },
        } as TRow,
        error: null,
      };
    },
  };

  const riderResult = await getMyRiderTrips(client);
  const driverResult = await getMyDriverTrips(client);
  const transitionResult = await advanceMyDriverTrip(client, {
    tripId: 'trip-1',
    nextStatus: 'en_route_pickup',
    cancellationReason: '  ',
  });

  assert.deepEqual(calls, [
    { name: 'get_my_rider_trips', args: undefined },
    { name: 'get_my_driver_trips', args: undefined },
    {
      name: 'advance_my_driver_trip',
      args: { p_trip_id: 'trip-1', p_next_status: 'en_route_pickup', p_cancellation_reason: null },
    },
  ]);
  assert.equal(riderResult.ok, true);
  assert.equal(driverResult.ok, true);
  assert.equal(transitionResult.ok, true);
  if (transitionResult.ok) {
    assert.equal(transitionResult.data.trip_status, 'en_route_pickup');
    assert.equal('metadata' in transitionResult.data, false);
  }
});

test('trip lifecycle helpers map backend errors safely', async () => {
  const client = {
    async rpc<TRow>() {
      return { data: null as TRow | null, error: { message: 'internal trip.trips denied' } };
    },
  };

  const riderResult = await getMyRiderTrips(client);
  const driverResult = await getMyDriverTrips(client);
  const transitionResult = await advanceMyDriverTrip(client, {
    tripId: 'trip-1',
    nextStatus: 'cancelled',
    cancellationReason: 'rider no show',
  });

  assert.equal(riderResult.ok, false);
  assert.equal(driverResult.ok, false);
  assert.equal(transitionResult.ok, false);
  if (!riderResult.ok) assert.equal(riderResult.error.message.includes('trip.trips'), false);
  if (!driverResult.ok) assert.equal(driverResult.error.message.includes('trip.trips'), false);
  if (!transitionResult.ok) assert.equal(transitionResult.error.message.includes('trip.trips'), false);
});
