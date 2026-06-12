import assert from 'node:assert/strict';
import test from 'node:test';

import { createProfileService, type ProfileStorage } from '../src/lib/server-helpers/profile-service';
import type { ProfileRow, RiderProfileRow } from '../src/lib/supabase/profile-schema.types';

const baseProfile: ProfileRow = {
  id: 'demo-id',
  email: null,
  phone: null,
  display_name: 'Demo',
  photo_url: null,
  primary_role: 'rider',
  profile_status: 'incomplete',
  onboarding_completed_at: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

const baseRider: RiderProfileRow = {
  user_id: 'demo-id',
  first_name: 'Demo',
  last_name: null,
  birthdate: null,
  preferred_language: 'en-PH',
  default_payment_preference: 'cash',
  emergency_contact_name: null,
  emergency_contact_phone: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

function createStore(overrides: Partial<ProfileStorage> = {}): ProfileStorage {
  return {
    async readBundle() {
      return { profile: baseProfile, riderProfile: baseRider };
    },
    async saveBase(_id, values) {
      return { ...baseProfile, ...values };
    },
    async createRider(id, values) {
      return { ...baseRider, user_id: id, ...values };
    },
    async saveRider(_id, values) {
      return { ...baseRider, ...values };
    },
    ...overrides,
  };
}

test('readBundle rejects empty ids before storage access', async () => {
  let called = false;
  const service = createProfileService(
    createStore({
      async readBundle() {
        called = true;
        return null;
      },
    }),
  );

  const result = await service.readBundle('   ');

  assert.equal(result.ok, false);
  assert.equal(called, false);
  if (!result.ok) {
    assert.equal(result.error.code, 'invalid_input');
  }
});

test('readBundle returns not_found when storage has no row', async () => {
  const service = createProfileService(
    createStore({
      async readBundle() {
        return null;
      },
    }),
  );

  const result = await service.readBundle('demo-id');

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error.code, 'not_found');
  }
});

test('saveBase removes undefined values and preserves null updates', async () => {
  let saved: unknown;
  const service = createProfileService(
    createStore({
      async saveBase(_id, values) {
        saved = values;
        return { ...baseProfile, ...values };
      },
    }),
  );

  const result = await service.saveBase('demo-id', {
    display_name: undefined,
    photo_url: null,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(saved, { photo_url: null });
});

test('saveRider delegates editable rider values', async () => {
  const service = createProfileService(createStore());
  const result = await service.saveRider('demo-id', { preferred_language: 'fil-PH' });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.preferred_language, 'fil-PH');
  }
});
