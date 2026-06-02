import { Camera, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function ProfilePhotoUploader({ photoUrl, displayName }: { photoUrl?: string | null; displayName?: string }) {
  return <div className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4"><Avatar className="h-20 w-20 border-4 border-white shadow-sm">{photoUrl ? <AvatarImage src={photoUrl} alt={displayName || 'Rider'} /> : null}<AvatarFallback><User className="h-8 w-8" /></AvatarFallback></Avatar><div className="flex-1"><p className="font-bold">Profile photo</p><p className="text-sm text-muted-foreground">Optional for setup. Camera can be requested later if you choose to upload.</p><Button type="button" variant="outline" className="mt-3 rounded-full" disabled><Camera className="mr-2 h-4 w-4" /> Add later</Button></div></div>;
}
