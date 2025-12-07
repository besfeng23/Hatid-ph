'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Phone } from 'lucide-react';

export function DeliveryRequestForm() {
  return (
    <div className="space-y-4 pt-4">
      <div className="rounded-lg border bg-secondary/50 p-4 space-y-4">
        <h4 className="font-semibold">Sender Details</h4>
        <div className="space-y-2">
            <Label htmlFor="sender-name">Name</Label>
             <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16}/>
                <Input id="sender-name" placeholder="Juan Dela Cruz" className="pl-10"/>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="sender-phone">Phone</Label>
             <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16}/>
                <Input id="sender-phone" placeholder="+63 917 123 4567" className="pl-10"/>
            </div>
        </div>
      </div>

       <div className="rounded-lg border bg-secondary/50 p-4 space-y-4">
        <h4 className="font-semibold">Recipient Details</h4>
        <div className="space-y-2">
            <Label htmlFor="recipient-name">Name</Label>
             <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16}/>
                <Input id="recipient-name" placeholder="Maria Clara" className="pl-10"/>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="recipient-phone">Phone</Label>
             <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16}/>
                <Input id="recipient-phone" placeholder="+63 917 987 6543" className="pl-10"/>
            </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Delivery Instructions</Label>
        <Textarea
          id="instructions"
          placeholder="e.g., Leave at the lobby, look for Jane."
        />
      </div>
    </div>
  );
}
