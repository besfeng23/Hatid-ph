import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Sprint 0B placeholder.
 *
 * This does not refresh Supabase sessions yet. It keeps the future middleware
 * boundary explicit without changing routing or auth behavior.
 */
export function updateSupabaseSessionBoundary(request: NextRequest) {
  return NextResponse.next({
    request,
  });
}
