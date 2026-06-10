import { demoDestination, demoPickup, type DemoPlace } from '@/lib/demo/location-suggestions';

export type PrototypeRideSelection = {
  pickup: string;
  destination: string;
  usedFallback: boolean;
};

type PrototypeRideSelectionInput = {
  pickup?: string | null;
  destination?: string | null;
};

const normalizePrototypeValue = (value: string | null | undefined): string => value?.trim().replace(/\s+/g, ' ') ?? '';

export const formatDemoPlaceLabel = (place: DemoPlace): string => `${place.name}, ${place.address}`;

export const buildRideOptionsHref = ({ pickup, destination }: PrototypeRideSelectionInput): string => {
  const selection = resolvePrototypeRideSelection({ pickup, destination });
  const params = new URLSearchParams({
    pickup: selection.pickup,
    destination: selection.destination,
  });

  return `/rider/ride-options?${params.toString()}`;
};

export const resolvePrototypeRideSelection = ({ pickup, destination }: PrototypeRideSelectionInput): PrototypeRideSelection => {
  const normalizedPickup = normalizePrototypeValue(pickup);
  const normalizedDestination = normalizePrototypeValue(destination);

  return {
    pickup: normalizedPickup || demoPickup,
    destination: normalizedDestination || demoDestination,
    usedFallback: normalizedPickup.length === 0 || normalizedDestination.length === 0,
  };
};
