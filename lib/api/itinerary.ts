import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export type TripDay = {
  id: string;
  tripId: string;
  dayNumber: number;
  date: string;
  destinationId?: string | null;
  notes?: string | null;
};

export type TripActivity = {
  id: string;
  tripDayId: string;
  activityId?: string | null;
  title: string;
  startTime?: string | null;
  endTime?: string | null;
  customNotes?: string | null;
  customCost: number;
  sequenceOrder: number;
  activity?: {
    id: string;
    title: string;
    category: string;
    description: string;
    imageUrl?: string | null;
    durationHours: number;
    estimatedCost: number;
    rating: number;
  } | null;
};

const mapDay = (d: any): TripDay => ({
  id: d.id,
  tripId: d.trip_id,
  dayNumber: d.day_number,
  date: d.date,
  destinationId: d.destination_id,
  notes: d.notes,
});

const mapActivity = (a: any): TripActivity => ({
  id: a.id,
  tripDayId: a.trip_day_id,
  activityId: a.activity_id,
  title: a.title,
  startTime: a.start_time,
  endTime: a.end_time,
  customNotes: a.custom_notes,
  customCost: Number(a.custom_cost || 0),
  sequenceOrder: a.sequence_order || 1,
  activity: a.activities
    ? {
      id: a.activities.id,
      title: a.activities.title,
      category: a.activities.category,
      description: a.activities.description || '',
      imageUrl: a.activities.image_url,
      durationHours: Number(a.activities.duration_hours || 0),
      estimatedCost: Number(a.activities.estimated_cost || 0),
      rating: Number(a.activities.rating || 0),
    }
    : null,
});

const dayStorageKey = (tripId: string) => `gt_trip_days_${tripId}`;
const activitiesStorageKey = 'gt_trip_activities';

function readLocalDays(tripId: string): TripDay[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(dayStorageKey(tripId));
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalDays(tripId: string, days: TripDay[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(dayStorageKey(tripId), JSON.stringify(days));
  }
}

function readLocalActivities(): TripActivity[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(activitiesStorageKey);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalActivities(activities: TripActivity[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(activitiesStorageKey, JSON.stringify(activities));
  }
}

function buildLocalDays(tripId: string, startDate: string, endDate: string): TripDay[] {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const days: TripDay[] = [];

  for (let cursor = new Date(start), n = 1; cursor <= end; cursor.setDate(cursor.getDate() + 1), n += 1) {
    days.push({
      id: `local-day-${tripId}-${n}`,
      tripId,
      dayNumber: n,
      date: cursor.toISOString().slice(0, 10),
      destinationId: null,
      notes: null,
    });
  }

  writeLocalDays(tripId, days);
  return days;
}

function findLocalTripIdByDayId(tripDayId: string): string | null {
  if (typeof window === 'undefined') return null;

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith('gt_trip_days_')) continue;

    try {
      const days: TripDay[] = JSON.parse(localStorage.getItem(key) || '[]');
      if (days.some((day) => day.id === tripDayId)) {
        return key.replace('gt_trip_days_', '');
      }
    } catch {
      // Ignore malformed local fallback data.
    }
  }

  return null;
}

