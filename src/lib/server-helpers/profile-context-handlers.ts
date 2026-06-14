import type { ProfileRow, RiderProfileRow } from '../supabase/profile-schema.types';

import {
  readProfileBundle,
  saveBaseProfile,
  saveRiderProfile,
} from './profile-command-helpers';
import type { ProfileAuthContext } from './profile-auth-context';
import type {
  EditableBaseValues,
  EditableRiderValues,
  ProfileBundle,
} from './profile-service';
import type { HelperResult } from './result';

export function readProfileBundleForContext(
  context: ProfileAuthContext,
): Promise<HelperResult<ProfileBundle>> {
  return readProfileBundle(context.service, context.userId);
}

export function saveBaseProfileForContext(
  context: ProfileAuthContext,
  values: EditableBaseValues,
): Promise<HelperResult<ProfileRow>> {
  return saveBaseProfile(context.service, context.userId, values);
}

export function saveRiderProfileForContext(
  context: ProfileAuthContext,
  values: EditableRiderValues,
): Promise<HelperResult<RiderProfileRow>> {
  return saveRiderProfile(context.service, context.userId, values);
}
