'use client';

/**
 * Firebase has been removed from the executable app while Hatid migrates to
 * Supabase. This compatibility component intentionally renders nothing until a
 * provider-neutral error boundary is introduced.
 */
export function FirebaseErrorListener() {
  return null;
}
