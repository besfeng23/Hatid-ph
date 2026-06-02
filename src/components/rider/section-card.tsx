import { cn } from '@/lib/utils';
export function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('rounded-3xl border border-slate-200 bg-white p-4 shadow-sm', className)}>{children}</section>;
}
