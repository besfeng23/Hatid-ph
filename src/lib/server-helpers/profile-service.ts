import type {
  ProfileRow,
  RiderProfileInsert,
  RiderProfileRow,
  RiderProfileUpdate,
} from '../supabase/profile-schema.types';

import { fail, hasText, ok, pickDefined, type HelperResult } from './result';

export type ProfileBundle = {
  profile: ProfileRow;
  riderProfile: RiderProfileRow | null;
};

export type ProfileStorage = {
  readBundle(id: string): Promise<ProfileBundle | null>;
  saveBase(id: string, values: EditableBaseValues): Promise<ProfileRow>;
  createRider(id: string, values: Omit<RiderProfileInsert, 'user_id'>): Promise<RiderProfileRow>;
  saveRider(id: string, values: EditableRiderValues): Promise<RiderProfileRow>;
};

export type EditableBaseValues = {
  display_name?: string | null;
  photo_url?: string | null;
};

export type EditableRiderValues = Pick<
  RiderProfileUpdate,
  | 'first_name'
  | 'last_name'
  | 'preferred_language'
  | 'default_payment_preference'
  | 'emergency_contact_name'
  | 'emergency_contact_phone'
>;

export function createProfileService(storage: ProfileStorage) {
  return {
    async readBundle(id: string): Promise<HelperResult<ProfileBundle>> {
      if (!hasText(id)) {
        return fail('invalid_input', 'id is required.');
      }

      const bundle = await storage.readBundle(id);
      return bundle ? ok(bundle) : fail('not_found', 'bundle was not found.');
    },

    async saveBase(id: string, values: EditableBaseValues): Promise<HelperResult<ProfileRow>> {
      if (!hasText(id)) {
        return fail('invalid_input', 'id is required.');
      }

      return ok(await storage.saveBase(id, pickDefined(values)));
    },

    async createRider(id: string, values: Omit<RiderProfileInsert, 'user_id'>): Promise<HelperResult<RiderProfileRow>> {
      if (!hasText(id)) {
        return fail('invalid_input', 'id is required.');
      }

      return ok(await storage.createRider(id, pickDefined(values)));
    },

    async saveRider(id: string, values: EditableRiderValues): Promise<HelperResult<RiderProfileRow>> {
      if (!hasText(id)) {
        return fail('invalid_input', 'id is required.');
      }

      return ok(await storage.saveRider(id, pickDefined(values)));
    },
  };
}
