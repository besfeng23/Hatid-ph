import type { EditableBaseValues, EditableRiderValues, ProfileBundle } from './profile-service';
import type { HelperResult } from './result';
import type { ProfileRow, RiderProfileRow } from '../supabase/profile-schema.types';

export type ProfileCommandService = {
  readBundle(id: string): Promise<HelperResult<ProfileBundle>>;
  saveBase(id: string, values: EditableBaseValues): Promise<HelperResult<ProfileRow>>;
  saveRider(id: string, values: EditableRiderValues): Promise<HelperResult<RiderProfileRow>>;
};

export async function readProfileBundle(service: ProfileCommandService, id: string) {
  return service.readBundle(id);
}

export async function saveBaseProfile(service: ProfileCommandService, id: string, values: EditableBaseValues) {
  return service.saveBase(id, values);
}

export async function saveRiderProfile(service: ProfileCommandService, id: string, values: EditableRiderValues) {
  return service.saveRider(id, values);
}
