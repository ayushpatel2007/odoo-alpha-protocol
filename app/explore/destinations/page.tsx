'use client';

import { useEffect, useState } from 'react';
import { Heart, MapPin } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { getDestinations, toggleSaveDestination } from '@/lib/api/destinations';
import { useAuth } from '@/components/auth/AuthContext';
import type { Destination } from '@/types';

export default function ExploreDestinationsPage() {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => { getDestinations().then(setDestinations).catch(() => setDestinations([])); }, []);

  const filtered = destinations.filter(d => `${d.city} ${d.country} ${d.description}`.toLowerCase().includes(query.toLowerCase()));

  async function toggle(id: string) {
    if (!user) return;
    const isSaved = await toggleSaveDestination(user.id, id);
    setSaved(s => isSaved ? [...s, id] : s.filter(x => x !== id));
  }

  return (
    <PageContainer>
      <div><h1 className="text-3xl font-black text-slate-900">Explore Destinations</h1><p className="mt-1 text-sm text-slate-500">Discover places for your next journey.</p></div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search cities or countries..." className="mt-6 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(d => <article key={d.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative"><img src={d.imageUrl} alt={d.city} className="h-48 w-full object-cover" /><button onClick={() => toggle(d.id)} className={`absolute right-3 top-3 rounded-full p-2 shadow ${saved.includes(d.id) ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-600'}`} aria-label="Save destination"><Heart className="h-4 w-4" fill={saved.includes(d.id) ? 'currentColor' : 'none'} /></button></div>
          <div className="p-5"><h2 className="text-lg font-extrabold">{d.city}, {d.country}</h2><p className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-600"><MapPin className="h-3.5 w-3.5" />{d.region || 'International'}</p><p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-500">{d.description}</p><div className="mt-4 flex justify-between text-xs font-bold"><span>From ₹{d.estimatedBudget.toLocaleString('en-IN')}</span><span>★ {d.rating.toFixed(1)}</span></div></div>
        </article>)}
      </div>
    </PageContainer>
  );
}
