'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Car,
  User,
  LayoutDashboard,
  LogOut,
  Cog,
  Shield,
  Menu,
} from 'lucide-react';
import Link from 'next/link';

export function AppSidebar() {
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <>
      {isMobile && (
        <div className="p-2 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg shadow-lg">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight font-headline">
              Hatid
            </span>
          </Link>
          <button onClick={() => toggleSidebar()}>
            <Menu />
          </button>
        </div>
      )}
      <SidebarHeader>
        <div className="flex items-center gap-3" data-testid="sidebar-header">
          <div className="p-2 bg-primary rounded-lg shadow-lg">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary tracking-tight font-headline">
            Hatid
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Car />
                <span>Rider</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/driver">
                <LayoutDashboard />
                <span>Driver</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/profile">
                <User />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <Shield />
                <span>Safety</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <Cog />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
