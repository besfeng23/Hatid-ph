import { Clock } from 'lucide-react';

import { RouteShellPage } from '@/components/route-shell-page';

export default function TripsPage() {
  return (
    <RouteShellPage
      eyebrow="Trips"
      title="Trip history"
      description="A standalone route for the Hatid trips area so QA and navigation do not hit a 404."
      icon={Clock}
      notes={[
        'Trip history shown here is not connected to live booking records yet.',
        'Real trips must later be read from server-owned Supabase records with RLS and audit trails.',
        'Use the passenger preview to review the current mobile Trips screen.'
      ]}
    />
  );
}
