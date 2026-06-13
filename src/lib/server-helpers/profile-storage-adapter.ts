import type { Tables, TablesInsert } from '../supabase/database.types';
import type {
  ProfilePrimaryRole,
  ProfileRow,
  ProfileStatus,
  RiderPaymentPreference,
  RiderProfileInsert,
  RiderProfileRow,
} from '../supabase/profile-schema.types';

import type {
  EditableBaseValues,
  EditableRiderValues,
  ProfileBundle,
  ProfileStorage,
} from './profile-service';

type GeneratedProfileRow = Tables<'profiles'>;
type GeneratedRiderProfileRow = Tables<'rider_profiles'>;
type GeneratedRiderProfileInsert = TablesInsert<'rider_profiles'>;

export type QueryResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

export type QueryBuilder<T> = {
  select(columns?: string): QueryBuilder<T>;
  eq(column: string, value: string): QueryBuilder<T>;
  update(values: Record<string, unknown>): QueryBuilder<T>;
  insert(values: Record<string, unknown>): QueryBuilder<T>;
  upsert(values: Record<string, unknown>): QueryBuilder<T>;
  maybeSingle(): Promise<QueryResult<T>>;
  single(): Promise<QueryResult<T>>;
};

export type ProfileDataClient = {
  from(table: 'profiles'): QueryBuilder<GeneratedProfileRow>;
  from(table: 'rider_profiles'): QueryBuilder<GeneratedRiderProfileRow>;
};

function assertNoError<T>(result: QueryResult<T>): T | null {
  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

function assertProfilePrimaryRole(value: string): ProfilePrimaryRole {
  if (value === 'rider' || value === 'admin' || value === 'operator' || value === 'support') {
    return value;
  }

  throw new Error(`Unexpected profile primary_role: ${value}`);
}

function assertProfileStatus(value: string): ProfileStatus {
  if (
    value === 'incomplete' ||
    value === 'complete' ||
    value === 'suspended' ||
    value === 'deleted'
  ) {
    return value;
  }

  throw new Error(`Unexpected profile_status: ${value}`);
}

function assertRiderPaymentPreference(value: string | null): RiderPaymentPreference | null {
  if (value === null) {
    return null;
  }

  if (value === 'cash' || value === 'card_placeholder' || value === 'wallet_placeholder') {
    return value;
  }

  throw new Error(`Unexpected rider default_payment_preference: ${value}`);
}

function normalizeProfileRow(row: GeneratedProfileRow): ProfileRow {
  return {
    ...row,
    primary_role: assertProfilePrimaryRole(row.primary_role),
    profile_status: assertProfileStatus(row.profile_status),
  };
}

function normalizeRiderProfileRow(row: GeneratedRiderProfileRow): RiderProfileRow {
  return {
    ...row,
    default_payment_preference: assertRiderPaymentPreference(row.default_payment_preference),
  };
}

function toGeneratedRiderInsert(values: Omit<RiderProfileInsert, 'user_id'>): Omit<GeneratedRiderProfileInsert, 'user_id'> {
  return values;
}

export function createProfileStorageAdapter(client: ProfileDataClient): ProfileStorage {
  return {
    async readBundle(id: string): Promise<ProfileBundle | null> {
      const profile = assertNoError(
        await client.from('profiles').select('*').eq('id', id).maybeSingle(),
      );

      if (!profile) {
        return null;
      }

      const riderProfile = assertNoError(
        await client.from('rider_profiles').select('*').eq('user_id', id).maybeSingle(),
      );

      return {
        profile: normalizeProfileRow(profile),
        riderProfile: riderProfile ? normalizeRiderProfileRow(riderProfile) : null,
      };
    },

    async saveBase(id: string, values: EditableBaseValues): Promise<ProfileRow> {
      const profile = assertNoError(
        await client.from('profiles').update({ ...values }).eq('id', id).select('*').single(),
      );

      if (!profile) {
        throw new Error('Profile update returned no row.');
      }

      return normalizeProfileRow(profile);
    },

    async createRider(
      id: string,
      values: Omit<RiderProfileInsert, 'user_id'>,
    ): Promise<RiderProfileRow> {
      const riderProfile = assertNoError(
        await client
          .from('rider_profiles')
          .insert({ ...toGeneratedRiderInsert(values), user_id: id })
          .select('*')
          .single(),
      );

      if (!riderProfile) {
        throw new Error('Rider profile insert returned no row.');
      }

      return normalizeRiderProfileRow(riderProfile);
    },

    async saveRider(id: string, values: EditableRiderValues): Promise<RiderProfileRow> {
      const riderProfile = assertNoError(
        await client
          .from('rider_profiles')
          .update({ ...values })
          .eq('user_id', id)
          .select('*')
          .single(),
      );

      if (!riderProfile) {
        throw new Error('Rider profile update returned no row.');
      }

      return normalizeRiderProfileRow(riderProfile);
    },
  };
}
