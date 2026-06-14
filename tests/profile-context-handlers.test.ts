import assert from 'node:assert/strict';
import test from 'node:test';

import type { ProfileAuthContext } from '../src/lib/server-helpers/profile-auth-context';
import type { ProfileCommandService } from '../src/lib/server-helpers/profile-command-helpers';
import {
  readProfileBundleForContext,
  saveBaseProfileForContext,
  saveRiderProfileForContext,
} from '../src/lib/server-helpers/profile-context-handlers';
import { ok } from '../src/lib/server-helpers/result';

function createContext(calls: string[]): ProfileAuthContext {
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

  return { userId: 'user-1', service };
}

test('profile context handlers delegate using authenticated context user id', async () => {
  const calls: string[] = [];
  const context = createContext(calls);

  await readProfileBundleForContext(context);
  await saveBaseProfileForContext(context, { display_name: 'Maria' });
  await saveRiderProfileForContext(context, { first_name: 'Maria' });

  assert.deepEqual(calls, ['read:user-1', 'base:user-1', 'rider:user-1']);
});
