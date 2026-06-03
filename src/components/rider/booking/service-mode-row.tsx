import { Bookmark, Car } from 'lucide-react';

export function ServiceModeRow() {
  return (
    <div className="flex gap-3 overflow-x-auto px-1 pb-1">
      <div className="flex min-w-[10rem] items-center gap-2 rounded-[1.65rem] bg-primary px-5 py-4 text-base font-bold text-primary-foreground shadow-lg">
        <Car className="h-5 w-5" />
        Ride
      </div>
      <div className="flex min-w-[10rem] items-center gap-2 rounded-[1.65rem] border border-slate-200 bg-white px-5 py-4 text-base font-bold text-slate-500 shadow-sm">
        <Bookmark className="h-5 w-5" />
        Saved trips
      </div>
    </div>
  );
}
