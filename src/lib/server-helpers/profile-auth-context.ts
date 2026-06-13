import type { HatidSupabaseClient } from '../supabase/server-client';

import { createProfileDataClient } from './profile-runtime-client';
import { createProfileService } from './profile-service';
import { createProfileStorageAdapter } from './profile-storage-adapter';
import { fail, ok, type HelperResult } from './result';
import type { ProfileCommandService } from './profile-command-helpers';

export type ProfileAuthContext = {
  userId: string;
  service: ProfileCommandService;
};

export async function createProfileAuthContext(
  client: HatidSupabaseClient,
): Promise<HelperResult<ProfileAuthContext>> {
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    return fail('auth_required', 'Supabase user is required.');
  }

  return ok({
    userId: data.user.id,
    service: createProfileService(createProfileStorageAdapter(createProfileDataClient(client))),
  });
}
