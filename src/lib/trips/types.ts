export type TripStatus =
  | 'draft'
  | 'quoted'
  | 'searching'
  | 'matched'
  | 'driver_assigned'
  | 'driver_arriving'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled_by_rider'
  | 'cancelled_by_driver'
  | 'no_show'
  | 'expired'
  | 'disputed'
  | 'refunded';

export interface TripActorContext {
  actorId: string;
  actorRole: 'rider' | 'driver' | 'dispatcher' | 'support' | 'system';
}

export interface TripTransitionRequest {
  from: TripStatus;
  to: TripStatus;
  actor: TripActorContext;
  reasonCode?: string;
}

export const TERMINAL_TRIP_STATUSES: readonly TripStatus[] = [
  'expired',
  'refunded',
] as const;
