import { createClient } from '@/lib/supabase/client';

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

export async function getTripDays(tripId: string): Promise<TripDay[]> {
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
  const supabase = createClient();
  const { error } = await supabase.from('trip_activities').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function moveTripActivity(id: string, tripDayId: string, sequenceOrder: number): Promise<TripActivity> {
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
