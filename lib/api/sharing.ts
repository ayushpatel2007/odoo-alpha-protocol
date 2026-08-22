import { createClient } from '@/lib/supabase/client';

export async function setTripPublic(tripId: string, isPublic: boolean): Promise<string | null> {
  const supabase = createClient();
  const slug = isPublic
    ? `${tripId.slice(0, 8)}-${Math.random().toString(36).slice(2, 8)}`
    : null;

  const { error } = await supabase
    .from('trips')
    .update({ is_public: isPublic, share_slug: slug })
    .eq('id', tripId);

  if (error) throw new Error(error.message);
  return slug;
}

export async function getPublicTrip(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('trips')
    .select('*, trip_destinations(sequence_order, destinations(*)), trip_days(*, trip_activities(*, activities(*)))')
    .eq('share_slug', slug)
    .eq('is_public', true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
