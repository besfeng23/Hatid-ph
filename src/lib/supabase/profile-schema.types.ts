export type ProfilePrimaryRole = 'rider' | 'admin' | 'operator' | 'support';

export type ProfileStatus = 'incomplete' | 'complete' | 'suspended' | 'deleted';

export type RiderPaymentPreference = 'cash' | 'card_placeholder' | 'wallet_placeholder';

export type ProfileRow = {
  id: string;
  email: string | null;
  phone: string | null;
  display_name: string | null;
  photo_url: string | null;
  primary_role: ProfilePrimaryRole;
  profile_status: ProfileStatus;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileInsert = {
  id: string;
  email?: string | null;
  phone?: string | null;
  display_name?: string | null;
  photo_url?: string | null;
  primary_role?: ProfilePrimaryRole;
  profile_status?: ProfileStatus;
  onboarding_completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = {
  email?: string | null;
  phone?: string | null;
  display_name?: string | null;
  photo_url?: string | null;
  primary_role?: ProfilePrimaryRole;
  profile_status?: ProfileStatus;
  onboarding_completed_at?: string | null;
  updated_at?: string;
};

export type RiderProfileRow = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  birthdate: string | null;
  preferred_language: string | null;
  default_payment_preference: RiderPaymentPreference | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  created_at: string;
  updated_at: string;
};

export type RiderProfileInsert = {
  user_id: string;
  first_name?: string | null;
  last_name?: string | null;
  birthdate?: string | null;
  preferred_language?: string | null;
  default_payment_preference?: RiderPaymentPreference | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type RiderProfileUpdate = {
  first_name?: string | null;
  last_name?: string | null;
  birthdate?: string | null;
  preferred_language?: string | null;
  default_payment_preference?: RiderPaymentPreference | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  updated_at?: string;
};

export type ProfileSchemaContractStatus = 'schema-aligned-pending-supabase-generation';

/**
 * This file mirrors the Sprint 0B profile migration so server helper code can
 * depend on explicit local types before runtime wiring.
 *
 * Replace or reconcile this contract with generated Supabase CLI output before
 * login, signup, profile persistence, or onboarding persistence are connected
 * to production Supabase behavior.
 */
export const profileSchemaContractStatus: ProfileSchemaContractStatus =
  'schema-aligned-pending-supabase-generation';
