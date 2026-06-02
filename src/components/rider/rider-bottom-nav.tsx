import Link from 'next/link';
import { Home, MapPin, User, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/rider/search', label: 'Book', icon: MapPin },
  { href: '/rider/saved-places', label: 'Saved', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
];
export function RiderBottomNav({ active = 'Home' }: { active?: string }) {
  return <nav className="mx-auto flex w-full max-w-md items-center justify-around rounded-t-3xl border bg-white px-2 py-3 shadow-2xl">{items.map(({ href, label, icon: Icon }) => <Link key={label} href={href} className={cn('flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold text-muted-foreground', active === label && 'bg-primary/10 text-primary')}><Icon className="h-5 w-5" />{label}</Link>)}</nav>;
}
