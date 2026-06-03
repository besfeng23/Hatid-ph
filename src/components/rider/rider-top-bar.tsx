import Link from 'next/link';
import { ArrowLeft, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  className?: string;
};

export function RiderTopBar({ title = 'Hatid', subtitle, showBack, backHref = '/', className }: Props) {
  return (
    <header className={cn('flex items-center justify-between gap-3 px-5 py-5', className)}>
      <div className="flex items-center gap-3">
        {showBack ? (
          <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-full border border-slate-200 bg-white shadow-sm">
            <Link href={backHref} aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Menu className="h-5 w-5" />
          </div>
        )}
        <div className="space-y-0.5">
          <p className="text-[1.45rem] font-black tracking-tight leading-none">{title}</p>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      </div>

      <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full border border-slate-200 bg-white shadow-sm" aria-label="Notifications">
        <Bell className="h-5 w-5" />
      </Button>
    </header>
  );
}
