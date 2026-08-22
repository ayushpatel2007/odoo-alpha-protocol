'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getActivities, type Activity } from '@/lib/api/activities';
import { addActivityToDay } from '@/lib/api/itinerary';

export function AddActivityDialog({
  open,
  tripDayId,
  onClose,
  onAdded,
}: {
  open: boolean;
  tripDayId: string | null;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Activity | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [time, setTime] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setCustomTitle('');
    setTime('');
    getActivities().then(setActivities).catch(() => setActivities([]));
  }, [open]);

  if (!open || !tripDayId) return null;

  const filtered = activities.filter((a) => `${a.title} ${a.category}`.toLowerCase().includes(query.toLowerCase()));

  async function save() {
    const title = selected?.title || customTitle.trim();
    if (!title) return;
    setSaving(true);
    try {
      if (!tripDayId) {
        return;
      }

      await addActivityToDay({
        tripDayId,
        activityId: selected?.id,
        title,
        startTime: time || undefined,
        customCost: selected?.estimatedCost || 0,
      });
      onAdded();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 md:items-center">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">Add Activity</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-5 space-y-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500"
          />

          <div className="max-h-52 space-y-2 overflow-y-auto">
            {filtered.map((activity) => (
              <button
                key={activity.id}
                onClick={() => { setSelected(activity); setCustomTitle(''); }}
                className={`w-full rounded-xl border p-3 text-left ${selected?.id === activity.id ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <p className="text-sm font-extrabold text-slate-900">{activity.title}</p>
                <p className="mt-1 text-xs text-slate-500">{activity.category} · ₹{activity.estimatedCost.toLocaleString('en-IN')}</p>
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Or create custom activity"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500"
            />
          </div>

          <button
            disabled={saving || (!selected && !customTitle.trim())}
            onClick={save}
            className="w-full rounded-xl bg-amber-500 py-3 text-sm font-extrabold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add to Itinerary'}
          </button>
        </div>
      </div>
    </div>
  );
}
