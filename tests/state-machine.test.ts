import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertTripStatusTransition,
  canTransitionTripStatus,
  getAllowedTripStatusTransitions,
  isTerminalTripStatus,
} from '../src/lib/trips/state-machine';

test('valid trip status transitions are allowed', () => {
  assert.equal(canTransitionTripStatus('draft', 'quoted'), true);
  assert.equal(canTransitionTripStatus('quoted', 'searching'), true);
  assert.equal(canTransitionTripStatus('searching', 'matched'), true);
  assert.equal(canTransitionTripStatus('matched', 'driver_assigned'), true);
  assert.equal(canTransitionTripStatus('driver_assigned', 'driver_arriving'), true);
  assert.equal(canTransitionTripStatus('arrived', 'in_progress'), true);
  assert.equal(canTransitionTripStatus('in_progress', 'completed'), true);
});

test('invalid trip status transitions are rejected', () => {
  assert.equal(canTransitionTripStatus('searching', 'completed'), false);
  assert.equal(canTransitionTripStatus('draft', 'completed'), false);
  assert.throws(() => assertTripStatusTransition('searching', 'completed'));
  assert.throws(() => assertTripStatusTransition('draft', 'completed'));
});

test('terminal trip status helper identifies terminal and non-terminal statuses', () => {
  assert.equal(isTerminalTripStatus('expired'), true);
  assert.equal(isTerminalTripStatus('refunded'), true);
  assert.equal(isTerminalTripStatus('completed'), false);
});

test('allowed transition helper returns expected values', () => {
  assert.deepEqual(getAllowedTripStatusTransitions('quoted'), [
    'searching',
    'expired',
    'cancelled_by_rider',
  ]);

  assert.deepEqual(getAllowedTripStatusTransitions('completed'), [
    'disputed',
    'refunded',
  ]);
});
