'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bell, CreditCard, HelpCircle, Loader2, Shield, User } from 'lucide-react';
import AuthGuard from '@/components/auth-guard';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

function ProfilePage() {
    const { user } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || user.email?.split('@')[0] || '');
            setPhoneNumber(user.phoneNumber || '');

            const userDocRef = doc(firestore, 'users', user.uid);
            getDoc(userDocRef).then(docSnap => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setDisplayName(data.displayName || data.firstName || '');
                    setPhoneNumber(data.phoneNumber || '');
                }
            });
        }
    }, [user, firestore]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    const handleSaveChanges = () => {
        if (!user) return;
        setIsSaving(true);
        const userDocRef = doc(firestore, 'users', user.uid);
        
        const userData = {
            id: user.uid,
            email: user.email,
            displayName: displayName,
            phoneNumber: phoneNumber,
        };

        // Use non-blocking update
        setDocumentNonBlocking(userDocRef, userData, { merge: true });

        // Simulate save time and show toast
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: 'Profile Updated',
                description: 'Your changes have been saved successfully.',
            });
        }, 1000);
    };

    const avatarImage = PlaceHolderImages.find(p => p.id === 'driver_avatar_1');
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
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+63 917 123 4567" />
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
                        <SettingItem icon={<CreditCard />} title="Payment Methods" description="Manage your saved cards and payment options." />
                        <SettingItem icon={<Bell />} title="Notifications" description="Choose how you receive notifications." />
                        <SettingItem icon={<Shield />} title="Security" description="Change your password and manage account security." />
                        <SettingItem icon={<HelpCircle />} title="Help Center" description="Get support or report an issue." />
                    </CardContent>
                </Card>

                 <Button variant="destructive" className='w-full' onClick={handleLogout}>Log Out</Button>
            </div>
        </div>
    );
}

function SettingItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <div className="text-primary">{icon}</div>
            <div className="flex-1">
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button variant="ghost" size="sm">Manage</Button>
        </div>
    )
}

export default function ProfilePageWithAuth() {
    return (
        <AuthGuard>
            <ProfilePage />
        </AuthGuard>
    )
}
