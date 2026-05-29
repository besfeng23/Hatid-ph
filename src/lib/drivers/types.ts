export type DriverStatus =
  | 'applicant'
  | 'pending_documents'
  | 'under_review'
  | 'approved'
  | 'restricted'
  | 'expired_documents'
  | 'deactivated';

export type DriverVerificationStatus =
  | 'not_started'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_more_information'
  | 'expired';

export type DriverDocumentStatus =
  | 'missing'
  | 'uploaded'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'expired';

export type VehicleStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'restricted'
  | 'expired'
  | 'deactivated';

export interface DriverProfile {
  id: string;
  userId: string;
  status: DriverStatus;
  displayName: string;
  serviceTypes: string[];
  activeVehicleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverDocument {
  id: string;
  driverId: string;
  type: string;
  status: DriverDocumentStatus;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  ownerDriverId: string;
  status: VehicleStatus;
  plateNumber: string;
  serviceTypes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DriverOnlineEligibility {
  driverId: string;
  allowed: boolean;
  driverStatus: DriverStatus;
  vehicleStatus?: VehicleStatus;
  hasValidDocuments: boolean;
  reasons: string[];
}

export const DRIVER_ONLINE_REQUIRES_APPROVED_COMPLIANCE = true;
