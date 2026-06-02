import AuthGuard from '@/components/auth-guard';
import { InlineTrustBanner } from '@/components/rider/inline-trust-banner';
import { RiderScreenContainer } from '@/components/rider/rider-screen-container';
import { ProfileStepper } from '@/components/rider/onboarding/profile-stepper';
import { RiderProfileForm } from '@/components/rider/onboarding/rider-profile-form';

function OnboardingProfilePage() { return <RiderScreenContainer className="px-4 py-6"><div className="mx-auto max-w-md space-y-6"><ProfileStepper current={2} /><div><p className="text-sm font-extrabold uppercase tracking-[0.3em] text-primary">Hatid rider</p><h1 className="mt-2 text-3xl font-black tracking-tight">Finish your rider profile</h1><p className="mt-2 text-muted-foreground">Minimum rider info only: name, phone, and email. Photo and home city are optional.</p></div><RiderProfileForm /><InlineTrustBanner>Birth date and gender are not required in this phase. Payment, wallet, and dispatch systems remain prototype-limited.</InlineTrustBanner></div></RiderScreenContainer>; }
export default function OnboardingProfilePageWithAuth() { return <AuthGuard><OnboardingProfilePage /></AuthGuard>; }
