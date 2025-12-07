import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg shadow-lg">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary tracking-tight">Hatid</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Rider</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/driver">Driver</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
