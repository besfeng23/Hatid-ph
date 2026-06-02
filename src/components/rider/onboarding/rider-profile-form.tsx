'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { PrimaryCta } from '../primary-cta';
import { ProfilePhotoUploader } from './profile-photo-uploader';

export function RiderProfileForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEmail(user?.email || '');
    setPhone(user?.phoneNumber || '');
    setFullName(user?.displayName || '');
    if (user && firestore) {
      getDoc(doc(firestore, 'users', user.uid)).then((snap) => {
        const data = snap.data();
        if (data) {
          setFullName(String(data.displayName || data.fullName || user.displayName || ''));
          setPhone(String(data.phoneNumber || user.phoneNumber || ''));
          setEmail(String(data.email || user.email || ''));
          setHomeCity(String(data.homeCity || ''));
        }
      }).catch(() => undefined);
    }
  }, [firestore, user]);

  const canSave = fullName.trim().length > 1 && phone.trim().length > 5 && email.includes('@');
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !firestore || !canSave) return;
    setIsSaving(true);
    try {
      await setDoc(doc(firestore, 'users', user.uid), { id: user.uid, displayName: fullName.trim(), fullName: fullName.trim(), phoneNumber: phone.trim(), email: email.trim(), homeCity: homeCity.trim(), riderProfileSetup: true }, { merge: true });
      toast({ title: 'Profile saved', description: 'Rider profile details were saved for this prototype.' });
      router.push('/');
    } catch {
      toast({ variant: 'destructive', title: 'Profile not saved', description: 'Please try again.' });
    } finally {
      setIsSaving(false);
    }
  }

  return <form onSubmit={handleSubmit} className="space-y-5"><ProfilePhotoUploader photoUrl={user?.photoURL} displayName={fullName} /><div className="space-y-4"><div className="space-y-2"><Label htmlFor="fullName">Full name *</Label><Input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-13 rounded-2xl" placeholder="Juan dela Cruz" /></div><div className="space-y-2"><Label htmlFor="phone">Phone *</Label><Input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} className="h-13 rounded-2xl" placeholder="+63 917 123 4567" /></div><div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-13 rounded-2xl" placeholder="rider@example.com" /></div><div className="space-y-2"><Label htmlFor="homeCity">Home city (optional)</Label><Input id="homeCity" value={homeCity} onChange={(event) => setHomeCity(event.target.value)} className="h-13 rounded-2xl" placeholder="Quezon City" /></div></div><PrimaryCta type="submit" disabled={!canSave || isSaving}>{isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save and continue'}</PrimaryCta></form>;
}
