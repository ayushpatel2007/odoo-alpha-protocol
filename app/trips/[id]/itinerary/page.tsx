'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CalendarRange, WalletCards } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { getTripById } from '@/lib/api/trips';
import { ensureTripDays, getTripActivities, removeTripActivity, type TripActivity, type TripDay } from '@/lib/api/itinerary';
import { ItineraryDay } from '@/components/itinerary/ItineraryDay';
import { AddActivityDialog } from '@/components/itinerary/AddActivityDialog';
import type { Trip } from '@/types';

export default function ItineraryPage() {
  const params = useParams();
  const tripId = params?.id as string;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<TripDay[]>([]);
  const [activities, setActivities] = useState<TripActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  async function load() {
    if (!tripId) return;
    setLoading(true);
    try {
      const found = await getTripById(tripId);
      setTrip(found);
      if (found) {
        const tripDays = await ensureTripDays(tripId, found.startDate, found.endDate);
        setDays(tripDays);
        setActivities(await getTripActivities(tripId));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [tripId]);

  async function deleteActivity(id: string) {
    await removeTripActivity(id);
    await load();
  }

  if (loading) return <PageContainer><div className="flex min-h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" /></div></PageContainer>;
  if (!trip) return <PageContainer><p className="py-20 text-center font-bold">Trip not found.</p></PageContainer>;

  return (
    <PageContainer>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back to trip</Link>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Itinerary</h1>
          <p className="mt-1 text-sm text-slate-500">{trip.name} · {trip.destinations?.map(d => d.city).join(' → ')}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/trips/${tripId}/calendar`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold"><CalendarRange className="h-4 w-4" /> Calendar</Link>
          <Link href={`/trips/${tripId}/budget`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold"><WalletCards className="h-4 w-4" /> Budget</Link>
        </div>
      </div>

      <div className="space-y-5">
        {days.map(day => (
          <ItineraryDay
            key={day.id}
            day={day}
            activities={activities.filter(a => a.tripDayId === day.id)}
            onAdd={() => setSelectedDay(day.id)}
            onDelete={deleteActivity}
          />
        ))}
      </div>

      <AddActivityDialog
        open={Boolean(selectedDay)}
        tripDayId={selectedDay}
        onClose={() => setSelectedDay(null)}
        onAdded={load}
      />
    </PageContainer>
  );
}
