import { Bell, Camera, MapPin, Mic, Users } from 'lucide-react';
import AuthGuard from '@/components/auth-guard';
import { InlineTrustBanner } from '@/components/rider/inline-trust-banner';
import { PrimaryCta } from '@/components/rider/primary-cta';
import { RiderScreenContainer } from '@/components/rider/rider-screen-container';
import { SecondaryCta } from '@/components/rider/secondary-cta';
import { PermissionItemCard, type PermissionItem } from '@/components/rider/onboarding/permission-item-card';

const permissions: PermissionItem[] = [
  { title: 'Location', description: 'Used to place your pickup pin and show trip context. You can still continue while deciding.', priority: 'first', icon: <MapPin className="h-6 w-6" /> },
  { title: 'Notifications', description: 'Useful for ride status updates when the production backend supports them.', priority: 'first', icon: <Bell className="h-6 w-6" /> },
  { title: 'Contacts', description: 'Requested later only if you choose contact-based safety or sharing features.', priority: 'later', icon: <Users className="h-6 w-6" /> },
  { title: 'Camera', description: 'Requested later only if you upload a profile or support photo.', priority: 'later', icon: <Camera className="h-6 w-6" /> },
  { title: 'Microphone', description: 'Requested later only if a future support feature needs voice input.', priority: 'later', icon: <Mic className="h-6 w-6" /> },
];

function PermissionsPage() {
  return <RiderScreenContainer className="px-4 py-6"><div className="mx-auto max-w-md space-y-6"><div className="space-y-2"><p className="text-sm font-extrabold uppercase tracking-[0.3em] text-primary">Hatid</p><h1 className="text-4xl font-black tracking-tight">Set up a safer ride experience</h1><p className="text-muted-foreground">Location and notifications come first. Everything else can wait until the feature needs it.</p></div><div className="space-y-3">{permissions.map((item) => <PermissionItemCard key={item.title} item={item} />)}</div><InlineTrustBanner title="You can continue now">Granting every permission is not required for this prototype. Hatid will ask again only when a specific action needs access.</InlineTrustBanner><div className="space-y-2"><PrimaryCta href="/onboarding/profile">Continue setup</PrimaryCta><SecondaryCta href="/">Defer and go to home</SecondaryCta></div></div></RiderScreenContainer>;
}
export default function PermissionsPageWithAuth() { return <AuthGuard><PermissionsPage /></AuthGuard>; }
