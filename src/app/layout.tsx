
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseProvider } from '@/supabase/provider';


export const metadata: Metadata = {
  title: 'Hatid: Your Ride in Manila',
  description: 'The premier ride-sharing app for Metro Manila.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('font-sans')}>
      <body
        className={cn(
          'font-body antialiased bg-background text-foreground'
        )}
      >
        <SupabaseProvider>
            {children}
            <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  );
}
