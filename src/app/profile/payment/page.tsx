
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Landmark, Shield, Smartphone, Wallet } from 'lucide-react';
import AuthGuard from '@/components/auth-guard';

function PaymentPage() {
    return (
        <div className="container mx-auto max-w-3xl p-4 md:p-6 lg:p-8">
            <div className="mb-8 space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
                <p className="text-muted-foreground">
                    Review Hatid&apos;s current prototype payment UI and planned payment rails. Live rider funds,
                    live charging, wallet balances, and payouts are not enabled in this build.
                </p>
            </div>

            <div className="space-y-8">
                <Card className="border-primary/20 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="text-primary" />
                            <span>Payments are in demo mode</span>
                        </CardTitle>
                        <CardDescription>
                            This screen is intentionally conservative. Hatid does not yet operate a live rider wallet,
                            live top ups, live stored value, cash out, or live provider charging from this UI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <StatusCard
                            label="Stored balance"
                            status="Not enabled"
                            description="Any balance shown in prototype flows is display-only and not ledger-derived."
                        />
                        <StatusCard
                            label="Cash out / send money"
                            status="Removed"
                            description="Rider-facing transfer and payout actions stay off until regulated controls exist."
                        />
                        <StatusCard
                            label="Live provider charging"
                            status="Not enabled"
                            description="Cards, e-wallets, and bank rails are not being charged by Hatid in this prototype."
                        />
                        <StatusCard
                            label="Current payment truth"
                            status="Preview only"
                            description="Cash can be shown as a simple ride payment preference, but money operations are not live."
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment rails and rollout status</CardTitle>
                        <CardDescription>
                            Keep the UI honest: show what exists, mark what is planned, and do not imply operational
                            money movement before the backend is authoritative.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <PaymentOptionRow
                            icon={<Landmark />}
                            title="Cash"
                            description="Can be shown as a prototype ride payment preference. This is not a live PSP integration."
                            status="Preview only"
                        />
                        <PaymentOptionRow
                            icon={<CreditCard />}
                            title="Credit / Debit Card"
                            description="Planned after provider integration, verified webhooks, ledger posting, and reconciliation exist."
                            status="Not enabled"
                        />
                        <PaymentOptionRow
                            icon={<Smartphone />}
                            title="GCash / Maya and other mobile wallets"
                            description="Future adapters only. No live mobile-wallet charging is active in this prototype."
                            status="Not enabled"
                        />
                        <PaymentOptionRow
                            icon={<Wallet />}
                            title="SpeedCash adapter candidate"
                            description="Future partner redirect candidate only. Requires API docs, verified webhooks, settlement rules, reconciliation, and legal/compliance review before live use."
                            status="Under review"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="text-primary" />
                            <span>Before Hatid can ship live payments</span>
                        </CardTitle>
                        <CardDescription>
                            These controls are required before any UI can honestly look like a live wallet or live payment hub.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal space-y-3 pl-5 text-sm text-muted-foreground">
                            <li>Provider integration with clear settlement, refund, and reversal behavior.</li>
                            <li>Signature-verified, replay-safe webhooks and idempotent backend event handling.</li>
                            <li>Ledger-derived balances owned by the server, not the client.</li>
                            <li>Reconciliation, admin visibility, and failure states for pending, failed, and reversed payments.</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatusCard({
    label,
    status,
    description,
}: {
    label: string;
    status: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border bg-secondary/40 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-semibold">{label}</p>
                <StatusPill>{status}</StatusPill>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

function PaymentOptionRow({
    icon,
    title,
    description,
    status,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    status: string;
}) {
    return (
        <div className="flex items-start gap-4 rounded-2xl border p-4">
            <div className="mt-1 text-primary">{icon}</div>
            <div className="flex-1 space-y-1">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <h4 className="font-semibold">{title}</h4>
                    <StatusPill>{status}</StatusPill>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

function StatusPill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            {children}
        </span>
    );
}

export default function PaymentPageWithAuth() {
    return (
        <AuthGuard>
            <PaymentPage />
        </AuthGuard>
    );
}
