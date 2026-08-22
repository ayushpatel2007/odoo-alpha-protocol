import { createClient } from '@/lib/supabase/client';
import { Destination, SavedDestination } from '@/types';
import { INITIAL_DESTINATIONS } from '@/lib/mock-data/seed-catalog';

export async function getDestinations(): Promise<Destination[]> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('popularity', { ascending: false });

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

  return INITIAL_DESTINATIONS;
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  const all = await getDestinations();
  return all.find((d) => d.id === id) || null;
}

export async function searchDestinations(query: string, region?: string): Promise<Destination[]> {
  const all = await getDestinations();
  return all.filter((d) => {
    const matchesQuery =
      !query ||
      d.city.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase());
    const matchesRegion = !region || region === 'All' || d.region === region;
    return matchesQuery && matchesRegion;
  });
}

export async function getSavedDestinations(userId: string): Promise<Destination[]> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    const { data: savedRows } = await supabase
      .from('saved_destinations')
      .select('destination_id, destinations(*)')
      .eq('user_id', userId);

    if (savedRows && savedRows.length > 0) {
      return savedRows
        .map((r: any) => r.destinations)
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
        }));
    }
  }

  // Fallback storage
  if (typeof window !== 'undefined') {
    const savedIdsRaw = localStorage.getItem(`gt_saved_destinations_${userId}`);
    if (savedIdsRaw) {
      try {
        const savedIds: string[] = JSON.parse(savedIdsRaw);
        return INITIAL_DESTINATIONS.filter((d) => savedIds.includes(d.id));
      } catch (e) {
        // continue
      }
    }
  }

  // Default saved Paris & Tokyo for initial presentation
  return [INITIAL_DESTINATIONS[0], INITIAL_DESTINATIONS[1]];
}

export async function toggleSaveDestination(userId: string, destinationId: string): Promise<boolean> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    const { data: existing } = await supabase
      .from('saved_destinations')
      .select('id')
      .eq('user_id', userId)
      .eq('destination_id', destinationId)
      .single();

    if (existing) {
      await supabase.from('saved_destinations').delete().eq('id', existing.id);
      return false; // Removed
    } else {
      await supabase.from('saved_destinations').insert({
        user_id: userId,
        destination_id: destinationId,
      });
      return true; // Added
    }
  }

  // Local fallback toggle
  if (typeof window !== 'undefined') {
    const savedIdsRaw = localStorage.getItem(`gt_saved_destinations_${userId}`);
    let savedIds: string[] = savedIdsRaw ? JSON.parse(savedIdsRaw) : [INITIAL_DESTINATIONS[0].id, INITIAL_DESTINATIONS[1].id];
    let isSaved = false;
    if (savedIds.includes(destinationId)) {
      savedIds = savedIds.filter((id) => id !== destinationId);
      isSaved = false;
    } else {
      savedIds.push(destinationId);
      isSaved = true;
    }
    localStorage.setItem(`gt_saved_destinations_${userId}`, JSON.stringify(savedIds));
    return isSaved;
  }

  return true;
}
