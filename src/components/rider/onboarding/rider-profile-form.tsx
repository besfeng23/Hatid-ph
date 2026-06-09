
'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseUser } from '@/supabase/hooks';
import { PrimaryCta } from '../primary-cta';
import { SecondaryCta } from '../secondary-cta';
import { ProfilePhotoUploader } from './profile-photo-uploader';
import { SupabaseContext } from '@/supabase/context';

export function RiderProfileForm() {
  const { user } = useSupabaseUser();
  const { supabase } = useContext(SupabaseContext);
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    if (user && supabase) {
        supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (data) {
            setFullName(data.full_name || '');
            setHomeCity(data.home_city || '');
          }
        })
        .catch(() => undefined);
    }
  }, [supabase, user]);

  const canSave = fullName.trim().length > 1 && phone.trim().length > 5 && email.includes('@');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !supabase || !canSave) return;
    setIsSaving(true);
    try {
      await supabase.from('profiles').upsert(
        {
          id: user.id,
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          home_city: homeCity.trim(),
          rider_profile_setup: true,
        },
      );
      router.push('/');
    } catch(e) {
        console.error(e);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ProfilePhotoUploader photoUrl={user?.user_metadata.avatar_url} displayName={fullName} />
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
