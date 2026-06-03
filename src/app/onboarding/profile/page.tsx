import AuthGuard from '@/components/auth-guard';
import { InlineTrustBanner } from '@/components/rider/inline-trust-banner';
import { RiderScreenContainer } from '@/components/rider/rider-screen-container';
import { ProfileStepper } from '@/components/rider/onboarding/profile-stepper';
import { RiderProfileForm } from '@/components/rider/onboarding/rider-profile-form';

function OnboardingProfilePage() {
  return (
    <RiderScreenContainer className="px-4 py-6">
      <div className="mx-auto max-w-[430px] space-y-6">
        <div className="space-y-4">
          <p className="text-[2rem] font-black tracking-tight text-primary">Hatid</p>
          <ProfileStepper current={2} />
          <div className="space-y-2">
            <h1 className="text-[2.35rem] font-black leading-tight tracking-tight text-slate-950">Set up your profile</h1>
            <p className="max-w-sm text-lg leading-8 text-slate-500">We need a few basic details to create your secure Hatid account and serve you better nationwide.</p>
          </div>
        </div>
        <RiderProfileForm />
        <InlineTrustBanner title="Your information is protected">
          Minimum rider info only is required in this phase. Payment, wallet, and dispatch systems remain prototype-limited.
        </InlineTrustBanner>
      </div>
    </RiderScreenContainer>
  );
}

export default function OnboardingProfilePageWithAuth() {
  return (
    <AuthGuard>
      <OnboardingProfilePage />
    </AuthGuard>
  );
}
