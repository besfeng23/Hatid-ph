'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EarningsChart } from '@/components/earnings-chart';
import { TripHistoryTable } from '@/components/trip-history-table';
import { Button } from './ui/button';
import { AlertTriangle, List, Map, Shield } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const mapImage = PlaceHolderImages.find(p => p.id === 'map_manila');

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="col-span-1 flex flex-col gap-8">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Your Status</CardTitle>
            <div
              className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
            />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
              <Label htmlFor="online-toggle" className="text-lg font-bold text-foreground">
                {isOnline ? 'You are Online' : 'You are Offline'}
              </Label>
              <Switch id="online-toggle" checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Toggle to start or stop receiving ride requests.
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Safety Toolkit</CardTitle>
            <CardDescription>Quick access in case of emergency.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
             <Button variant="destructive" className="flex-col h-20 gap-1">
                <Shield size={24} />
                <span>SOS</span>
            </Button>
            <Button variant="secondary" className="flex-col h-20 gap-1">
                <AlertTriangle size={24} />
                <span>Report Incident</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-1 lg:col-span-2">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Weekly Earnings</CardTitle>
            <CardDescription>Your performance for the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <EarningsChart />
          </CardContent>
        </Card>
      </div>

      <div className="col-span-1 lg:col-span-3">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Current Route</CardTitle>
            <CardDescription>Turn-by-turn navigation for your active trip.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2 h-64 md:h-96 rounded-lg overflow-hidden border">
                 {mapImage && (
                    <Image src={mapImage.imageUrl} alt="Map" fill className="object-cover" data-ai-hint={mapImage.imageHint}/>
                 )}
                 <div className="absolute inset-0 bg-black/40"></div>
                 <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 font-semibold">Live Navigation View</p>
            </div>
            <div className="md:col-span-1 h-64 md:h-96 rounded-lg bg-secondary p-4 overflow-y-auto">
                <h4 className="font-bold mb-4 flex items-center gap-2"><List/> Directions</h4>
                <div className="space-y-4 text-sm">
                    <p>1. Head north on EDSA.</p>
                    <p>2. In 300m, turn right onto Ayala Ave.</p>
                    <p>3. Continue for 1.2km.</p>
                    <p>4. Your destination will be on the left.</p>
                    <p className="font-bold text-primary">You have arrived.</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="col-span-1 lg:col-span-3">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Trip History</CardTitle>
            <CardDescription>A log of your completed trips.</CardDescription>
          </CardHeader>
          <CardContent>
            <TripHistoryTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
