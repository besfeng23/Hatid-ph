import type { HatidSupabaseClient } from '../supabase/server-client';

import type { ProfileDataClient } from './profile-storage-adapter';

export function createProfileDataClient(client: HatidSupabaseClient): ProfileDataClient {
  const from = client.from.bind(client) as unknown as ProfileDataClient['from'];

  return { from };
}
