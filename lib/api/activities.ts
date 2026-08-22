import { createClient } from '@/lib/supabase/client';

export type Activity = {
  id: string;
  destinationId?: string | null;
  title: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  durationHours: number;
  estimatedCost: number;
  rating: number;
};

const mapActivity = (a: any): Activity => ({
  id: a.id,
  destinationId: a.destination_id,
  title: a.title,
  category: a.category,
  description: a.description || '',
  imageUrl: a.image_url,
  durationHours: Number(a.duration_hours || 0),
  estimatedCost: Number(a.estimated_cost || 0),
  rating: Number(a.rating || 0),
});

export async function getActivities(filters?: {
  query?: string;
  destinationId?: string;
  category?: string;
}): Promise<Activity[]> {
  const supabase = createClient();
  let query = supabase.from('activities').select('*').order('rating', { ascending: false });

  if (filters?.destinationId) query = query.eq('destination_id', filters.destinationId);
  if (filters?.category && filters.category !== 'All') query = query.eq('category', filters.category);

  if (filters?.query?.trim()) {
    const q = filters.query.trim().replace(/[%_,]/g, ' ');
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []).map(mapActivity);
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('activities').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapActivity(data) : null;
}
