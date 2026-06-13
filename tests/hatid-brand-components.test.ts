import assert from 'node:assert/strict';
import test from 'node:test';

import { HatidIconTile, HatidTrustPill, HatidWordmark } from '../src/components/hatid-brand';
import { getHatidIcon, hatidIcons } from '../src/components/hatid-icons';

test('Hatid brand components are exported as functions', () => {
  assert.equal(typeof HatidWordmark, 'function');
  assert.equal(typeof HatidTrustPill, 'function');
  assert.equal(typeof HatidIconTile, 'function');
});

test('Hatid icon registry exposes expected mobility icons', () => {
  assert.equal(typeof getHatidIcon('home'), 'function');
  assert.equal(typeof getHatidIcon('wallet'), 'function');
  assert.equal(typeof getHatidIcon('shield'), 'function');
  assert.equal(typeof getHatidIcon('car'), 'function');
  assert.ok(Object.keys(hatidIcons).length >= 20);
});
