import { cn } from '@/lib/utils';

export function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        'rounded-[2rem] border border-slate-200/80 bg-white px-5 py-4 shadow-lg',
        className
      )}
    >
      {children}
    </section>
  );
}
