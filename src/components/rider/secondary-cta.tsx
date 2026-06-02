import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = React.ComponentProps<typeof Button> & { href?: string };
export function SecondaryCta({ href, children, className, ...props }: Props) {
  const button = <Button variant="ghost" className={className ?? 'h-12 w-full rounded-full text-base font-semibold'} {...props}>{children}</Button>;
  return href ? <Link href={href}>{button}</Link> : button;
}
