export type PaymentProvider =
  | 'paymongo'
  | 'maya'
  | 'xendit'
  | 'dragonpay'
  | 'speedcash';

export type PaymentMethodType =
  | 'cash'
  | 'card'
  | 'ewallet'
  | 'bank_transfer'
  | 'qr'
  | 'over_the_counter'
  | 'remittance';

export type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_action'
  | 'processing'
  | 'authorized'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'expired';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'voided'
  | 'refunded'
  | 'partially_refunded'
  | 'disputed';

export type RefundStatus =
  | 'requested'
  | 'approved'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export type ProviderWebhookEventStatus =
  | 'received'
  | 'verified'
  | 'rejected'
  | 'processed'
  | 'failed'
  | 'replayed';

export interface MoneyAmount {
  amountMinor: number;
  currency: 'PHP';
}

export interface PaymentIntent {
  id: string;
  provider: PaymentProvider;
  methodType: PaymentMethodType;
  status: PaymentIntentStatus;
  tripId?: string;
  quoteId?: string;
  idempotencyKey: string;
  amount: MoneyAmount;
  providerReference?: string;
  expiresAt: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  provider: PaymentProvider;
  methodType: PaymentMethodType;
  status: PaymentStatus;
  tripId: string;
  paymentIntentId?: string;
  amount: MoneyAmount;
  providerReference?: string;
  capturedAt?: string;
  createdAt: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  status: RefundStatus;
  amount: MoneyAmount;
  reasonCode: string;
  providerReference?: string;
  createdAt: string;
}

export interface ProviderWebhookEvent {
  id: string;
  provider: PaymentProvider;
  providerEventId: string;
  status: ProviderWebhookEventStatus;
  receivedAt: string;
  processedAt?: string;
}

/**
 * SpeedCash is a future adapter candidate only.
 * Do not use this provider for live rider payments, wallet balances, remittance,
 * cash-in/cash-out, or driver payouts until API, webhook, settlement,
 * reconciliation, legal, and compliance due diligence passes.
 */
export const SPEEDCASH_IS_FUTURE_ADAPTER_ONLY = true;
