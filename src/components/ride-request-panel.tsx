
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Heart,
  Search,
  Shield,
  MessageCircle,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { SuggestedPlaces } from './suggested-places';
import { PersonalizedRecommendations } from './personalized-recommendations';
import { ScrollArea } from './ui/scroll-area';

export function RideRequestPanel() {
  const [destination, setDestination] = useState('');

  return (
    <Card className="flex h-full max-h-[calc(100vh-12rem)] w-full flex-col rounded-2xl border-border/50 bg-card/80 shadow-2xl shadow-black/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">
          Hello! Where to?
        </CardTitle>
        <CardDescription>
          Your next destination in Manila is just a tap away.
        </CardDescription>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="space-y-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              placeholder="Enter your destination"
              className="h-14 rounded-full bg-background/50 pl-12 text-base"
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" variant="secondary">
              <Heart className="mr-2 h-4 w-4" /> Saved
            </Button>
            <Button className="flex-1" variant="secondary">
              <MessageCircle className="mr-2 h-4 w-4" /> Chat
            </Button>
            <Button className="w-12" variant="destructive">
              <Shield className="h-5 w-5" />
              <span className="sr-only">SOS</span>
            </Button>
          </div>

          <Button
            className="w-full h-14 rounded-full text-lg font-bold animate-pulse disabled:animate-none"
            size="lg"
            disabled={!destination}
          >
            Find a Ride
            <ArrowRight className="ml-2" />
          </Button>

          <Separator className="my-6" />

          <SuggestedPlaces />

          <Separator className="my-6" />

          <PersonalizedRecommendations />
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
