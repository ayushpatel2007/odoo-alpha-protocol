import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function setTripPublic(tripId: string, isPublic: boolean): Promise<string | null> {
  const slug = isPublic
    ? `${tripId.slice(0, 8)}-${Math.random().toString(36).slice(2, 8)}`
    : null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('trips')
        .update({ is_public: isPublic, share_slug: slug })
        .eq('id', tripId);

      if (error) {
        if (error.message.includes('Invalid API key') || error.message.includes('apiKey')) {
          throw new Error('Supabase Configuration Error: Invalid API Key in .env.local. Please check NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
        }
        throw new Error(error.message);
      }
      return slug;
    } catch (err: any) {
      if (err.name === 'MissingSupabaseConfigError' || err.message?.includes('Invalid API key')) {
        console.warn('Supabase configuration notice:', err.message);
        // Fallback to local persistence below
      } else {
        throw err;
      }
    }
  }

  // Local fallback storage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('gt_user_trips');
    if (saved) {
      try {
        const trips = JSON.parse(saved);
        const updated = trips.map((t: any) =>
          t.id === tripId ? { ...t, isPublic, shareSlug: slug } : t
        );
        localStorage.setItem('gt_user_trips', JSON.stringify(updated));
      } catch (e) {
        // continue
      }
    }
  }

  return slug;
}

export async function getPublicTrip(slug: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('trips')
        .select('*, trip_destinations(sequence_order, destinations(*)), trip_days(*, trip_activities(*, activities(*))))')
        .eq('share_slug', slug)
        .eq('is_public', true)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase getPublicTrip fallback:', err);
    }
  }

  // Local fallback lookup
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('gt_user_trips');
    if (saved) {
      try {
        const trips = JSON.parse(saved);
        const found = trips.find((t: any) => t.shareSlug === slug && t.isPublic);
        if (found) return found;
      } catch (e) {
        // continue
      }
    }
  }

  return null;
}
