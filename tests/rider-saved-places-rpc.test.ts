import assert from 'node:assert/strict';
import test from 'node:test';

import {
  deleteMySavedPlace,
  getMySavedPlaces,
  saveMySavedPlace,
  type SavedPlacesRpcClient,
} from '../src/lib/rider/saved-places';

test('getMySavedPlaces calls only approved read RPC and drops unsafe returned fields', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: SavedPlacesRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: [
          {
            id: 'place-1',
            user_id: 'not-exposed',
            label: '  Home  ',
            place_type: 'home',
            address_text: '  Quezon City  ',
            latitude: 14.5995,
            longitude: 120.9842,
            notes: '  Gate 2  ',
            metadata: { internal: true },
            admin_notes: 'hidden',
            created_at: '2026-06-19T00:00:00.000Z',
            updated_at: '2026-06-19T00:00:00.000Z',
          },
        ] as TRow[],
        error: null,
      };
    },
  };

  const result = await getMySavedPlaces(client);

  assert.deepEqual(calls, [{ name: 'get_my_saved_places', args: undefined }]);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.data[0], {
      id: 'place-1',
      label: 'Home',
      place_type: 'home',
      address_text: 'Quezon City',
      latitude: 14.5995,
      longitude: 120.9842,
      notes: 'Gate 2',
      created_at: '2026-06-19T00:00:00.000Z',
      updated_at: '2026-06-19T00:00:00.000Z',
    });
    assert.equal('user_id' in result.data[0], false);
    assert.equal('metadata' in result.data[0], false);
    assert.equal('admin_notes' in result.data[0], false);
  }
});

test('saveMySavedPlace calls only approved upsert RPC with safe args', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: SavedPlacesRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: {
          id: 'place-2',
          label: '  Work  ',
          place_type: 'work',
          address_text: '  Makati  ',
          latitude: 14.5547,
          longitude: 121.0244,
          notes: null,
          user_id: 'hidden',
          metadata: { hidden: true },
        } as TRow,
        error: null,
      };
    },
  };

  const result = await saveMySavedPlace(client, {
    id: 'place-2',
    label: '  Work  ',
    place_type: 'work',
    address_text: '  Makati  ',
    latitude: 14.5547,
    longitude: 121.0244,
    notes: '   ',
    user_id: 'malicious',
    metadata: { malicious: true },
  } as Parameters<typeof saveMySavedPlace>[1] & { user_id: string; metadata: object });

  assert.deepEqual(calls, [
    {
      name: 'upsert_my_saved_place',
      args: {
        p_place_id: 'place-2',
        p_label: 'Work',
        p_place_type: 'work',
        p_address_text: 'Makati',
        p_latitude: 14.5547,
        p_longitude: 121.0244,
        p_notes: null,
      },
    },
  ]);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal('user_id' in result.data, false);
    assert.equal('metadata' in result.data, false);
  }
});

test('deleteMySavedPlace passes only p_place_id to approved delete RPC', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: SavedPlacesRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return { data: true as TRow, error: null };
    },
  };

  const result = await deleteMySavedPlace(client, 'place-3');

  assert.deepEqual(calls, [{ name: 'delete_my_saved_place', args: { p_place_id: 'place-3' } }]);
  assert.deepEqual(result, { ok: true, data: { deleted: true } });
});

test('saved place helpers map backend errors safely and avoid direct table access', async () => {
  const client = {
    from() {
      throw new Error('direct table access must not be used');
    },
    async rpc<TRow>() {
      return { data: null as TRow | null, error: { message: 'internal rider.saved_places denied' } };
    },
  };

  const getResult = await getMySavedPlaces(client);
  const saveResult = await saveMySavedPlace(client, { label: 'Home', address_text: 'QC' });
  const deleteResult = await deleteMySavedPlace(client, 'place-4');

  assert.equal(getResult.ok, false);
  assert.equal(saveResult.ok, false);
  assert.equal(deleteResult.ok, false);
  if (!getResult.ok) assert.equal(getResult.error.message.includes('rider.saved_places'), false);
  if (!saveResult.ok) assert.equal(saveResult.error.message.includes('rider.saved_places'), false);
  if (!deleteResult.ok) assert.equal(deleteResult.error.message.includes('rider.saved_places'), false);
});
