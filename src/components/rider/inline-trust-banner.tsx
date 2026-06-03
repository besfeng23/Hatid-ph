import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InlineTrustBanner({ title = 'Prototype safety note', children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex gap-3 rounded-[1.9rem] border border-blue-100 bg-blue-50 px-4 py-4 text-sm text-slate-900', className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="font-extrabold text-slate-950">{title}</p>
        <p className="leading-7 text-slate-600">{children}</p>
      </div>
    </div>
  );
}
