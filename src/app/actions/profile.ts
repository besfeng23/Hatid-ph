'use server';

import {
  readProfileBundle,
  saveBaseProfile,
  saveRiderProfile,
  type ProfileCommandService,
} from '../../lib/server-helpers/profile-command-helpers';
import { createProfileDataClient } from '../../lib/server-helpers/profile-runtime-client';
import {
  createProfileService,
  type EditableBaseValues,
  type EditableRiderValues,
  type ProfileBundle,
} from '../../lib/server-helpers/profile-service';
import { createProfileStorageAdapter } from '../../lib/server-helpers/profile-storage-adapter';
import { fail, type HelperResult } from '../../lib/server-helpers/result';
import type { ProfileRow, RiderProfileRow } from '../../lib/supabase/profile-schema.types';
import { createSupabaseCookieServerClientFromEnv } from '../../lib/supabase/next-server-client';

type AuthenticatedProfileContext = {
  userId: string;
  service: ProfileCommandService;
};

async function getAuthenticatedProfileContext(): Promise<
  | { ok: true; context: AuthenticatedProfileContext }
  | { ok: false; result: HelperResult<never> }
> {
  const client = await createSupabaseCookieServerClientFromEnv(process.env);
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    return {
      ok: false,
      result: fail('auth_required', 'A signed-in Supabase user is required.'),
    };
  }

  return {
    ok: true,
    context: {
      userId: data.user.id,
      service: createProfileService(createProfileStorageAdapter(createProfileDataClient(client))),
    },
  };
}

async function withAuthenticatedProfile<T>(
  action: (context: AuthenticatedProfileContext) => Promise<HelperResult<T>>,
): Promise<HelperResult<T>> {
  try {
    const auth = await getAuthenticatedProfileContext();

    if (!auth.ok) {
      return auth.result;
    }

    return await action(auth.context);
  } catch (error) {
    return fail(
      'storage_error',
      error instanceof Error ? error.message : 'Unexpected profile action failure.',
    );
  }
}

export async function readMyProfileBundleAction(): Promise<HelperResult<ProfileBundle>> {
  return withAuthenticatedProfile(({ service, userId }) => readProfileBundle(service, userId));
}

export async function saveMyBaseProfileAction(
  values: EditableBaseValues,
): Promise<HelperResult<ProfileRow>> {
  return withAuthenticatedProfile(({ service, userId }) => saveBaseProfile(service, userId, values));
}

export async function saveMyRiderProfileAction(
  values: EditableRiderValues,
): Promise<HelperResult<RiderProfileRow>> {
  return withAuthenticatedProfile(({ service, userId }) => saveRiderProfile(service, userId, values));
}
