
import { DriverDashboard } from '@/components/driver-dashboard';

export default function DriverDashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Driver Dashboard</h1>
        <p className="text-muted-foreground">
          Your central hub for managing rides, earnings, and performance.
        </p>
      </div>
      <div className="mt-8">
        <DriverDashboard />
      </div>
    </div>
  );
}
