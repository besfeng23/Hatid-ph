import { cn } from '@/lib/utils';

const steps = ['Permissions', 'Profile', 'Ready'];

export function ProfileStepper({ current = 2 }: { current?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <span className="rounded-2xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary">Step {current} of {steps.length}</span>
      </div>
      <div className="flex items-center gap-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= current;
          return (
            <div key={step} className="flex flex-1 items-center gap-3">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-full border text-sm font-black', isActive ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-400')}>
                {stepNumber}
              </div>
              {index < steps.length - 1 ? <div className={cn('h-[3px] flex-1 rounded-full', stepNumber < current ? 'bg-primary' : 'bg-slate-200')} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
