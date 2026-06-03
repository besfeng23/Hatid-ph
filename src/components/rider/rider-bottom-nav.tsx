import Link from 'next/link';
import { Bookmark, Home, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/rider/search', label: 'Book', icon: MapPin },
  { href: '/rider/saved-places', label: 'Saved', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
];

export function RiderBottomNav({ active = 'Home' }: { active?: string }) {
  return (
    <nav className="mx-auto flex w-full max-w-[430px] items-center justify-around rounded-t-[1.75rem] border border-slate-200/80 bg-white/95 px-3 py-3 shadow-2xl backdrop-blur">
      {items.map(({ href, label, icon: Icon }) => {
        const isActive = active === label;
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              'flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px] font-semibold text-slate-400 transition-colors',
              isActive && 'text-primary'
            )}
          >
            <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.4]')} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
