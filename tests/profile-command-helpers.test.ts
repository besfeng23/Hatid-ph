import assert from 'node:assert/strict';
import test from 'node:test';

import {
  readProfileBundle,
  saveBaseProfile,
  saveRiderProfile,
  type ProfileCommandService,
} from '../src/lib/server-helpers/profile-command-helpers';
import { ok } from '../src/lib/server-helpers/result';

test('profile command helpers delegate to the supplied service', async () => {
  const calls: string[] = [];
  const service = {
    async readBundle(id: string) {
      calls.push(`read:${id}`);
      return ok({ profile: {} as never, riderProfile: null });
    },
    async saveBase(id: string) {
      calls.push(`base:${id}`);
      return ok({} as never);
    },
    async saveRider(id: string) {
      calls.push(`rider:${id}`);
      return ok({} as never);
    },
  } satisfies ProfileCommandService;

  await readProfileBundle(service, 'user-1');
  await saveBaseProfile(service, 'user-1', {});
  await saveRiderProfile(service, 'user-1', {});

  assert.deepEqual(calls, ['read:user-1', 'base:user-1', 'rider:user-1']);
});
