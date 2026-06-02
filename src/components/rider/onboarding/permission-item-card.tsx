import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PermissionItem = { title: string; description: string; priority: 'first' | 'later'; icon: React.ReactNode };
export function PermissionItemCard({ item }: { item: PermissionItem }) {
  const isFirst = item.priority === 'first';
  return <div className={cn('flex gap-4 rounded-3xl border bg-white p-4 shadow-sm', isFirst ? 'border-blue-100' : 'border-slate-200 opacity-90')}><div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', isFirst ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500')}>{item.icon}</div><div className="flex-1"><div className="flex items-center justify-between gap-3"><h3 className="font-bold">{item.title}</h3><span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold', isFirst ? 'bg-blue-50 text-primary' : 'bg-slate-100 text-slate-500')}>{isFirst ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}{isFirst ? 'First-run' : 'Later'}</span></div><p className="mt-1 text-sm text-muted-foreground">{item.description}</p></div></div>;
}
