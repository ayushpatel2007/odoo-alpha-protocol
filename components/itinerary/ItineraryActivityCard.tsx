'use client';

import { Clock3, IndianRupee, MapPin, Pencil, Trash2 } from 'lucide-react';
import type { TripActivity } from '@/lib/api/itinerary';

export function ItineraryActivityCard({
  activity,
  onDelete,
}: {
  activity: TripActivity;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mt-1 h-10 w-10 shrink-0 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
        <MapPin className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900">{activity.title}</h3>
            <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
              {activity.startTime && (
                <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{activity.startTime.slice(0, 5)}{activity.endTime ? ` – ${activity.endTime.slice(0, 5)}` : ''}</span>
              )}
              {activity.customCost > 0 && (
                <span className="inline-flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />₹{activity.customCost.toLocaleString('en-IN')}</span>
              )}
            </div>
          </div>
          <button
            onClick={() => onDelete(activity.id)}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${activity.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        {activity.activity?.category && (
          <span className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
            {activity.activity.category}
          </span>
        )}
        {activity.customNotes && <p className="mt-2 text-xs leading-relaxed text-slate-500">{activity.customNotes}</p>}
      </div>
    </div>
  );
}
