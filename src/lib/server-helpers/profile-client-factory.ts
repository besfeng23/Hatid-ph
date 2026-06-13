import { createProfileService } from './profile-service';
import { createProfileStorageAdapter, type ProfileDataClient } from './profile-storage-adapter';

export function createProfileServiceFromClient(client: ProfileDataClient) {
  return createProfileService(createProfileStorageAdapter(client));
}
