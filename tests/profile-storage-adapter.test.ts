import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createProfileStorageAdapter,
  type ProfileDataClient,
  type QueryBuilder,
  type QueryResult,
} from '../src/lib/server-helpers/profile-storage-adapter';
import type { ProfileRow, RiderProfileRow } from '../src/lib/supabase/profile-schema.types';

const profileRow: ProfileRow = {
  id: 'demo-id',
  email: null,
  phone: null,
  display_name: 'Demo',
  photo_url: null,
  primary_role: 'rider',
  profile_status: 'incomplete',
  onboarding_completed_at: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

const riderRow: RiderProfileRow = {
  user_id: 'demo-id',
  first_name: 'Demo',
  last_name: null,
  birthdate: null,
  preferred_language: 'en-PH',
  default_payment_preference: 'cash',
  emergency_contact_name: null,
  emergency_contact_phone: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

type TableName = 'profiles' | 'rider_profiles';
type TableRow = ProfileRow | RiderProfileRow;

type QueryLogEntry = {
  table: TableName;
  operation: string;
  values?: Record<string, unknown>;
  filters: Array<{ column: string; value: string }>;
};

class FakeQueryBuilder<T extends TableRow> implements QueryBuilder<T> {
  private readonly filters: Array<{ column: string; value: string }> = [];
  private operation = 'select';
  private values: Record<string, unknown> | undefined;

  constructor(
    private readonly table: TableName,
    private readonly rows: Record<TableName, TableRow | null>,
    private readonly log: QueryLogEntry[],
    private readonly errorMessage?: string,
  ) {}

  select(): QueryBuilder<T> {
    return this;
  }

  eq(column: string, value: string): QueryBuilder<T> {
    this.filters.push({ column, value });
    return this;
  }

  update(values: Record<string, unknown>): QueryBuilder<T> {
    this.operation = 'update';
    this.values = values;
    return this;
  }

  insert(values: Record<string, unknown>): QueryBuilder<T> {
    this.operation = 'insert';
    this.values = values;
    return this;
  }

  upsert(values: Record<string, unknown>): QueryBuilder<T> {
    this.operation = 'upsert';
    this.values = values;
    return this;
  }

  async maybeSingle(): Promise<QueryResult<T>> {
    return this.finish();
  }

  async single(): Promise<QueryResult<T>> {
    return this.finish();
  }

  private finish(): QueryResult<T> {
    this.log.push({
      table: this.table,
      operation: this.operation,
      values: this.values,
      filters: [...this.filters],
    });

    if (this.errorMessage) {
      return { data: null, error: { message: this.errorMessage } };
    }

    const row = this.rows[this.table];
    if (!row) {
      return { data: null, error: null };
    }

    return {
      data: { ...row, ...this.values } as T,
      error: null,
    };
  }
}

function createClient(
  rows: Record<TableName, TableRow | null>,
  log: QueryLogEntry[],
  errorMessage?: string,
): ProfileDataClient {
  return {
    from(table: TableName) {
      return new FakeQueryBuilder(table, rows, log, errorMessage) as never;
    },
  };
}

test('readBundle returns profile and rider rows', async () => {
  const log: QueryLogEntry[] = [];
  const adapter = createProfileStorageAdapter(
    createClient({ profiles: profileRow, rider_profiles: riderRow }, log),
  );

  const bundle = await adapter.readBundle('demo-id');

  assert.deepEqual(bundle, { profile: profileRow, riderProfile: riderRow });
  assert.deepEqual(
    log.map((entry) => entry.table),
    ['profiles', 'rider_profiles'],
  );
});

test('readBundle returns null when the base row is missing', async () => {
  const log: QueryLogEntry[] = [];
  const adapter = createProfileStorageAdapter(
    createClient({ profiles: null, rider_profiles: riderRow }, log),
  );

  const bundle = await adapter.readBundle('demo-id');

  assert.equal(bundle, null);
  assert.deepEqual(
    log.map((entry) => entry.table),
    ['profiles'],
  );
});

test('saveBase updates only the base table by id', async () => {
  const log: QueryLogEntry[] = [];
  const adapter = createProfileStorageAdapter(
    createClient({ profiles: profileRow, rider_profiles: riderRow }, log),
  );

  const updated = await adapter.saveBase('demo-id', { display_name: 'Updated' });

  assert.equal(updated.display_name, 'Updated');
  assert.equal(log[0]?.table, 'profiles');
  assert.equal(log[0]?.operation, 'update');
  assert.deepEqual(log[0]?.filters, [{ column: 'id', value: 'demo-id' }]);
});

test('createRider injects owner id before insert', async () => {
  const log: QueryLogEntry[] = [];
  const adapter = createProfileStorageAdapter(
    createClient({ profiles: profileRow, rider_profiles: riderRow }, log),
  );

  const created = await adapter.createRider('demo-id', { first_name: 'Created' });

  assert.equal(created.user_id, 'demo-id');
  assert.equal(log[0]?.table, 'rider_profiles');
  assert.equal(log[0]?.operation, 'insert');
  assert.deepEqual(log[0]?.values, { first_name: 'Created', user_id: 'demo-id' });
});

test('adapter throws storage errors', async () => {
  const adapter = createProfileStorageAdapter(
    createClient({ profiles: profileRow, rider_profiles: riderRow }, [], 'storage failed'),
  );

  await assert.rejects(() => adapter.readBundle('demo-id'), /storage failed/);
});
