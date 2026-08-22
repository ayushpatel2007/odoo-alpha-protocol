'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { getActivities, type Activity } from '@/lib/api/activities';
import { ensureTripDays, addActivityToDay } from '@/lib/api/itinerary';
import { getTripById } from '@/lib/api/trips';
import type { Trip } from '@/types';

export default function TripActivitiesPage() {
  const params = useParams();
  const tripId = params?.id as string;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getTripById(tripId), getActivities()]).then(([t, a]) => { setTrip(t); setActivities(a); });
  }, [tripId]);

  const filtered = activities.filter(a => {
    const q = `${a.title} ${a.description}`.toLowerCase();
    return q.includes(query.toLowerCase()) && (category === 'All' || a.category === category);
  });
  const categories = ['All', ...Array.from(new Set(activities.map(a => a.category)))];

  async function addToTrip(activity: Activity) {
    if (!trip) return;
    setSaving(activity.id);
    try {
      const days = await ensureTripDays(trip.id, trip.startDate, trip.endDate);
      await addActivityToDay({ tripDayId: days[0].id, activityId: activity.id, title: activity.title, customCost: activity.estimatedCost });
      alert(`${activity.title} added to Day 1.`);
    } finally {
      setSaving(null);
    }
  }

  return (
    <PageContainer>
      <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back to trip</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-black text-slate-900">Activities</h1><p className="mt-1 text-sm text-slate-500">Discover experiences and add them to your itinerary.</p></div>
        <Link href={`/trips/${tripId}/itinerary`} className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold text-slate-950">View Itinerary</Link>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search activities..." className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(activity => (
          <article key={activity.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {activity.imageUrl ? <img src={activity.imageUrl} alt={activity.title} className="h-44 w-full object-cover" /> : <div className="h-44 bg-amber-50" />}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3"><h2 className="font-extrabold text-slate-900">{activity.title}</h2><span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">{activity.category}</span></div>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">{activity.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-700"><span>₹{activity.estimatedCost.toLocaleString('en-IN')}</span><span>{activity.durationHours}h · ★ {activity.rating.toFixed(1)}</span></div>
              <button disabled={saving === activity.id} onClick={() => addToTrip(activity)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-extrabold text-white disabled:opacity-50"><Plus className="h-4 w-4" />{saving === activity.id ? 'Adding...' : 'Add to Trip'}</button>
            </div>
          </article>
        ))}
      </div>
    </PageContainer>
  );
}
