import type { HatidSupabaseClient } from '../supabase/server-client';

import type { ProfileDataClient } from './profile-storage-adapter';

export function createProfileDataClient(client: HatidSupabaseClient): ProfileDataClient {
  return {
    from: client.from.bind(client) as ProfileDataClient['from'],
  };
}
