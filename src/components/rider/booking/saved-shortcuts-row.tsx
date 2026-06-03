import Link from 'next/link';
import { Briefcase, Heart, Home } from 'lucide-react';

const shortcuts = [
  { label: 'Home', icon: Home },
  { label: 'Work', icon: Briefcase },
  { label: 'Favorites', icon: Heart },
];

export function SavedShortcutsRow() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {shortcuts.map(({ label, icon: Icon }) => (
        <Link
          key={label}
          href="/rider/saved-places"
          className="flex min-h-[8.25rem] flex-col items-center justify-center gap-3 rounded-[1.9rem] border border-slate-200 bg-white px-3 py-4 text-center shadow-sm"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-[1.05rem] font-extrabold tracking-tight text-slate-950">{label}</span>
        </Link>
      ))}
    </div>
  );
}
