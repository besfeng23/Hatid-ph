
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Banknote, ChevronRight, CreditCard, Landmark, PlusCircle, Smartphone, Wallet } from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/auth-guard';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';


function PaymentPage() {
    const { toast } = useToast();
    const [isCashingOut, setIsCashingOut] = useState(false);

    const handleCashOut = () => {
        setIsCashingOut(true);
        // Simulate a secure transaction
        setTimeout(() => {
            setIsCashingOut(false);
            toast({
                title: "Cash Out Successful!",
                description: "Your earnings have been transferred to your linked account. It may take 1-3 business days to reflect.",
            });
        }, 2000);
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
            <div className="space-y-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
                <p className="text-muted-foreground">
                    Manage your saved cards, wallets, and cash out your earnings.
                </p>
            </div>

            <div className="space-y-8">
                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="text-primary" />
                            <span>Hatid Wallet</span>
                        </CardTitle>
                        <CardDescription>Your personal wallet for seamless payments and earnings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Current Balance</p>
                            <p className="text-4xl font-bold">₱0.00</p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button size="lg" className="h-12" disabled>
                                <PlusCircle className="mr-2" /> Add Funds
                            </Button>
                            <Button size="lg" variant="secondary" className="h-12" onClick={handleCashOut} disabled={isCashingOut}>
                                {isCashingOut ? (
                                    <Loader2 className="mr-2 animate-spin" />
                                ) : (
                                    <Banknote className="mr-2" />
                                )}
                                Cash Out Earnings
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Options</CardTitle>
                        <CardDescription>Add or manage your payment methods for rides.</CardDescription>
                    </CardHeader>
                    <CardContent className="divide-y divide-border -mx-6">
                        <PaymentOptionItem
                            icon={<CreditCard />}
                            title="Credit / Debit Card"
                            description="Link your Visa, Mastercard, or other cards."
                            href="#"
                        />
                        <PaymentOptionItem
                            icon={<Smartphone />}
                            title="Mobile Wallets"
                            description="Connect GCash, PayMaya, and more."
                            href="#"
                        />
                         <div className="flex items-center gap-4 py-4 px-6">
                            <div className="text-primary"><Landmark/></div>
                            <div className="flex-1">
                                <h4 className="font-semibold">Cash</h4>
                                <p className="text-sm text-muted-foreground">Cash is automatically available for all rides.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function PaymentOptionItem({ icon, title, description, href }: { icon: React.ReactNode, title: string, description: string, href: string }) {
    return (
        <Link href={href} className="flex items-center gap-4 py-4 px-6 hover:bg-secondary/50 transition-colors">
            <div className="text-primary">{icon}</div>
            <div className="flex-1">
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ChevronRight className="text-muted-foreground" />
        </Link>
    )
}


export default function PaymentPageWithAuth() {
    return (
        <AuthGuard>
            <PaymentPage />
        </AuthGuard>
    )
}
