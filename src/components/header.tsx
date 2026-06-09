
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SidebarTrigger } from './ui/sidebar';
import { useSupabaseUser } from '@/supabase/hooks';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Header() {
  const { user, isLoading: isUserLoading } = useSupabaseUser();
  const avatarImage = PlaceHolderImages.find(p => p.id === 'driver_avatar_1');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className='flex items-center gap-2'>
            <SidebarTrigger className='md:hidden'/>
            <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg shadow-lg">
                <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight font-headline">Hatid</span>
            </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
            {!isUserLoading && (
              user ? (
                <Button variant="ghost" asChild size="icon">
                    <Link href="/profile">
                    <Avatar className="h-9 w-9">
                        {avatarImage && <AvatarImage src={user.user_metadata.avatar_url || avatarImage.imageUrl} alt="User Avatar" />}
                        <AvatarFallback>
                        <User />
                        </AvatarFallback>
                    </Avatar>
                    </Link>
                </Button>
              ) : (
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
              )
            )}
        </div>
      </div>
    </header>
  );
}
