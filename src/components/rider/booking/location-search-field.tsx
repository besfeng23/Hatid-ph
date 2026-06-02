'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
export function LocationSearchField({ value, onChange, placeholder = 'Search drop-off' }: { value: string; onChange: (value: string) => void; placeholder?: string }) { return <div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" /><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-14 rounded-2xl bg-white pl-12 text-base shadow-sm" /></div>; }
