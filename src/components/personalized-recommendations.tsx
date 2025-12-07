
'use client';

import React, { useEffect, useState } from 'react';
import { PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, User, Route } from 'lucide-react';
import { Skeleton } from './ui/skeleton';


const mockRecommendations: PersonalizedRecommendationsOutput = {
  driverRecommendations: ['Juan D.', 'Maria S.'],
  rideOptionsRecommendations: ['HatidCar for comfort', 'HatidMoto for speed'],
  preferredRoutes: ['EDSA via Ayala Tunnel', 'C5 to Pasig'],
};

export function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        // Using mock data to avoid hitting API rate limits during development
        setRecommendations(mockRecommendations);
      } catch (e) {
        console.error("Failed to get personalized recommendations:", e);
        setError("Could not load recommendations.");
      }
    }

    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold tracking-tight">Your Picks</h3>
      <p className="text-muted-foreground">Top drivers and routes for you.</p>
      {error && <div className="text-destructive">{error}</div>}
      {!recommendations && !error && <RecommendationsSkeleton />}
      {recommendations && <PersonalizedRecommendationsClient recommendations={recommendations} />}
    </div>
  );
}


function PersonalizedRecommendationsClient({ recommendations }: { recommendations: PersonalizedRecommendationsOutput }) {
  const driverAvatars = [
    PlaceHolderImages.find(p => p.id === 'driver_avatar_1'),
    PlaceHolderImages.find(p => p.id === 'driver_avatar_2'),
    PlaceHolderImages.find(p => p.id === 'driver_avatar_3'),
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-primary"><User size={16}/> Top Drivers</h4>
        <div className="space-y-2">
          {recommendations.driverRecommendations.slice(0, 2).map((driver, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
              <Avatar>
                <AvatarImage src={driverAvatars[index]?.imageUrl} data-ai-hint={driverAvatars[index]?.imageHint} />
                <AvatarFallback>
                  {driver.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{driver}</p>
                <div className="flex items-center text-xs text-yellow-500">
                    <Star className="w-3 h-3 fill-current mr-1"/>
                    <span>{(4.5 + Math.random() * 0.5).toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
       <div>
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-primary"><Route size={16}/> Preferred Routes</h4>
        <div className="space-y-2">
          {recommendations.preferredRoutes.slice(0, 2).map((route, index) => (
            <div key={index} className="p-2 rounded-lg bg-secondary/50 text-sm font-medium">{route}</div>
          ))}
        </div>
      </div>
    </div>
  );
}


function RecommendationsSkeleton() {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
    )
}
