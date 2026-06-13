import assert from 'node:assert/strict';
import test from 'node:test';

import { createProfileServiceFromClient } from '../src/lib/server-helpers/profile-client-factory';
import type { ProfileDataClient } from '../src/lib/server-helpers/profile-storage-adapter';

function createFakeClient(): ProfileDataClient {
  return {
    from() {
      throw new Error('query builder should not be created during factory construction');
    },
  };
}

test('createProfileServiceFromClient returns profile helper methods', () => {
  const service = createProfileServiceFromClient(createFakeClient());

  assert.equal(typeof service.readBundle, 'function');
  assert.equal(typeof service.saveBase, 'function');
  assert.equal(typeof service.createRider, 'function');
  assert.equal(typeof service.saveRider, 'function');
});
