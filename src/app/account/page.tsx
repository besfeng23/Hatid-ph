import { User } from 'lucide-react';

import { RouteShellPage } from '@/components/route-shell-page';

export default function AccountPage() {
  return (
    <RouteShellPage
      eyebrow="Account"
      title="Account shell"
      description="A standalone route for the Hatid account area so QA and navigation do not hit a 404."
      icon={User}
      notes={[
        'Account details are not fully wired to Supabase auth/profile records yet.',
        'Real profile edits must later use authenticated server actions, RLS, validation, and audit-safe updates.',
        'Use this shell for route QA while auth/profile wiring is completed separately.'
      ]}
    />
  );
}
