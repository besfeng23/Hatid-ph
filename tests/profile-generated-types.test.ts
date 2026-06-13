import assert from 'node:assert/strict';
import test from 'node:test';

import type { Tables, TablesInsert, TablesUpdate } from '../src/lib/supabase/database.types';
import type {
  ProfilePrimaryRole,
  ProfileStatus,
  RiderPaymentPreference,
} from '../src/lib/supabase/profile-schema.types';

function assertType<T>(value: T): T {
  return value;
}

test('generated profile table types align with the local profile contract unions', () => {
  const role = assertType<Tables<'profiles'>['primary_role']>('rider') as ProfilePrimaryRole;
  const status = assertType<Tables<'profiles'>['profile_status']>('incomplete') as ProfileStatus;
  const paymentPreference = assertType<Tables<'rider_profiles'>['default_payment_preference']>(
    'cash',
  ) as RiderPaymentPreference;

  assert.equal(role, 'rider');
  assert.equal(status, 'incomplete');
  assert.equal(paymentPreference, 'cash');
});

test('generated insert/update types expose profile table fields', () => {
  const profileInsert: TablesInsert<'profiles'> = {
    id: 'user-1',
    display_name: 'Joven',
  };

  const profileUpdate: TablesUpdate<'profiles'> = {
    display_name: 'Hatid Rider',
    photo_url: null,
  };

  const riderInsert: TablesInsert<'rider_profiles'> = {
    user_id: 'user-1',
    first_name: 'Joven',
    default_payment_preference: 'cash',
  };

  const riderUpdate: TablesUpdate<'rider_profiles'> = {
    first_name: 'Mark',
    emergency_contact_phone: null,
  };

  assert.equal(profileInsert.display_name, 'Joven');
  assert.equal(profileUpdate.display_name, 'Hatid Rider');
  assert.equal(riderInsert.default_payment_preference, 'cash');
  assert.equal(riderUpdate.first_name, 'Mark');
});
