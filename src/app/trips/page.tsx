import { RoutePlaceholder } from '@/components/route-placeholder';

export default function TripsPage() {
  return (
    <RoutePlaceholder
      title="Trips"
      description="Trip history will show past and active Hatid rides once the trip backend is wired."
      status="No live trip database, dispatch, receipt, or driver history is active in this phase."
    />
  );
}
