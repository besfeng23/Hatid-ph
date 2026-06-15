'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/platform/provider';
import { useToast } from '@/hooks/use-toast';
import { PrimaryCta } from '../primary-cta';
import { SecondaryCta } from '../secondary-cta';
import { ProfilePhotoUploader } from './profile-photo-uploader';

export function RiderProfileForm() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [homeCity, setHomeCity] = useState('');

  useEffect(() => {
    setEmail(user?.email || '');
    setPhone(user?.phoneNumber || user?.phone || '');
    setFullName(user?.displayName || user?.name || '');
  }, [user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast({
      title: 'Profile persistence paused',
      description: 'Profile saving requires the authenticated server profile boundary and remains unavailable in this prototype.',
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ProfilePhotoUploader photoUrl={user?.photoURL} displayName={fullName} />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name *</Label>
            <Input id="fullName" value={fullName} readOnly disabled className="h-14 rounded-[1.35rem] border-slate-200" placeholder="Not provided" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile number *</Label>
            <Input id="phone" value={phone} readOnly disabled className="h-14 rounded-[1.35rem] border-slate-200" placeholder="Not provided" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address *</Label>
            <Input id="email" type="email" value={email} readOnly disabled className="h-14 rounded-[1.35rem] border-slate-200" placeholder="Not provided" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="homeCity">City / home base (optional)</Label>
            <Input id="homeCity" value={homeCity} readOnly disabled className="h-14 rounded-[1.35rem] border-slate-200" placeholder="Not yet connected" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <PrimaryCta type="submit" disabled>Profile saving is not yet available</PrimaryCta>
        <SecondaryCta type="button" onClick={() => router.push('/')}>
          Save and finish later
        </SecondaryCta>
      </div>
    </form>
  );
}
