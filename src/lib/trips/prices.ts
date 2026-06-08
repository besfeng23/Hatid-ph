
import type { RouteEstimate } from '../maps/types';

export type ServiceLevel = 'economy' | 'premium' | 'moto' | 'delivery';

export type Fare = {
  serviceLevel: ServiceLevel;
  baseFare: number;
  distanceRate: number; // per km
  timeRate: number; // per minute
  surgeMultiplier: number;
  currency: 'PHP';
};

export type FareEstimate = {
  fare: Fare;
  route: RouteEstimate;
  total: number;
};

export const serviceLevelFares: Record<ServiceLevel, Fare> = {
  economy: {
    serviceLevel: 'economy',
    baseFare: 50,
    distanceRate: 15,
    timeRate: 2,
    surgeMultiplier: 1,
    currency: 'PHP',
  },
  premium: {
    serviceLevel: 'premium',
    baseFare: 100,
    distanceRate: 20,
    timeRate: 3,
    surgeMultiplier: 1,
    currency: 'PHP',
  },
  moto: {
    serviceLevel: 'moto',
    baseFare: 30,
    distanceRate: 10,
    timeRate: 1,
    surgeMultiplier: 1,
    currency: 'PHP',
  },
  delivery: {
    serviceLevel: 'delivery',
    baseFare: 40,
    distanceRate: 12,
    timeRate: 1.5,
    surgeMultiplier: 1,
    currency: 'PHP',
  },
};

export function calculateFare(fare: Fare, route: RouteEstimate): FareEstimate {
  const distanceCost = route.distanceKm * fare.distanceRate;
  const timeCost = route.durationMinutes * fare.timeRate;
  const subtotal = fare.baseFare + distanceCost + timeCost;
  const total = subtotal * fare.surgeMultiplier;

  return {
    fare,
    route,
    total,
  };
}
