'use client';

import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { getActivities, type Activity } from '@/lib/api/activities';

export default function ExploreActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => { getActivities().then(setActivities).catch(() => setActivities([])); }, []);

  const categories = ['All', ...Array.from(new Set(activities.map(a => a.category)))];
  const filtered = activities.filter(a => `${a.title} ${a.description}`.toLowerCase().includes(query.toLowerCase()) && (category === 'All' || a.category === category));

  return (
    <PageContainer>
      <div><h1 className="text-3xl font-black text-slate-900">Explore Activities</h1><p className="mt-1 text-sm text-slate-500">Find experiences to make your trip memorable.</p></div>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search activities..." className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">{categories.map(c => <option key={c}>{c}</option>)}</select>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(a => <article key={a.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {a.imageUrl ? <img src={a.imageUrl} alt={a.title} className="h-44 w-full object-cover" /> : <div className="h-44 bg-amber-50" />}
          <div className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="font-extrabold">{a.title}</h2><span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">{a.category}</span></div><p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">{a.description}</p><div className="mt-4 flex justify-between text-xs font-bold"><span>₹{a.estimatedCost.toLocaleString('en-IN')}</span><span>{a.durationHours}h · ★ {a.rating.toFixed(1)}</span></div></div>
        </article>)}
      </div>
    </PageContainer>
  );
}
