'use client';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Car,
  User,
  LayoutDashboard,
  LogOut,
  Cog,
  Shield,
  LogIn,
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/platform/provider';
import { useRouter } from 'next/navigation';

export function AppSidebar() {
  const { isMobile, toggleSidebar } = useSidebar();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    router.push('/login');
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <>
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
              <Link href="/" onClick={closeMobileSidebar}>
                <Car />
                <span>Rider</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/driver" onClick={closeMobileSidebar}>
                <LayoutDashboard />
                <span>Driver</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/profile" onClick={closeMobileSidebar}>
                  <User />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#" onClick={closeMobileSidebar}>
                <Shield />
                <span>Safety</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#" onClick={closeMobileSidebar}>
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
            {!isUserLoading &&
              (user ? (
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>Log Out</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild>
                  <Link href="/login" onClick={closeMobileSidebar}>
                    <LogIn />
                    <span>Log In</span>
                  </Link>
                </SidebarMenuButton>
              ))}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
