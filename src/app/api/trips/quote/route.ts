
import { NextResponse } from 'next/server';
import { providers } from '@/lib/maps';
import type { RouteEstimateRequest } from '@/lib/maps/types';
import { calculateFare, serviceLevelFares } from '@/lib/trips/prices';

export async function POST(request: Request) {
  const body = (await request.json()) as RouteEstimateRequest;

  // For now, we'll use the demo provider.
  const maps = providers.demo;

  try {
    const route = await maps.estimateRoute(body);

    const estimates = Object.values(serviceLevelFares).map((fare) => {
      return calculateFare(fare, route);
    });

    return NextResponse.json({ estimates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
