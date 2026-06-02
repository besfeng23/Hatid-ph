import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
export function InlineTrustBanner({ title = 'Prototype safety note', children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return <div className={cn('flex gap-3 rounded-3xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950', className)}><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><p className="font-bold">{title}</p><p className="text-blue-900/80">{children}</p></div></div>;
}
