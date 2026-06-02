import Link from 'next/link';
import { ArrowLeft, Bell, Menu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = { title?: string; subtitle?: string; showBack?: boolean; backHref?: string; className?: string };
export function RiderTopBar({ title = 'Hatid', subtitle, showBack, backHref = '/', className }: Props) {
  return (
    <header className={cn('flex items-center justify-between gap-3 px-4 py-4', className)}>
      <div className="flex items-center gap-3">
        {showBack ? (
          <Button asChild variant="ghost" size="icon" className="rounded-full bg-white shadow-sm">
            <Link href={backHref} aria-label="Go back"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"><Menu className="h-5 w-5" /></div>
        )}
        <div>
          <p className="text-lg font-extrabold tracking-tight">{title}</p>
          {subtitle ? <p className="text-xs font-medium text-muted-foreground">{subtitle}</p> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-primary shadow-sm sm:flex"><ShieldCheck className="h-4 w-4" /> Prototype safe</div>
        <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm" aria-label="Notifications"><Bell className="h-5 w-5" /></Button>
      </div>
    </header>
  );
}
