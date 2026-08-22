import { createClient } from '@/lib/supabase/client';
import { Destination, SavedDestination } from '@/types';
import { INITIAL_DESTINATIONS } from '@/lib/mock-data/seed-catalog';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function getDestinations(filters?: { query?: string }): Promise<Destination[]> {
  const queryStr = filters?.query?.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    let query = supabase.from('destinations').select('*').order('popularity', { ascending: false });

    if (queryStr) {
      const q = queryStr.replace(/[%_,]/g, ' ');
      query = query.or(`city.ilike.%${q}%,country.ilike.%${q}%,region.ilike.%${q}%,description.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        city: d.city,
        country: d.country,
        region: d.region,
        description: d.description,
        imageUrl: d.image_url,
        estimatedBudget: Number(d.estimated_budget),
        rating: Number(d.rating),
        popularity: d.popularity,
      }));
    }
  }

  const all = INITIAL_DESTINATIONS;
  if (!queryStr) return all;

  return all.filter((d) =>
    `${d.city} ${d.country} ${d.region} ${d.description}`.toLowerCase().includes(queryStr)
  );
}

export async function getSavedDestinations(userId: string): Promise<Destination[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const effectiveUserId = authUser?.id || (userId && userId.length > 20 ? userId : null);

    if (effectiveUserId) {
      const { data, error } = await supabase
        .from('saved_destinations')
        .select('destination_id, destinations(*)')
        .eq('user_id', effectiveUserId);

      if (!error && data) {
        return data
          .map((sd: any) => sd.destinations)
          .filter(Boolean)
          .map((d: any) => ({
            id: d.id,
            city: d.city,
            country: d.country,
            region: d.region,
            description: d.description,
            imageUrl: d.image_url,
            estimatedBudget: Number(d.estimated_budget),
            rating: Number(d.rating),
            popularity: d.popularity,
          }));
      }
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('gt_saved_destinations');
    if (saved) {
      try {
        const ids: string[] = JSON.parse(saved);
        const all = await getDestinations();
        return all.filter((d) => ids.includes(d.id));
      } catch (e) {
        // continue
      }
    }
  }

  return [];
}

export async function toggleSaveDestination(userId: string, destinationId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const effectiveUserId = authUser?.id || (userId && userId.length > 20 ? userId : null);

    if (effectiveUserId) {
      const { data: existing } = await supabase
        .from('saved_destinations')
        .select('id')
        .eq('user_id', effectiveUserId)
        .eq('destination_id', destinationId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('saved_destinations')
          .delete()
          .eq('user_id', effectiveUserId)
          .eq('destination_id', destinationId);
        return false;
      }

      await supabase
        .from('saved_destinations')
        .insert({ user_id: effectiveUserId, destination_id: destinationId });
      return true;
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('gt_saved_destinations');
    let ids: string[] = saved ? JSON.parse(saved) : [];

    if (ids.includes(destinationId)) {
      ids = ids.filter((id) => id !== destinationId);
      localStorage.setItem('gt_saved_destinations', JSON.stringify(ids));
      return false;
    }

    ids.push(destinationId);
    localStorage.setItem('gt_saved_destinations', JSON.stringify(ids));
    return true;
  }

  return false;
}
