import type {
  ProfileRow,
  RiderProfileInsert,
  RiderProfileRow,
} from '../supabase/profile-schema.types';

import type {
  EditableBaseValues,
  EditableRiderValues,
  ProfileBundle,
  ProfileStorage,
} from './profile-service';

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
  from(table: 'profiles'): QueryBuilder<ProfileRow>;
  from(table: 'rider_profiles'): QueryBuilder<RiderProfileRow>;
};

function assertNoError<T>(result: QueryResult<T>): T | null {
  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
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

      return { profile, riderProfile };
    },

    async saveBase(id: string, values: EditableBaseValues): Promise<ProfileRow> {
      const profile = assertNoError(
        await client.from('profiles').update(values).eq('id', id).select('*').single(),
      );

      if (!profile) {
        throw new Error('Profile update returned no row.');
      }

      return profile;
    },

    async createRider(
      id: string,
      values: Omit<RiderProfileInsert, 'user_id'>,
    ): Promise<RiderProfileRow> {
      const riderProfile = assertNoError(
        await client
          .from('rider_profiles')
          .insert({ ...values, user_id: id })
          .select('*')
          .single(),
      );

      if (!riderProfile) {
        throw new Error('Rider profile insert returned no row.');
      }

      return riderProfile;
    },

    async saveRider(id: string, values: EditableRiderValues): Promise<RiderProfileRow> {
      const riderProfile = assertNoError(
        await client
          .from('rider_profiles')
          .update(values)
          .eq('user_id', id)
          .select('*')
          .single(),
      );

      if (!riderProfile) {
        throw new Error('Rider profile update returned no row.');
      }

      return riderProfile;
    },
  };
}