export async function getTripDays(tripId: string): Promise<TripDay[]> {
  if (!isSupabaseConfigured()) {
    return readLocalDays(tripId);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('trip_days')
    .select('*')
    .eq('trip_id', tripId)
    .order('day_number', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(mapDay);
}

export async function ensureTripDays(
  tripId: string,
  startDate: string,
  endDate: string,
): Promise<TripDay[]> {
  const existing = await getTripDays(tripId);
  if (existing.length > 0) return existing;

  if (!isSupabaseConfigured()) {
    return buildLocalDays(tripId, startDate, endDate);
  }

  const supabase = createClient();

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const days: Array<{ trip_id: string; day_number: number; date: string }> = [];

  for (let cursor = new Date(start), n = 1; cursor <= end; cursor.setDate(cursor.getDate() + 1), n += 1) {
    days.push({
      trip_id: tripId,
      day_number: n,
      date: cursor.toISOString().slice(0, 10),
    });
  }

  const { data, error } = await supabase
    .from('trip_days')
    .insert(days)
    .select('*')
    .order('day_number', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(mapDay);
}

export async function getTripActivities(tripId: string): Promise<TripActivity[]> {
  if (!isSupabaseConfigured()) {
    const dayIds = new Set(readLocalDays(tripId).map((day) => day.id));
    return readLocalActivities()
      .filter((activity) => dayIds.has(activity.tripDayId))
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('trip_activities')
    .select('*, trip_days!inner(trip_id), activities(*)')
    .eq('trip_days.trip_id', tripId)
    .order('sequence_order', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(mapActivity);
}

export async function addActivityToDay(input: {
  tripDayId: string;
  activityId?: string;
  title: string;
  startTime?: string;
  endTime?: string;
  customNotes?: string;
  customCost?: number;
}): Promise<TripActivity> {
  if (!isSupabaseConfigured()) {
    const allActivities = readLocalActivities();
    const lastForDay = allActivities
      .filter((activity) => activity.tripDayId === input.tripDayId)
      .sort((a, b) => b.sequenceOrder - a.sequenceOrder)[0];
    const next: TripActivity = {
      id: `local-trip-activity-${Date.now()}`,
      tripDayId: input.tripDayId,
      activityId: input.activityId || null,
      title: input.title,
      startTime: input.startTime || null,
      endTime: input.endTime || null,
      customNotes: input.customNotes || null,
      customCost: input.customCost || 0,
      sequenceOrder: (lastForDay?.sequenceOrder || 0) + 1,
      activity: null,
    };

    writeLocalActivities([...allActivities, next]);
    return next;
  }

  const supabase = createClient();

  const { data: last } = await supabase
    .from('trip_activities')
    .select('sequence_order')
    .eq('trip_day_id', input.tripDayId)
    .order('sequence_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from('trip_activities')
    .insert({
      trip_day_id: input.tripDayId,
      activity_id: input.activityId || null,
      title: input.title,
      start_time: input.startTime || null,
      end_time: input.endTime || null,
      custom_notes: input.customNotes || null,
      custom_cost: input.customCost || 0,
      sequence_order: Number(last?.sequence_order || 0) + 1,
    })
    .select('*, activities(*)')
    .single();

  if (error) throw new Error(error.message);
  return mapActivity(data);
}

export async function updateTripActivity(
  id: string,
  updates: Partial<{
    title: string;
    startTime: string | null;
    endTime: string | null;
    customNotes: string | null;
    customCost: number;
    sequenceOrder: number;
  }>,
): Promise<TripActivity> {
  if (!isSupabaseConfigured()) {
    const allActivities = readLocalActivities();
    const updatedActivities = allActivities.map((activity) =>
      activity.id === id
        ? {
            ...activity,
            ...updates,
          }
        : activity,
    );
    const updated = updatedActivities.find((activity) => activity.id === id);

    if (!updated) {
      throw new Error('Activity not found.');
    }

    writeLocalActivities(updatedActivities);
    return updated;
  }

  const supabase = createClient();
  const payload: Record<string, unknown> = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.startTime !== undefined) payload.start_time = updates.startTime;
  if (updates.endTime !== undefined) payload.end_time = updates.endTime;
  if (updates.customNotes !== undefined) payload.custom_notes = updates.customNotes;
  if (updates.customCost !== undefined) payload.custom_cost = updates.customCost;
  if (updates.sequenceOrder !== undefined) payload.sequence_order = updates.sequenceOrder;

  const { data, error } = await supabase
    .from('trip_activities')
    .update(payload)
    .eq('id', id)
    .select('*, activities(*)')
    .single();

  if (error) throw new Error(error.message);
  return mapActivity(data);
}

export async function removeTripActivity(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    writeLocalActivities(readLocalActivities().filter((activity) => activity.id !== id));
    return;
  }

  const supabase = createClient();
  const { error } = await supabase.from('trip_activities').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function moveTripActivity(id: string, tripDayId: string, sequenceOrder: number): Promise<TripActivity> {
  if (!isSupabaseConfigured()) {
    const tripId = findLocalTripIdByDayId(tripDayId);
    const dayExists = tripId ? readLocalDays(tripId).some((day) => day.id === tripDayId) : false;

    if (!dayExists) {
      throw new Error('Trip day not found.');
    }

    return updateTripActivity(id, { tripDayId, sequenceOrder } as Partial<{
      title: string;
      startTime: string | null;
      endTime: string | null;
      customNotes: string | null;
      customCost: number;
      sequenceOrder: number;
    }>);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('trip_activities')
    .update({ trip_day_id: tripDayId, sequence_order: sequenceOrder })
    .eq('id', id)
    .select('*, activities(*)')
    .single();

  if (error) throw new Error(error.message);
  return mapActivity(data);
}
