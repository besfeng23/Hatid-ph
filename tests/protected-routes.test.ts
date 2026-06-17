import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildLoginRedirectUrl,
  buildSafeReturnTo,
  isProtectedPath,
} from '../src/lib/auth/protected-routes';

test('protected route prefixes match exact paths and nested paths', () => {
  for (const path of [
    '/rider',
    '/rider/search',
    '/profile',
    '/trips/history',
    '/wallet',
    '/safety/report',
    '/account',
    '/notifications',
    '/payment-methods',
    '/driver/dashboard',
    '/admin/users',
  ]) {
    assert.equal(isProtectedPath(path), true, `${path} should be protected`);
  }
});

test('public and similarly named routes remain public', () => {
  for (const path of [
    '/',
    '/login',
    '/signup',
    '/_next/static/chunk.js',
    '/_next/image',
    '/api/health',
    '/favicon.ico',
    '/icon.svg',
    '/images/hatid.png',
    '/riderish',
    '/administrator',
  ]) {
    assert.equal(isProtectedPath(path), false, `${path} should be public`);
  }
});

test('login redirect includes a safely encoded internal returnTo path and query', () => {
  const redirectUrl = buildLoginRedirectUrl('https://hatid.test/rider/search?pickup=a');

  assert.equal(
    redirectUrl.toString(),
    'https://hatid.test/login?returnTo=%2Frider%2Fsearch%3Fpickup%3Da',
  );
  assert.equal(redirectUrl.searchParams.get('returnTo'), '/rider/search?pickup=a');
});

test('external returnTo values are never accepted', () => {
  assert.equal(buildSafeReturnTo('https://evil.example/rider', '?pickup=a'), '/');
  assert.equal(buildSafeReturnTo('//evil.example/rider', '?pickup=a'), '/');
  assert.equal(buildSafeReturnTo('rider/search', '?pickup=a'), '/');
});

test('auth, root, Next internals, API, favicon, icon, and image assets stay public', () => {
  for (const path of [
    '/login',
    '/signup',
    '/',
    '/_next/static/app.js',
    '/_next/image',
    '/api/trips',
    '/favicon.ico',
    '/apple-icon.png',
    '/logo.webp',
  ]) {
    assert.equal(isProtectedPath(path), false, `${path} should remain public`);
    assert.equal(buildSafeReturnTo(path), '/');
  }
});
