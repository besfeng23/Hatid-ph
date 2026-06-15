import assert from 'node:assert/strict';
import test from 'node:test';
import type { User } from '@supabase/supabase-js';

import {
  getAuthErrorMessage,
  getSafeReturnPath,
  mapSupabaseUser,
} from '../src/lib/supabase/auth-ui';

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

test('maps a signed-in Supabase user into HatidUser without privileged metadata', () => {
  const user = mapSupabaseUser(
    createUser({
      email: 'maria@example.com',
      phone: '+639171234567',
      user_metadata: {
        display_name: 'Maria Santos',
        avatar_url: 'https://example.com/maria.png',
        primary_role: 'admin',
        profile_status: 'complete',
      },
    }),
  );

  assert.deepEqual(user, {
    id: 'user-1',
    uid: 'user-1',
    email: 'maria@example.com',
    phone: '+639171234567',
    phoneNumber: '+639171234567',
    name: 'Maria Santos',
    displayName: 'Maria Santos',
    photoURL: 'https://example.com/maria.png',
  });
  assert.equal('primary_role' in (user ?? {}), false);
  assert.equal('profile_status' in (user ?? {}), false);
});

test('maps signed-out Supabase state to null', () => {
  assert.equal(mapSupabaseUser(null), null);
});

test('auth error messages preserve Supabase errors and use an honest fallback', () => {
  assert.equal(
    getAuthErrorMessage(new Error('Invalid login credentials'), 'Login failed.'),
    'Invalid login credentials',
  );
  assert.equal(getAuthErrorMessage({ message: 'unsafe shape' }, 'Login failed.'), 'Login failed.');
});

test('return paths stay internal and cannot loop through auth routes', () => {
  assert.equal(getSafeReturnPath('/profile'), '/profile');
  assert.equal(getSafeReturnPath('https://example.com'), '/rider/search');
  assert.equal(getSafeReturnPath('//example.com'), '/rider/search');
  assert.equal(getSafeReturnPath('/login?returnTo=/login'), '/rider/search');
});
