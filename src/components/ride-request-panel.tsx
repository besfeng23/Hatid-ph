'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type Driver = {
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
  avatarUrl: string;
  avatarHint: string;
};

export function RideRequestPanel({ onRideConfirmed: _onRideConfirmed }: { onRideConfirmed?: (driver: Driver | null) => void }) {
  return (
    <Card className="rounded-3xl border bg-white/95 shadow-2xl backdrop-blur">
      <CardContent className="space-y-3 p-4">
        <Button asChild className="h-14 w-full justify-start rounded-2xl text-left text-base font-bold">
          <Link href="/rider/search"><Search className="mr-3 h-5 w-5" /> Where to?</Link>
        </Button>
        <p className="px-2 text-xs text-muted-foreground">Booking now moves through dedicated search and fare-estimate screens. This prototype does not perform live dispatch or payment processing.</p>
      </CardContent>
    </Card>
  );
}
