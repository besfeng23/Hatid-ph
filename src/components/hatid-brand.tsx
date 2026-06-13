import type { ReactNode } from 'react';

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export type HatidWordmarkProps = {
  light?: boolean;
  large?: boolean;
  compact?: boolean;
  tagline?: ReactNode;
};

export function HatidWordmark({ light = false, large = false, compact = false, tagline }: HatidWordmarkProps) {
  return (
    <div className={cn('inline-flex items-center gap-2.5', compact && 'gap-2')} aria-label="Hatid">
      <span
        className={cn(
          'grid place-items-center rounded-2xl font-black tracking-tight shadow-sm',
          large ? 'h-12 w-12 text-[23px]' : 'h-9 w-9 text-[17px]',
          light ? 'bg-white text-[#0033CC]' : 'bg-[#0033CC] text-white',
        )}
      >
        H
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-black tracking-[-0.045em]',
            large ? 'text-4xl' : 'text-2xl',
            light ? 'text-white' : 'text-[#0033CC]',
          )}
        >
          Hatid
        </span>
        {tagline && (
          <span className={cn('mt-1 text-[10px] font-semibold tracking-wide', light ? 'text-blue-100' : 'text-slate-500')}>
            {tagline}
          </span>
        )}
      </span>
    </div>
  );
}

export function HatidTrustPill({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'slate' | 'red' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold leading-none',
        tone === 'blue' && 'border-blue-100 bg-blue-50 text-[#0033CC]',
        tone === 'green' && 'border-emerald-100 bg-emerald-50 text-emerald-700',
        tone === 'slate' && 'border-slate-200 bg-slate-50 text-slate-600',
        tone === 'red' && 'border-red-100 bg-red-50 text-red-700',
      )}
    >
      {children}
    </span>
  );
}

export function HatidIconTile({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        'grid h-11 w-11 place-items-center rounded-2xl border transition-colors',
        active ? 'border-blue-100 bg-blue-50 text-[#0033CC]' : 'border-slate-200 bg-slate-50 text-slate-500',
      )}
    >
      {children}
    </span>
  );
}
