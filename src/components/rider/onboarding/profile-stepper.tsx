import { cn } from '@/lib/utils';
const steps = ['Permissions', 'Profile', 'Ready'];
export function ProfileStepper({ current = 2 }: { current?: number }) {
  return <div className="flex items-center gap-2">{steps.map((step, index) => <div key={step} className="flex flex-1 items-center gap-2"><div className={cn('h-2 flex-1 rounded-full', index + 1 <= current ? 'bg-primary' : 'bg-slate-200')} /><span className={cn('hidden text-xs font-bold sm:inline', index + 1 <= current ? 'text-primary' : 'text-muted-foreground')}>{step}</span></div>)}</div>;
}
