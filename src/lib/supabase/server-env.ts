export type SupabasePublicEnv = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
};

export type SupabaseServiceEnv = SupabasePublicEnv & {
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export type SupabaseServiceConfig = SupabasePublicConfig & {
  serviceRoleKey: string;
};

function requireEnvValue(env: Record<string, string | undefined>, key: string): string {
  const value = env[key];

  if (!value || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

export function assertServerOnly(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Supabase service credentials must not be used in the browser.');
  }
}

export function readSupabasePublicConfig(env: SupabasePublicEnv): SupabasePublicConfig {
  return {
    url: requireEnvValue(env, 'NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: requireEnvValue(env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  };
}

export function readSupabaseServiceConfig(env: SupabaseServiceEnv): SupabaseServiceConfig {
  assertServerOnly();

  return {
    ...readSupabasePublicConfig(env),
    serviceRoleKey: requireEnvValue(env, 'SUPABASE_SERVICE_ROLE_KEY'),
  };
}
