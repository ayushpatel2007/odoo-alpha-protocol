'use client';

import { CalendarDays, Plus } from 'lucide-react';
import type { TripActivity, TripDay } from '@/lib/api/itinerary';
import { ItineraryActivityCard } from './ItineraryActivityCard';

export function ItineraryDay({
  day,
  activities,
  onAdd,
  onDelete,
}: {
  day: TripDay;
  activities: TripActivity[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
            <CalendarDays className="h-4 w-4" />
            Day {day.dayNumber}
          </div>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900">
            {new Date(`${day.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
        </div>
        <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-amber-400">
          <Plus className="h-4 w-4" /> Add Activity
        </button>
      </div>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-sm font-bold text-slate-700">Nothing planned yet</p>
            <p className="mt-1 text-xs text-slate-500">Add an activity to start this day.</p>
          </div>
        ) : (
          activities.map((activity) => <ItineraryActivityCard key={activity.id} activity={activity} onDelete={onDelete} />)
        )}
      </div>
    </section>
  );
}
