import assert from 'node:assert/strict';
import test from 'node:test';

import { getMyDriverProfile, saveMyDriverProfile, type DriverProfileRpcClient } from '../src/lib/driver/profile';
import { getMyVehicles, saveMyVehicle, type DriverVehicleRpcClient } from '../src/lib/driver/vehicles';
import {
  getMyDriverDocuments,
  submitMyDriverDocument,
  type DriverDocumentRpcClient,
} from '../src/lib/driver/documents';

test('driver profile helpers call only approved RPCs with safe args', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: DriverProfileRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: { display_name: '  Juan  ', phone: '  0917  ', service_area_text: '  Alabang  ', status: 'draft' } as TRow,
        error: null,
      };
    },
  };

  const getResult = await getMyDriverProfile(client);
  const saveResult = await saveMyDriverProfile(client, {
    display_name: '  Juan  ',
    phone: '  0917  ',
    service_area_text: '  Alabang  ',
  });

  assert.deepEqual(calls, [
    { name: 'get_my_driver_profile', args: undefined },
    {
      name: 'upsert_my_driver_profile',
      args: { p_display_name: 'Juan', p_phone: '0917', p_service_area_text: 'Alabang' },
    },
  ]);
  assert.equal(getResult.ok, true);
  assert.equal(saveResult.ok, true);
});

test('driver vehicle helpers call only approved RPCs with safe args', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: DriverVehicleRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: {
          id: 'vehicle-1',
          plate_number: 'ABC123',
          vehicle_type: 'sedan',
          make: 'Toyota',
          model: 'Vios',
          color: 'White',
          year: 2020,
          capacity: 4,
          status: 'draft',
          metadata: { hidden: true },
        } as TRow,
        error: null,
      };
    },
  };

  const getResult = await getMyVehicles(client);
  const saveResult = await saveMyVehicle(client, {
    id: 'vehicle-1',
    plate_number: ' ABC123 ',
    vehicle_type: 'sedan',
    make: ' Toyota ',
    model: ' Vios ',
    color: ' White ',
    year: 2020,
    capacity: 4,
  });

  assert.equal(calls[0].name, 'get_my_vehicles');
  assert.equal(calls[1].name, 'upsert_my_vehicle');
  assert.equal(calls[1].args?.p_plate_number, 'ABC123');
  assert.equal(getResult.ok, true);
  assert.equal(saveResult.ok, true);
  if (saveResult.ok) assert.equal('metadata' in saveResult.data, false);
});

test('driver document helpers call only approved RPCs and hide metadata', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: DriverDocumentRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: {
          id: 'doc-1',
          vehicle_id: 'vehicle-1',
          document_type: 'drivers_license',
          storage_path: 'driver/u/doc.jpg',
          file_name: 'doc.jpg',
          mime_type: 'image/jpeg',
          status: 'submitted',
          metadata: { hidden: true },
        } as TRow,
        error: null,
      };
    },
  };

  const getResult = await getMyDriverDocuments(client);
  const submitResult = await submitMyDriverDocument(client, {
    vehicle_id: 'vehicle-1',
    document_type: 'drivers_license',
    storage_path: ' driver/u/doc.jpg ',
    file_name: ' doc.jpg ',
    mime_type: ' image/jpeg ',
  });

  assert.equal(calls[0].name, 'get_my_driver_documents');
  assert.equal(calls[1].name, 'submit_my_driver_document');
  assert.equal(calls[1].args?.p_storage_path, 'driver/u/doc.jpg');
  assert.equal(getResult.ok, true);
  assert.equal(submitResult.ok, true);
  if (submitResult.ok) assert.equal('metadata' in submitResult.data, false);
});
