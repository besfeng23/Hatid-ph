import assert from 'node:assert/strict';
import test from 'node:test';

import type { Tables, TablesInsert, TablesUpdate } from '../src/lib/supabase/database.types';

function assertType<T>(value: T): T {
  return value;
}

test('generated profile table types expose expected profile fields', () => {
  const profileRole = assertType<Tables<'profiles'>['primary_role']>('rider');
  const profileStatus = assertType<Tables<'profiles'>['profile_status']>('incomplete');
  const paymentPreference = assertType<Tables<'rider_profiles'>['default_payment_preference']>(
    'cash',
  );

  assert.equal(profileRole, 'rider');
  assert.equal(profileStatus, 'incomplete');
  assert.equal(paymentPreference, 'cash');
});

test('generated insert/update types expose profile table fields', () => {
  const profileInsert: TablesInsert<'profiles'> = {
    id: 'user-1',
    display_name: 'Sample User',
  };

  const profileUpdate: TablesUpdate<'profiles'> = {
    display_name: 'Updated User',
    photo_url: null,
  };

  const riderInsert: TablesInsert<'rider_profiles'> = {
    user_id: 'user-1',
    first_name: 'Sample',
    default_payment_preference: 'cash',
  };

  const riderUpdate: TablesUpdate<'rider_profiles'> = {
    first_name: 'Updated',
    emergency_contact_phone: null,
  };

  assert.equal(profileInsert.display_name, 'Sample User');
  assert.equal(profileUpdate.display_name, 'Updated User');
  assert.equal(riderInsert.default_payment_preference, 'cash');
  assert.equal(riderUpdate.first_name, 'Updated');
});
