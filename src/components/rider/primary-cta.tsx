import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = React.ComponentProps<typeof Button> & { href?: string };
export function PrimaryCta({ href, children, className, ...props }: Props) {
  const button = <Button className={className ?? 'h-14 w-full rounded-full text-base font-bold'} {...props}>{children}</Button>;
  return href ? <Link href={href}>{button}</Link> : button;
}
