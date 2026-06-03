import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = React.ComponentProps<typeof Button> & { href?: string };

export function SecondaryCta({ href, children, className, ...props }: Props) {
  const button = (
    <Button
      variant="ghost"
      className={cn(
        'h-14 w-full rounded-[1.4rem] border border-slate-200 bg-white text-base font-semibold text-primary shadow-sm hover:bg-slate-50',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );

  return href ? <Link href={href}>{button}</Link> : button;
}
