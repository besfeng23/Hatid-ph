import React from 'react';
import { getPersonalizedRecommendations, PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, User, Route, Car } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

async function PersonalizedRecommendationsData() {
  try {
    const fakeInput = {
      userId: 'user-123',
      travelHistory: ['BGC to Makati', 'Makati to Quezon City', 'Pasay to BGC'],
      preferences: 'prefers sedans, quiet rides, high-rated drivers',
    };
    const recommendations = await getPersonalizedRecommendations(fakeInput);
    return <PersonalizedRecommendationsClient recommendations={recommendations} />;
  } catch (error) {
    console.error("Failed to get personalized recommendations:", error);
    return <div className="text-destructive">Could not load recommendations.</div>;
  }
}

export function PersonalizedRecommendations() {
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold tracking-tight">Your Picks</h3>
      <p className="text-muted-foreground">Top drivers and routes for you.</p>
      <React.Suspense fallback={<RecommendationsSkeleton />}>
        <PersonalizedRecommendationsData />
      </React.Suspense>
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
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
              <Avatar>
                <AvatarImage src={driverAvatars[index]?.imageUrl} data-ai-hint={driverAvatars[index]?.imageHint} />
                <AvatarFallback>
                  {driver.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{driver}</p>
                <div className="flex items-center text-xs text-yellow-400">
                    <Star className="w-3 h-3 fill-current mr-1"/>
                    <span>{(Math.random() * (5 - 4.5) + 4.5).toFixed(1)}</span>
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
            <div key={index} className="p-2 rounded-lg bg-background/50 text-sm font-medium">{route}</div>
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
