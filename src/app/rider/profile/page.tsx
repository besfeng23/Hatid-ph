'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/auth-guard';
import { InlineTrustBanner } from '@/components/rider/inline-trust-banner';
import { PrimaryCta } from '@/components/rider/primary-cta';
import { RiderScreenContainer } from '@/components/rider/rider-screen-container';
import { RiderTopBar } from '@/components/rider/rider-top-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { getMyRiderProfile, saveMyRiderProfile, type RiderProfileRpcClient } from '@/lib/rider/rider-profile';

function RiderProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      setIsLoading(true);
      setError(null);
      const result = await getMyRiderProfile(createBrowserSupabaseClient() as unknown as RiderProfileRpcClient);

      if (!isActive) {
        return;
      }

      setIsLoading(false);

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setDisplayName(result.data?.display_name ?? '');
      setPhone(result.data?.phone ?? '');
      setStatus(result.data?.status ?? null);
    }

    loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const result = await saveMyRiderProfile(createBrowserSupabaseClient() as unknown as RiderProfileRpcClient, {
      display_name: displayName,
      phone,
    });

    setIsSaving(false);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setDisplayName(result.data.display_name ?? '');
    setPhone(result.data.phone ?? '');
    setStatus(result.data.status ?? null);
    setSuccess('Your rider profile was saved.');
  };

  return (
    <RiderScreenContainer className="pb-6">
      <RiderTopBar showBack title="Rider profile" subtitle="Audited profile details" />
      <div className="space-y-4 px-4">
        <InlineTrustBanner>
          This page reads and saves rider profile fields only through the approved Supabase RPCs. It does not enable booking, dispatch, wallet, payments, driver, admin, KYC, or safety workflows.
        </InlineTrustBanner>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Profile details</CardTitle>
            <CardDescription>Display name and phone are saved through the audited rider profile RPC.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? <p className="text-sm text-muted-foreground">Loading rider profile…</p> : null}
            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
            {success ? <p className="text-sm font-medium text-green-700">{success}</p> : null}

            <div className="space-y-2">
              <Label htmlFor="display_name">Display name</Label>
              <Input id="display_name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} disabled={isLoading || isSaving} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} disabled={isLoading || isSaving} />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <p className="rounded-2xl border bg-muted px-3 py-2 text-sm text-muted-foreground">{status || 'Not returned yet'}</p>
            </div>

            <PrimaryCta onClick={handleSave} disabled={isLoading || isSaving}>{isSaving ? 'Saving…' : 'Save rider profile'}</PrimaryCta>
            <Button type="button" variant="outline" className="w-full rounded-full" disabled>
              Production ride features are not enabled here
            </Button>
          </CardContent>
        </Card>
      </div>
    </RiderScreenContainer>
  );
}

export default function RiderProfilePageWithAuth() {
  return (
    <AuthGuard>
      <RiderProfilePage />
    </AuthGuard>
  );
}
