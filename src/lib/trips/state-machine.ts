import { TERMINAL_TRIP_STATUSES, TripStatus } from './types';

const ALLOWED_TRIP_STATUS_TRANSITIONS: Record<TripStatus, readonly TripStatus[]> = {
  draft: ['quoted', 'expired', 'cancelled_by_rider'],
  quoted: ['searching', 'expired', 'cancelled_by_rider'],
  searching: ['matched', 'expired', 'cancelled_by_rider'],
  matched: ['driver_assigned', 'expired', 'cancelled_by_rider'],
  driver_assigned: [
    'driver_arriving',
    'cancelled_by_rider',
    'cancelled_by_driver',
    'expired',
  ],
  driver_arriving: [
    'arrived',
    'cancelled_by_rider',
    'cancelled_by_driver',
    'disputed',
  ],
  arrived: [
    'in_progress',
    'no_show',
    'cancelled_by_rider',
    'cancelled_by_driver',
    'disputed',
  ],
  in_progress: ['completed', 'disputed'],
  completed: ['disputed', 'refunded'],
  cancelled_by_rider: ['disputed', 'refunded'],
  cancelled_by_driver: ['disputed', 'refunded'],
  no_show: ['disputed', 'refunded'],
  expired: [],
  disputed: ['refunded'],
  refunded: [],
};

export class InvalidTripStatusTransitionError extends Error {
  constructor(from: TripStatus, to: TripStatus) {
    super(`Invalid trip status transition: ${from} -> ${to}`);
    this.name = 'InvalidTripStatusTransitionError';
  }
}

export function getAllowedTripStatusTransitions(
  status: TripStatus
): readonly TripStatus[] {
  return ALLOWED_TRIP_STATUS_TRANSITIONS[status];
}

export function canTransitionTripStatus(
  from: TripStatus,
  to: TripStatus
): boolean {
  return ALLOWED_TRIP_STATUS_TRANSITIONS[from].includes(to);
}

export function assertTripStatusTransition(
  from: TripStatus,
  to: TripStatus
): void {
  if (!canTransitionTripStatus(from, to)) {
    throw new InvalidTripStatusTransitionError(from, to);
  }
}

export function isTerminalTripStatus(status: TripStatus): boolean {
  return TERMINAL_TRIP_STATUSES.includes(status);
}
