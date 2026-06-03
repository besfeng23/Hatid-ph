import { Bell, Camera, MapPin, Mic, Users } from 'lucide-react';
import AuthGuard from '@/components/auth-guard';
import { InlineTrustBanner } from '@/components/rider/inline-trust-banner';
import { PrimaryCta } from '@/components/rider/primary-cta';
import { RiderScreenContainer } from '@/components/rider/rider-screen-container';
import { SecondaryCta } from '@/components/rider/secondary-cta';
import { PermissionItemCard, type PermissionItem } from '@/components/rider/onboarding/permission-item-card';

const permissions: PermissionItem[] = [
  {
    title: 'Location',
    description: 'Used to place your pickup pin and show trip context. You can still continue while deciding.',
    priority: 'first',
    icon: <MapPin className="h-6 w-6" />,
  },
  {
    title: 'Notifications',
    description: 'Useful for ride status updates when the production backend supports them.',
    priority: 'first',
    icon: <Bell className="h-6 w-6" />,
  },
  {
    title: 'Contacts',
    description: 'Requested later only if you choose contact-based safety or sharing features.',
    priority: 'later',
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: 'Camera',
    description: 'Requested later only if you upload a profile or support photo.',
    priority: 'later',
    icon: <Camera className="h-6 w-6" />,
  },
  {
    title: 'Microphone',
    description: 'Requested later only if a future support feature needs voice input.',
    priority: 'later',
    icon: <Mic className="h-6 w-6" />,
  },
];

function PermissionsPage() {
  return (
    <RiderScreenContainer className="px-4 py-8">
      <div className="mx-auto max-w-[430px] space-y-6">
        <div className="space-y-4 text-center">
          <div className="space-y-2">
            <p className="text-[2.4rem] font-black tracking-tight text-primary">Hatid</p>
            <h1 className="text-[2.4rem] font-black leading-tight tracking-tight text-slate-950">Allow permissions</h1>
            <p className="mx-auto max-w-sm text-lg leading-8 text-slate-500">
              Hatid needs the following permissions to provide you a safer and more reliable ride experience.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {permissions.map((item) => (
            <PermissionItemCard key={item.title} item={item} />
          ))}
        </div>

        <InlineTrustBanner title="Your safety and privacy are our priority">
          Location and notifications come first. Contacts, camera, and microphone are requested only when a later feature needs them.
        </InlineTrustBanner>

        <div className="space-y-3 pb-4">
          <PrimaryCta href="/onboarding/profile">Allow essential permissions</PrimaryCta>
          <SecondaryCta href="/">Maybe later</SecondaryCta>
        </div>
      </div>
    </RiderScreenContainer>
  );
}

export default function PermissionsPageWithAuth() {
  return (
    <AuthGuard>
      <PermissionsPage />
    </AuthGuard>
  );
}
