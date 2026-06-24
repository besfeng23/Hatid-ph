import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getMyDriverAvailability,
  setMyDriverOffDuty,
  setMyDriverOnline,
  updateMyDriverLocationPing,
  type DriverAvailabilityRpcClient,
} from '../src/lib/driver/availability';

test('driver availability helpers call only approved RPCs with safe args', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: DriverAvailabilityRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: {
          user_id: 'hidden-user',
          vehicle_id: 'vehicle-1',
          availability_status: 'online',
          latitude: 14.4201,
          longitude: 121.0389,
          heading_degrees: 90,
          accuracy_meters: 8,
          last_heartbeat_at: '2026-06-24T20:00:00Z',
          heartbeat_expires_at: '2026-06-24T20:02:00Z',
          metadata: { hidden: true },
        } as TRow,
        error: null,
      };
    },
  };

  const getResult = await getMyDriverAvailability(client);
  const onlineResult = await setMyDriverOnline(client, 'vehicle-1');
  const pingResult = await updateMyDriverLocationPing(client, {
    latitude: 14.4201,
    longitude: 121.0389,
    heading_degrees: 90,
    accuracy_meters: 8,
  });
  const offDutyResult = await setMyDriverOffDuty(client);

  assert.deepEqual(calls, [
    { name: 'get_my_driver_availability', args: undefined },
    { name: 'set_my_driver_online', args: { p_vehicle_id: 'vehicle-1' } },
    {
      name: 'update_my_driver_location_ping',
      args: {
        p_latitude: 14.4201,
        p_longitude: 121.0389,
        p_heading_degrees: 90,
        p_accuracy_meters: 8,
      },
    },
    { name: 'set_my_driver_off_duty', args: undefined },
  ]);
  assert.equal(getResult.ok, true);
  assert.equal(onlineResult.ok, true);
  assert.equal(pingResult.ok, true);
  assert.equal(offDutyResult.ok, true);
  if (pingResult.ok && pingResult.data) {
    assert.equal(pingResult.data.latitude, 14.4201);
    assert.equal(pingResult.data.longitude, 121.0389);
    assert.equal('metadata' in pingResult.data, false);
  }
});

test('driver availability helpers map backend errors safely', async () => {
  const client = {
    async rpc<TRow>() {
      return { data: null as TRow | null, error: { message: 'internal driver.driver_availability denied' } };
    },
  };

  const getResult = await getMyDriverAvailability(client);
  const onlineResult = await setMyDriverOnline(client, 'vehicle-1');
  const pingResult = await updateMyDriverLocationPing(client, { latitude: 14, longitude: 121 });
  const offDutyResult = await setMyDriverOffDuty(client);

  assert.equal(getResult.ok, false);
  assert.equal(onlineResult.ok, false);
  assert.equal(pingResult.ok, false);
  assert.equal(offDutyResult.ok, false);
  if (!getResult.ok) assert.equal(getResult.error.message.includes('driver.driver_availability'), false);
  if (!onlineResult.ok) assert.equal(onlineResult.error.message.includes('driver.driver_availability'), false);
  if (!pingResult.ok) assert.equal(pingResult.error.message.includes('driver.driver_availability'), false);
  if (!offDutyResult.ok) assert.equal(offDutyResult.error.message.includes('driver.driver_availability'), false);
});
