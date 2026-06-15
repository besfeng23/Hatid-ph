import { Shield } from 'lucide-react';

import { RouteShellPage } from '@/components/route-shell-page';

export default function SafetyPage() {
  return (
    <RouteShellPage
      eyebrow="Safety"
      title="Safety center"
      description="A standalone route for the Hatid safety area so QA and navigation do not hit a 404."
      icon={Shield}
      notes={[
        'Emergency and incident flows are prototype-only in this shell.',
        'Real safety actions must later be backed by verified users, incident records, escalation rules, and operator review.',
        'This page should not be treated as a live emergency service.'
      ]}
    />
  );
}
