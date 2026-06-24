import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getOpsDriverDocuments,
  getOpsDriverProfiles,
  getOpsRiderRequests,
  getOpsTripOffers,
  getOpsTrips,
  getOpsVehicles,
  type OpsRpcClient,
} from '../src/lib/ops/read-only';

test('ops read-only helpers call only read RPCs with clamped limits', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: OpsRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: [{
          id: 'id-1',
          user_id: 'user-1',
          quote_id: 'quote-1',
          request_id: 'request-1',
          accepted_offer_id: 'offer-1',
          rider_user_id: 'rider-1',
          driver_user_id: 'driver-1',
          vehicle_id: 'vehicle-1',
          pickup_address_text: 'Alabang',
          dropoff_address_text: 'Makati',
          service_type: 'standard',
          estimate_minor: 17000,
          currency: 'PHP',
          status: 'requested',
          offer_status: 'offered',
          trip_status: 'accepted',
          display_name: 'Juan',
          phone: '0917',
          service_area_text: 'Muntinlupa',
          plate_number: 'ABC123',
          vehicle_type: 'sedan',
          capacity: 4,
          document_type: 'drivers_license',
          storage_path: 'driver/doc.jpg',
          metadata: { hidden: true },
        }] as TRow,
        error: null,
      };
    },
  };

  const requestResult = await getOpsRiderRequests(client, 500);
  const offerResult = await getOpsTripOffers(client, 10);
  const tripResult = await getOpsTrips(client, 10);
  const profileResult = await getOpsDriverProfiles(client, 10);
  const vehicleResult = await getOpsVehicles(client, 10);
  const documentResult = await getOpsDriverDocuments(client, 10);

  assert.deepEqual(calls.map((call) => call.name), [
    'get_ops_rider_requests',
    'get_ops_trip_offers',
    'get_ops_trips',
    'get_ops_driver_profiles',
    'get_ops_vehicles',
    'get_ops_driver_documents',
  ]);
  assert.equal(calls[0].args?.p_limit, 100);
  assert.equal(requestResult.ok, true);
  assert.equal(offerResult.ok, true);
  assert.equal(tripResult.ok, true);
  assert.equal(profileResult.ok, true);
  assert.equal(vehicleResult.ok, true);
  assert.equal(documentResult.ok, true);
  if (requestResult.ok) assert.equal('metadata' in requestResult.data[0], false);
  if (tripResult.ok) assert.equal('metadata' in tripResult.data[0], false);
});

test('ops read-only helpers map backend errors safely', async () => {
  const client = {
    async rpc<TRow>() {
      return { data: null as TRow | null, error: { message: 'internal ops denied' } };
    },
  };

  const result = await getOpsTrips(client);

  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.message.includes('internal'), false);
});
