import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';

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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'font-body antialiased bg-gradient-to-br from-[#00205F] to-[#003D9C] text-foreground'
        )}
      >
        <div className="relative flex min-h-screen w-full flex-col">
          <Header />
          <main className="flex-1 w-full">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
