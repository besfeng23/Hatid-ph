'use client';

import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from './header';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
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
