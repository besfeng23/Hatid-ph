import { DriverDashboard } from '@/components/driver-dashboard';
import {-3, Building, TrendingUp } from 'lucide-react';

export default function DriverDashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter text-primary">
          Driver Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your earnings, view trip history, and manage your status.
        </p>
      </div>
      <DriverDashboard />
    </div>
  );
}
