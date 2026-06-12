import assert from 'node:assert/strict';
import test from 'node:test';

import { fail, hasText, ok } from '../src/lib/server-helpers/result';

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
