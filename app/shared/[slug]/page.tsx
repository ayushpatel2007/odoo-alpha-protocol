'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, WalletCards } from 'lucide-react';
import { getPublicTrip } from '@/lib/api/sharing';

export default function SharedTripPage({ params }: { params: { slug: string } }) {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicTrip(params.slug).then(setTrip).catch(() => setTrip(null)).finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <main className="min-h-screen bg-slate-50 p-8 text-center">Loading shared trip...</main>;
  if (!trip) return <main className="min-h-screen bg-slate-50 p-8 text-center"><h1 className="text-2xl font-black">Trip not found</h1><p className="mt-2 text-sm text-slate-500">This trip may be private or the link may have expired.</p></main>;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <div className="overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
          {trip.cover_image_url && <img src={trip.cover_image_url} alt={trip.name} className="h-64 w-full object-cover opacity-60" />}
          <div className="p-7">
            <h1 className="text-3xl font-black">{trip.name}</h1>
            <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-slate-300">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{trip.start_date} → {trip.end_date}</span>
              <span className="inline-flex items-center gap-1.5"><WalletCards className="h-4 w-4" />₹{Number(trip.estimated_budget || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <section className="mt-6 space-y-4">
          {(trip.trip_days || []).sort((a: any, b: any) => a.day_number - b.day_number).map((day: any) => (
            <article key={day.id} className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Day {day.day_number}</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">{new Date(`${day.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
              <div className="mt-4 space-y-2">
                {(day.trip_activities || []).sort((a: any, b: any) => (a.sequence_order || 0) - (b.sequence_order || 0)).map((a: any) => (
                  <div key={a.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-extrabold text-slate-900">{a.title}</p>
                    {a.start_time && <p className="mt-1 text-xs text-slate-500">{a.start_time.slice(0, 5)}{a.end_time ? ` – ${a.end_time.slice(0, 5)}` : ''}</p>}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
