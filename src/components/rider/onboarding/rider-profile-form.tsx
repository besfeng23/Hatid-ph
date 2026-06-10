'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEmail(user?.email || '');
    setPhone(user?.phoneNumber || user?.phone || '');
    setFullName(user?.displayName || user?.name || '');
  }, [user]);

  const canSave = fullName.trim().length > 1 && phone.trim().length > 5 && email.includes('@');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    setIsSaving(true);
    try {
      toast({
        title: 'Profile persistence paused',
        description: 'Rider profile saving will be restored when Supabase profile storage is connected.',
      });
      router.push('/');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ProfilePhotoUploader photoUrl={user?.photoURL} displayName={fullName} />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name *</Label>
            <Input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-14 rounded-[1.35rem] border-slate-200" placeholder="Maria Santos" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile number *</Label>
            <Input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} className="h-14 rounded-[1.35rem] border-slate-200" placeholder="+63 917 123 4567" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address *</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-14 rounded-[1.35rem] border-slate-200" placeholder="rider@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="homeCity">City / home base (optional)</Label>
            <Input id="homeCity" value={homeCity} onChange={(event) => setHomeCity(event.target.value)} className="h-14 rounded-[1.35rem] border-slate-200" placeholder="Quezon City" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <PrimaryCta type="submit" disabled={!canSave || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Continue'
          )}
        </PrimaryCta>
        <SecondaryCta type="button" onClick={() => router.push('/')}>
          Save and finish later
        </SecondaryCta>
      </div>
    </form>
  );
}
