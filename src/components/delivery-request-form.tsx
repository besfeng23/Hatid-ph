'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Phone } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function DeliveryRequestForm() {
  // In a real app, these would be pulled from the logged-in user's profile
  const senderName = "Juan Dela Cruz";
  const senderPhone = "+63 917 123 4567";

  return (
    <div className="space-y-4 pt-4">
      <div className="rounded-lg border bg-secondary/50 p-4 space-y-4">
        <h4 className="font-semibold">Sender Details</h4>
        <div className="space-y-2">
            <Label htmlFor="sender-name">Name</Label>
             <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16}/>
                <Input id="sender-name" value={senderName} readOnly className="pl-10 bg-muted/50 cursor-not-allowed"/>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="sender-phone">Phone</Label>
             <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16}/>
                <Input id="sender-phone" value={senderPhone} readOnly className="pl-10 bg-muted/50 cursor-not-allowed"/>
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

       <div className="rounded-lg border bg-secondary/50 p-4 space-y-4">
            <h4 className="font-semibold">Package Details</h4>
            <div className="space-y-2">
                <Label>Package Type/Size</Label>
                <RadioGroup defaultValue="document" className="grid grid-cols-2 gap-4">
                    <div>
                        <RadioGroupItem value="document" id="document" className="peer sr-only" />
                        <Label htmlFor="document" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            Document
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="small-box" id="small-box" className="peer sr-only" />
                        <Label htmlFor="small-box" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            Small Box
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="food" id="food" className="peer sr-only" />
                        <Label htmlFor="food" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            Food
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="other" id="other" className="peer sr-only" />
                        <Label htmlFor="other" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            Other
                        </Label>
                    </div>
                </RadioGroup>
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
