
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bell, CreditCard, HelpCircle, Shield, User } from 'lucide-react';

export default function ProfilePage() {
    const avatarImage = PlaceHolderImages.find(p => p.id === 'driver_avatar_1');

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
            <div className="space-y-8">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-primary">
                        {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt="Juan Dela Cruz" data-ai-hint={avatarImage.imageHint} />}
                        <AvatarFallback className="text-4xl">
                            <User />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold">Juan Dela Cruz</h1>
                        <p className="text-muted-foreground">juandelacruz@email.com</p>
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
                                <Input id="name" defaultValue="Juan Dela Cruz" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" defaultValue="+63 917 123 4567" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue="juandelacruz@email.com" />
                        </div>
                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your account preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="divide-y">
                        <SettingItem icon={<CreditCard />} title="Payment Methods" description="Manage your saved cards and payment options." />
                        <SettingItem icon={<Bell />} title="Notifications" description="Choose how you receive notifications." />
                        <SettingItem icon={<Shield />} title="Security" description="Change your password and manage account security." />
                        <SettingItem icon={<HelpCircle />} title="Help Center" description="Get support or report an issue." />
                    </CardContent>
                </Card>

                 <Button variant="destructive" className='w-full'>Log Out</Button>
            </div>
        </div>
    );
}

function SettingItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex items-center gap-4 py-4">
            <div className="text-primary">{icon}</div>
            <div className="flex-1">
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button variant="ghost" size="sm">Manage</Button>
        </div>
    )
}
