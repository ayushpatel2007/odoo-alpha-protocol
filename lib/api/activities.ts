import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

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

const FALLBACK_ACTIVITIES: Activity[] = [
  {
    id: 'act-paris-eiffel',
    destinationId: '11111111-1111-1111-1111-111111111111',
    title: 'Eiffel Tower Visit',
    category: 'Culture',
    description: 'Visit the iconic Eiffel Tower and enjoy panoramic views of Paris.',
    imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=1000&q=80',
    durationHours: 2,
    estimatedCost: 2500,
    rating: 4.9,
  },
  {
    id: 'act-paris-louvre',
    destinationId: '11111111-1111-1111-1111-111111111111',
    title: 'Louvre Museum',
    category: 'History',
    description: 'Explore one of the world’s most famous art museums.',
    imageUrl: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1000&q=80',
    durationHours: 3,
    estimatedCost: 1800,
    rating: 4.8,
  },
  {
    id: 'act-tokyo-sensoji',
    destinationId: '22222222-2222-2222-2222-222222222222',
    title: 'Senso-ji Temple',
    category: 'Culture',
    description: 'Discover Tokyo’s historic Buddhist temple in Asakusa.',
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1000&q=80',
    durationHours: 2,
    estimatedCost: 800,
    rating: 4.8,
  },
  {
    id: 'act-dubai-safari',
    destinationId: '33333333-3333-3333-3333-333333333333',
    title: 'Desert Safari',
    category: 'Adventure',
    description: 'Spend an evening in the desert with dune experiences and dinner.',
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=80',
    durationHours: 6,
    estimatedCost: 4500,
    rating: 4.9,
  },
];

export async function getActivities(filters?: {
  query?: string;
  destinationId?: string;
  category?: string;
}): Promise<Activity[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_ACTIVITIES.filter((activity) => {
      const matchesDestination = !filters?.destinationId || activity.destinationId === filters.destinationId;
      const matchesCategory = !filters?.category || filters.category === 'All' || activity.category === filters.category;
      const matchesQuery =
        !filters?.query?.trim() ||
        `${activity.title} ${activity.description}`.toLowerCase().includes(filters.query.trim().toLowerCase());

      return matchesDestination && matchesCategory && matchesQuery;
    });
  }

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
  if (!isSupabaseConfigured()) {
    return FALLBACK_ACTIVITIES.find((activity) => activity.id === id) || null;
  }

  const supabase = createClient();
  const { data, error } = await supabase.from('activities').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapActivity(data) : null;
}
