export type LedgerAccountType =
  | 'asset'
  | 'liability'
  | 'revenue'
  | 'expense'
  | 'equity';

export type LedgerJournalStatus =
  | 'draft'
  | 'posted'
  | 'reversed'
  | 'voided';

export type LedgerEntryDirection = 'debit' | 'credit';

export interface LedgerAccount {
  id: string;
  ownerType:
    | 'platform'
    | 'rider'
    | 'driver'
    | 'fleet'
    | 'merchant'
    | 'provider';
  ownerId?: string;
  type: LedgerAccountType;
  code: string;
  name: string;
  currency: 'PHP';
  status: 'active' | 'frozen' | 'closed';
  createdAt: string;
}

export interface LedgerJournal {
  id: string;
  status: LedgerJournalStatus;
  reasonCode: string;
  description?: string;
  idempotencyKey?: string;
  tripId?: string;
  paymentId?: string;
  payoutId?: string;
  refundId?: string;
  postedAt?: string;
  reversedAt?: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  journalId: string;
  accountId: string;
  direction: LedgerEntryDirection;
  amountMinor: number;
  currency: 'PHP';
  memo?: string;
  createdAt: string;
}

/**
 * Ledger rule: balances are derived from posted entries. Do not mutate balances
 * directly from clients, admin screens, provider callbacks, or support tools.
 */
export const LEDGER_BALANCES_ARE_DERIVED = true;

/** No admin manual balance edits. Use reversing/adjusting journals only. */
export const ADMIN_DIRECT_BALANCE_EDITS_ALLOWED = false;
