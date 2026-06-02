import Link from 'next/link';
import { Briefcase, Heart, Home } from 'lucide-react';
const shortcuts = [{ label: 'Home', icon: Home }, { label: 'Work', icon: Briefcase }, { label: 'Favorites', icon: Heart }];
export function SavedShortcutsRow() { return <div className="flex gap-3">{shortcuts.map(({ label, icon: Icon }) => <Link key={label} href="/rider/saved-places" className="flex flex-1 flex-col items-center gap-2 rounded-3xl bg-white p-4 text-sm font-bold shadow-sm"><Icon className="h-5 w-5 text-primary" />{label}</Link>)}</div>; }
