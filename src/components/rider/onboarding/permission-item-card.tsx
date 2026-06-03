import { ArrowRight, Clock3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PermissionItem = {
  title: string;
  description: string;
  priority: 'first' | 'later';
  icon: React.ReactNode;
};

export function PermissionItemCard({ item }: { item: PermissionItem }) {
  const isFirst = item.priority === 'first';

  return (
    <div className="flex items-center gap-4 rounded-[1.9rem] border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', isFirst ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500')}>
        {item.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[1.1rem] font-extrabold tracking-tight text-slate-950">{item.title}</h3>
          <span className={cn('inline-flex items-center gap-1 text-sm font-bold', isFirst ? 'text-primary' : 'text-slate-400')}>
            {isFirst ? 'Allow' : 'Later'}
            {isFirst ? <ArrowRight className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
          </span>
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
      </div>
    </div>
  );
}
