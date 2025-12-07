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
  Menu,
  LogIn,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function AppSidebar() {
  const { isMobile, toggleSidebar } = useSidebar();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

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
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/profile">
                  <User />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
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
            {!isUserLoading &&
              (user ? (
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>Log Out</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild>
                  <Link href="/login">
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
