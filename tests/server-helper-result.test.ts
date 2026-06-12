import assert from 'node:assert/strict';
import test from 'node:test';

import {
  fail,
  hasText,
  normalizeText,
  ok,
  pickDefined,
  requireText,
} from '../src/lib/server-helpers/result';

test('ok wraps data in a successful result', () => {
  const result = ok({ value: 'demo' });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.data, { value: 'demo' });
  }
});

test('fail wraps code and message in an error result', () => {
  const result = fail('not_found', 'Missing value.');

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error.code, 'not_found');
    assert.equal(result.error.message, 'Missing value.');
  }
});

test('hasText rejects empty and whitespace-only values', () => {
  assert.equal(hasText(''), false);
  assert.equal(hasText('   '), false);
  assert.equal(hasText('demo'), true);
});

test('normalizeText trims non-empty strings and returns null for empty input', () => {
  assert.equal(normalizeText(undefined), null);
  assert.equal(normalizeText(null), null);
  assert.equal(normalizeText('   '), null);
  assert.equal(normalizeText('  demo  '), 'demo');
});

test('requireText validates and normalizes required strings', () => {
  const missing = requireText('   ', 'sample');
  assert.equal(missing.ok, false);
  if (!missing.ok) {
    assert.equal(missing.error.code, 'invalid_input');
    assert.equal(missing.error.message, 'sample is required.');
  }

  const present = requireText('  demo  ', 'sample');
  assert.equal(present.ok, true);
  if (present.ok) {
    assert.equal(present.data, 'demo');
  }
});

test('pickDefined removes undefined values and keeps null values', () => {
  assert.deepEqual(
    pickDefined({ one: 'a', two: undefined, three: null }),
    { one: 'a', three: null },
  );
});
