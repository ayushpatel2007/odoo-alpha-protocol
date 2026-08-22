'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock3 } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { getTripById } from '@/lib/api/trips';
import { ensureTripDays, getTripActivities, type TripActivity, type TripDay } from '@/lib/api/itinerary';
import type { Trip } from '@/types';

export default function TripCalendarPage() {
  const params = useParams();
  const tripId = params?.id as string;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<TripDay[]>([]);
  const [activities, setActivities] = useState<TripActivity[]>([]);

  useEffect(() => {
    async function load() {
      const t = await getTripById(tripId);
      if (!t) return;
      setTrip(t);
      setDays(await ensureTripDays(tripId, t.startDate, t.endDate));
      setActivities(await getTripActivities(tripId));
    }
    load().catch(console.error);
  }, [tripId]);

  return (
    <PageContainer>
      <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back to trip</Link>
      <div className="mt-4"><h1 className="text-3xl font-black text-slate-900">Trip Calendar</h1><p className="mt-1 text-sm text-slate-500">{trip?.name || 'Loading...'}</p></div>
      <div className="mt-6 space-y-3">
        {days.map(day => {
          const dayActivities = activities.filter(a => a.tripDayId === day.id);
          return (
            <section key={day.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-700"><CalendarDays className="h-5 w-5" /></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-amber-600">Day {day.dayNumber}</p><h2 className="font-extrabold text-slate-900">{new Date(`${day.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2></div>
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {dayActivities.length === 0 ? <p className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">No activities scheduled.</p> :
                  dayActivities.map(a => <div key={a.id} className="rounded-2xl bg-slate-50 p-4"><p className="font-bold text-slate-900">{a.title}</p>{a.startTime && <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />{a.startTime.slice(0,5)}{a.endTime ? ` – ${a.endTime.slice(0,5)}` : ''}</p>}</div>)}
              </div>
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
}
