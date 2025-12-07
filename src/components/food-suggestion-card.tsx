
'use client';
import { useEffect, useState } from 'react';
import { SuggestedFoodSpotsOutput } from '@/ai/flows/suggested-food-spots';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from './ui/skeleton';

const mockSuggestions: SuggestedFoodSpotsOutput['suggestions'] = [
  {
    restaurantName: 'Manam Comfort Filipino',
    cuisine: 'Filipino',
    reason: 'A modern take on classic Filipino comfort food, perfect for dinner.',
  },
  {
    restaurantName: 'Locavore',
    cuisine: 'Filipino',
    reason: 'Known for its creative and delicious Filipino dishes like Sizzling Sinigang.',
  },
  {
    restaurantName: 'Sentro 1771',
    cuisine: 'Filipino',
    reason: 'Famous for its Corned Beef Sinigang and other innovative Filipino classics.',
  },
];

export function FoodSuggestionCard() {
  const [suggestions, setSuggestions] =
    useState<SuggestedFoodSpotsOutput['suggestions'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        // In a real app, these inputs would be dynamic
        // Using mock data to avoid hitting API rate limits during development
        setSuggestions(mockSuggestions);
      } catch (e) {
        console.error('Failed to get food suggestions:', e);
        setError('Could not load dining suggestions.');
      }
    }
    fetchSuggestions();
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold tracking-tight">Dining Near You</h3>
      <p className="text-muted-foreground">AI-powered food picks.</p>
      {error && <div className="text-destructive">{error}</div>}
      {!suggestions && !error && <SuggestionsSkeleton />}
      {suggestions && <FoodSuggestionsClient suggestions={suggestions} />}
    </div>
  );
}

function FoodSuggestionsClient({
  suggestions,
}: {
  suggestions: SuggestedFoodSpotsOutput['suggestions'];
}) {
  const foodImages = {
    Sisig: PlaceHolderImages.find((p) => p.id === 'food_sisig'),
    Adobo: PlaceHolderImages.find((p) => p.id === 'food_adobo'),
    Lechon: PlaceHolderImages.find((p) => p.id === 'food_lechon'),
    Default: PlaceHolderImages.find((p) => p.id === 'food_default'),
  };

  const getImageUrl = (name: string) => {
    if (name.includes('Sisig')) return foodImages.Sisig;
    if (name.includes('Adobo')) return foodImages.Adobo;
    if (name.includes('Lechon')) return foodImages.Lechon;
    return foodImages.Default;
  };

  return (
    <Carousel opts={{ align: 'start' }} className="w-full">
      <CarouselContent>
        {suggestions.map((item, index) => {
          const image = getImageUrl(item.restaurantName);
          return (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-full">
              <div className="p-1">
                <Card className="overflow-hidden bg-secondary">
                  <CardContent className="flex aspect-[4/3] items-center justify-center p-0 relative">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={item.restaurantName}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h4 className="text-lg font-bold text-white">
                        {item.restaurantName}
                      </h4>
                      <p className="text-xs text-white/80">{item.reason}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}

function SuggestionsSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
