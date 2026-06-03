import { Camera, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SecondaryCta } from '../secondary-cta';

export function ProfilePhotoUploader({ photoUrl, displayName }: { photoUrl?: string | null; displayName?: string }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24 border-4 border-white bg-slate-100 shadow-sm">
          {photoUrl ? <AvatarImage src={photoUrl} alt={displayName || 'Rider'} /> : null}
          <AvatarFallback className="bg-slate-100 text-slate-400">
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <p className="text-[1.1rem] font-extrabold tracking-tight text-slate-950">Add a profile photo</p>
          <p className="text-sm leading-6 text-slate-500">Help drivers and support identify you more easily. Camera access can still be requested later.</p>
          <SecondaryCta type="button" className="mt-1 h-11 rounded-2xl px-4 py-0 text-sm" disabled>
            <Camera className="mr-2 h-4 w-4" />
            Add photo later
          </SecondaryCta>
        </div>
      </div>
    </div>
  );
}
