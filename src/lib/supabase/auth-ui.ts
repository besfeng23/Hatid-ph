import type { User } from '@supabase/supabase-js';

import type { HatidUser } from '@/platform/provider';

const DEFAULT_AUTHENTICATED_PATH = '/rider/search';

function optionalString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

export function mapSupabaseUser(user: User | null): HatidUser | null {
  if (!user) {
    return null;
  }

  const displayName =
    optionalString(user.user_metadata?.display_name) ??
    optionalString(user.user_metadata?.full_name) ??
    optionalString(user.user_metadata?.name);
  const photoURL =
    optionalString(user.user_metadata?.avatar_url) ??
    optionalString(user.user_metadata?.picture);

  return {
    id: user.id,
    uid: user.id,
    email: optionalString(user.email),
    phone: optionalString(user.phone),
    phoneNumber: optionalString(user.phone),
    name: displayName,
    displayName,
    photoURL,
  };
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export function getSafeReturnPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  if (
    value === '/login' ||
    value.startsWith('/login?') ||
    value === '/signup' ||
    value.startsWith('/signup?')
  ) {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  return value;
}
