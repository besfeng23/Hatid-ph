export type PublicHatidEnv = {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  mapsPublicKey: string | null;
};

export type ServerHatidEnv = PublicHatidEnv & {
  supabaseServiceRoleKey: string | null;
  databaseUrl: string | null;
  mapsServerKey: string | null;
};

function readEnv(name: string): string | null {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : null;
}

export function getPublicHatidEnv(): PublicHatidEnv {
  return {
    supabaseUrl: readEnv('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    mapsPublicKey: readEnv('NEXT_PUBLIC_MAPS_PUBLIC_KEY'),
  };
}

export function getServerHatidEnv(): ServerHatidEnv {
  return {
    ...getPublicHatidEnv(),
    supabaseServiceRoleKey: readEnv('SUPABASE_SERVICE_ROLE_KEY'),
    databaseUrl: readEnv('DATABASE_URL'),
    mapsServerKey: readEnv('MAPS_SERVER_KEY'),
  };
}

export function assertPublicSupabaseEnv(): { supabaseUrl: string; supabaseAnonKey: string } {
  const env = getPublicHatidEnv();

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('Missing Supabase public environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return {
    supabaseUrl: env.supabaseUrl,
    supabaseAnonKey: env.supabaseAnonKey,
  };
}

export function assertServerSupabaseEnv(): { supabaseUrl: string; supabaseServiceRoleKey: string } {
  const env = getServerHatidEnv();

  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error('Missing Supabase server environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  return {
    supabaseUrl: env.supabaseUrl,
    supabaseServiceRoleKey: env.supabaseServiceRoleKey,
  };
}
