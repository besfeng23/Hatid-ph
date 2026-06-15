import { RoutePlaceholder } from '@/components/route-placeholder';

export default function SafetyPage() {
  return (
    <RoutePlaceholder
      title="Safety"
      description="Safety tools will show trusted contacts, support, and incident options once the verified safety backend exists."
      status="No live emergency dispatch, support escalation, or incident-response backend is active in this phase."
    />
  );
}
