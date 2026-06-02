import { demoDestination, demoPickup, type DemoPlace } from '@/lib/demo/location-suggestions';

export type PrototypeRideSelection = {
  pickup: string;
  destination: string;
  usedFallback: boolean;
};

function normalizeText(value?: string | null) {
  return (value ?? '').trim().replace(/\s+/g, ' ');
}

export function formatDemoPlaceLabel(place: Pick<DemoPlace, 'name' | 'address'>) {
  return `${place.name}, ${place.address}`;
}

export function buildRideOptionsHref({
  pickup = demoPickup,
  destination,
}: {
  pickup?: string;
  destination: string;
}) {
  const params = new URLSearchParams({
    pickup: normalizeText(pickup) || demoPickup,
    destination: normalizeText(destination) || demoDestination,
  });

  return `/rider/ride-options?${params.toString()}`;
}

export function resolvePrototypeRideSelection({
  pickup,
  destination,
}: {
  pickup?: string | null;
  destination?: string | null;
}): PrototypeRideSelection {
  const normalizedPickup = normalizeText(pickup);
  const normalizedDestination = normalizeText(destination);

  return {
    pickup: normalizedPickup || demoPickup,
    destination: normalizedDestination || demoDestination,
    usedFallback: !normalizedPickup || !normalizedDestination,
  };
}
