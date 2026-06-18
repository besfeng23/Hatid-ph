'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bell, ChevronRight, CreditCard, HelpCircle, Shield, User } from 'lucide-react';
import AuthGuard from '@/components/auth-guard';
import { useUser } from '@/platform/provider';
import { useToast } from '@/hooks/use-toast';
import { saveMyAppUserProfile, type AppUserProfileRpcClient } from '@/lib/profile/app-user-profile';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(user?.displayName || user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || user?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.name || user.email?.split('@')[0] || '');
      setPhoneNumber(user.phoneNumber || user.phone || '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);

    const result = await saveMyAppUserProfile(createBrowserSupabaseClient() as unknown as AppUserProfileRpcClient, {
      display_name: displayName,
      phone: phoneNumber,
    });

    setIsSavingProfile(false);

    if (!result.ok) {
      toast({
        variant: 'destructive',
        title: 'Profile save failed',
        description: result.error.message,
      });
      return;
    }

    setDisplayName(result.data.display_name || '');
    setPhoneNumber(result.data.phone || '');
    toast({
      title: 'Profile saved',
      description: 'Your display name and phone were saved through the audited profile RPC.',
    });
  };

  const handleLogout = async () => {
    const { error } = await createBrowserSupabaseClient().auth.signOut();

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Log out failed',
        description: error.message,
      });
      return;
    }

    router.replace('/login');
    router.refresh();
  };

  const avatarImage = PlaceHolderImages.find((image) => image.id === 'driver_avatar_1');
  const userDisplayName = displayName || user?.email?.split('@')[0] || 'User';
  const email = user?.email || 'No email provided';

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary">
            {user?.photoURL || (avatarImage && avatarImage.imageUrl) ? (
              <AvatarImage src={user?.photoURL || avatarImage!.imageUrl} alt={userDisplayName} data-ai-hint={avatarImage?.imageHint} />
            ) : null}
            <AvatarFallback className="text-4xl">
              <User />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{userDisplayName}</h1>
            <p className="text-muted-foreground">{email}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Edit only your display name and phone. This is not KYC and does not create rider, driver, admin, organization, role, or membership authority.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} disabled={isSavingProfile} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} disabled={isSavingProfile} placeholder="Not provided" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} disabled readOnly />
            </div>
            <p className="text-sm text-muted-foreground">
              Saving updates only display_name and phone through core.upsert_my_app_user_profile. It is not identity verification or authority approval.
            </p>
            <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving…' : 'Save'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <SettingItem icon={<CreditCard />} title="Payment Methods" description="Manage your saved cards and payment options." href="/profile/payment" />
            <SettingItem icon={<Bell />} title="Notifications" description="Choose how you receive notifications." href="#" />
            <SettingItem icon={<Shield />} title="Security" description="Change your password and manage account security." href="#" />
            <SettingItem icon={<HelpCircle />} title="Help Center" description="Get support or report an issue." href="#" />
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full" onClick={handleLogout}>Log Out</Button>
      </div>
    </div>
  );
}

function SettingItem({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover:bg-secondary/50 -mx-6 px-6 transition-colors">
      <div className="text-primary">{icon}</div>
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="text-muted-foreground" />
    </Link>
  );
}

export default function ProfilePageWithAuth() {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  );
}
