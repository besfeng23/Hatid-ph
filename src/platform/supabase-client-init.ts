export function tryCreateClient<Client>(
  createClient: () => Client,
): { client: Client; error: null } | { client: null; error: Error } {
  try {
    return { client: createClient(), error: null };
  } catch (error) {
    return {
      client: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
