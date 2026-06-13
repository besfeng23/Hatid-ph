import type { HatidSupabaseClient } from '../supabase/server-client';

import { createProfileDataClient } from './profile-runtime-client';
import { createProfileService } from './profile-service';
import { createProfileStorageAdapter, type ProfileDataClient } from './profile-storage-adapter';

export function createProfileServiceFromClient(client: ProfileDataClient) {
  return createProfileService(createProfileStorageAdapter(client));
}

export function createProfileServiceFromSupabaseClient(client: HatidSupabaseClient) {
  return createProfileServiceFromClient(createProfileDataClient(client));
}
