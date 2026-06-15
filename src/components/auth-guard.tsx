'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useUser } from '@/platform/provider';
import { Header } from './header';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      const returnTo = pathname && pathname !== '/login' ? `?returnTo=${encodeURIComponent(pathname)}` : '';
      router.replace(`/login${returnTo}`);
    }
  }, [isUserLoading, pathname, router, user]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
