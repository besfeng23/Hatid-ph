import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Header() {
  const avatarImage = PlaceHolderImages.find(p => p.id === 'driver_avatar_1');
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg shadow-lg">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary tracking-tight font-headline">Hatid</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Rider</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/driver">Driver</Link>
          </Button>
          <Button variant="ghost" asChild size="icon">
            <Link href="/profile">
               <Avatar className="h-9 w-9">
                {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt="User Avatar" />}
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
