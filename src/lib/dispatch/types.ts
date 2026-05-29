export type DriverAvailabilityStatus =
  | 'offline'
  | 'online_requested'
  | 'available'
  | 'offered'
  | 'assigned'
  | 'on_trip'
  | 'suspended'
  | 'blocked_by_compliance';

export type DispatchOfferStatus =
  | 'created'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled'
  | 'failed';

export interface DriverLocationSnapshot {
  driverId: string;
  latitude: number;
  longitude: number;
  headingDegrees?: number;
  speedMetersPerSecond?: number;
  accuracyMeters?: number;
  capturedAt: string;
}

export interface DispatchCandidate {
  driverId: string;
  vehicleId: string;
  serviceType: string;
  distanceMeters: number;
  estimatedPickupSeconds?: number;
  score: number;
  location: DriverLocationSnapshot;
}

export interface DispatchOffer {
  id: string;
  tripId: string;
  driverId: string;
  vehicleId: string;
  status: DispatchOfferStatus;
  expiresAt: string;
  createdAt: string;
}

export interface DispatchLock {
  tripId: string;
  driverId: string;
  offerId: string;
  lockedAt: string;
}

export interface DriverAvailabilityGateResult {
  allowed: boolean;
  status: DriverAvailabilityStatus;
  reasons: string[];
}
