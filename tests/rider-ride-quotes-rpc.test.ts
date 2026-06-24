import assert from 'node:assert/strict';
import test from 'node:test';

import { getMyRideQuotes, type RideQuoteRpcClient } from '../src/lib/rider/ride-quotes';

test('getMyRideQuotes calls read RPC', async () => {
  const calls: string[] = [];
  const client: RideQuoteRpcClient = {
    async rpc<TRow>(name: string) {
      calls.push(name);
      return { data: [] as TRow[], error: null };
    },
  };

  const result = await getMyRideQuotes(client);

  assert.deepEqual(calls, ['get_my_ride_quotes']);
  assert.equal(result.ok, true);
});
