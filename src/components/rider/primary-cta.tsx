import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = React.ComponentProps<typeof Button> & { href?: string };

export function PrimaryCta({ href, children, className, ...props }: Props) {
  const button = (
    <Button
      className={cn(
        'h-14 w-full rounded-[1.4rem] bg-primary text-base font-bold text-primary-foreground shadow-lg disabled:opacity-100 disabled:bg-primary/55 disabled:text-white',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );

  return href ? <Link href={href}>{button}</Link> : button;
}
