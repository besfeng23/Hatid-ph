
'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, User } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Driver } from './ride-request-panel';

export function TripDetailsCard({ driver }: { driver: Driver }) {
  return (
    <Card className="bg-secondary">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={driver.avatarUrl} alt={driver.name} data-ai-hint={driver.avatarHint} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{driver.name}</h3>
            <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
              <Star className="h-4 w-4 fill-current" /> {driver.rating}
            </div>
            <p className="text-sm text-muted-foreground">{driver.vehicle} • {driver.plate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
