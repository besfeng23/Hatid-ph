
'use client';

import { useState, useEffect, useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, ChevronRight, CreditCard, HelpCircle, Loader2, Shield, User } from 'lucide-react';
import AuthGuard from '@/components/auth-guard';
import Link from 'next/link';
import { SupabaseContext } from '@/supabase/context';
import { User as SupabaseUser } from '@supabase/supabase-js';

function ProfilePage() {
    const { supabase } = useContext(SupabaseContext);
    const [user, setUser] = useState<SupabaseUser | null>(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setFirstName(profile.first_name || '');
                    setLastName(profile.last_name || '');
                }
            }
        };

        getUser();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleSaveChanges = async () => {
        if (!user) return;
        setIsSaving(true);

        await supabase.from('profiles').upsert({
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString(),
        });

        setIsSaving(false);
    };

    const userDisplayName = [firstName, lastName].filter(Boolean).join(' ') || user?.email?.split('@')[0] || 'User';
    const email = user?.email || 'No email provided';

    return (
        <AuthGuard>
            <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
                <div className="space-y-8">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-primary">
                            {user?.user_metadata.avatar_url ? (
                                <AvatarImage src={user.user_metadata.avatar_url} alt={userDisplayName} />
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
                            <CardDescription>Update your personal details here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={email} disabled />
                            </div>
                            <Button onClick={handleSaveChanges} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
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

                     <Button variant="destructive" className='w-full' onClick={handleLogout}>Log Out</Button>
                </div>
            </div>
        </AuthGuard>
    );
}

function SettingItem({ icon, title, description, href }: { icon: React.ReactNode, title: string, description: string, href: string }) {
    return (
        <Link href={href} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover:bg-secondary/50 -mx-6 px-6 transition-colors">
            <div className="text-primary">{icon}</div>
            <div className="flex-1">
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ChevronRight className="text-muted-foreground" />
        </Link>
    )
}

export default ProfilePage;
