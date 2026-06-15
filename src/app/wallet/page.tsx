import { Wallet } from 'lucide-react';

import { RouteShellPage } from '@/components/route-shell-page';

export default function WalletPage() {
  return (
    <RouteShellPage
      eyebrow="Wallet"
      title="Wallet preview"
      description="A standalone route for the Hatid wallet area so QA and navigation do not hit a 404."
      icon={Wallet}
      notes={[
        'Wallet balances shown in the prototype are not real stored value.',
        'Real balances must later be ledger-derived, server-owned, reconciled, and never trusted from the client.',
        'Payment provider and payout integrations are intentionally not wired from this route.'
      ]}
    />
  );
}
