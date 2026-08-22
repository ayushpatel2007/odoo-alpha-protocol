import { createClient } from '@/lib/supabase/client';
import { Trip, TripStatus } from '@/types';
import { INITIAL_TRIPS } from '@/lib/mock-data/seed-catalog';
import { getDestinations } from './destinations';
import { isSupabaseConfigured } from '@/lib/supabase/config';

function buildTripDayRows(tripId: string, startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const rows: Array<{ trip_id: string; day_number: number; date: string }> = [];

  for (let cursor = new Date(start), n = 1; cursor <= end; cursor.setDate(cursor.getDate() + 1), n += 1) {
    rows.push({
      trip_id: tripId,
      day_number: n,
      date: cursor.toISOString().slice(0, 10),
    });
  }

  return rows;
}

export async function getTrips(userId?: string): Promise<Trip[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    let query = supabase
      .from('trips')
      .select('*, trip_destinations(destination_id, sequence_order, destinations(*))')
      .order('created_at', { ascending: false });

    const effectiveUserId = authUser?.id || (userId && userId.length > 20 ? userId : null);
    if (effectiveUserId) {
      query = query.eq('owner_id', effectiveUserId);
    }

    const { data, error } = await query;

    if (!error && data) {
      return data.map((t: any) => {
        const dests = (t.trip_destinations || [])
          .sort((a: any, b: any) => a.sequence_order - b.sequence_order)
          .map((td: any) => td.destinations)
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

        return {
          id: t.id,
          ownerId: t.owner_id,
          name: t.name,
          description: t.description || '',
          coverImageUrl: t.cover_image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
          startDate: t.start_date,
          endDate: t.end_date,
          estimatedBudget: Number(t.estimated_budget),
          status: (t.status as TripStatus) || 'draft',
          progress: t.progress || 0,
          destinationIds: dests.map((d: any) => d.id),
          destinations: dests,
          isPublic: Boolean(t.is_public),
          shareSlug: t.share_slug,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
        };
      });
    }
  }

  // Local fallback storage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('gt_user_trips');
    if (saved) {
      try {
        const trips: Trip[] = JSON.parse(saved);
        return trips;
      } catch (e) {
        // continue
      }
    }
  }

  return INITIAL_TRIPS;
}

export async function getTripById(id: string): Promise<Trip | null> {
  const trips = await getTrips();
  const trip = trips.find((t) => t.id === id);
  if (!trip) return null;

  // Hydrate destinations if missing
  if (!trip.destinations || trip.destinations.length === 0) {
    const allDests = await getDestinations();
    trip.destinations = allDests.filter((d) => trip.destinationIds.includes(d.id));
  }

  return trip;
}

export async function createTrip(data: {
  ownerId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  destinationIds: string[];
  travelStyle?: string;
  budgetTier?: string;
  interests?: string[];
  coverFile?: File | null;
  customCoverUrl?: string;
}): Promise<{ trip: Trip | null; error: string | null }> {
  const allDestinations = await getDestinations();
  const selectedDestinations = allDestinations.filter((d) => data.destinationIds.includes(d.id));
  const estimatedBudget = selectedDestinations.reduce((sum, d) => sum + d.estimatedBudget, 0) || 50000;
  const defaultCover = selectedDestinations[0]?.imageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80';

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const effectiveOwnerId = authUser?.id || (data.ownerId && data.ownerId.length > 20 ? data.ownerId : null);

    if (!effectiveOwnerId) {
      return { trip: null, error: 'Please sign in to save your trip to Supabase.' };
    }

    let coverImageUrl = data.customCoverUrl || defaultCover;

    if (data.coverFile) {
      const fileExt = data.coverFile.name.split('.').pop();
      const filePath = `${effectiveOwnerId}/${Date.now()}.${fileExt}`;
      const { error: uploadErr } = await supabase.storage
        .from('trip-covers')
        .upload(filePath, data.coverFile);

      if (!uploadErr) {
        const { data: publicUrlData } = supabase.storage
          .from('trip-covers')
          .getPublicUrl(filePath);
        coverImageUrl = publicUrlData.publicUrl;
      }
    }

    const { data: insertedTrip, error: tripError } = await supabase
      .from('trips')
      .insert({
        owner_id: effectiveOwnerId,
        name: data.name,
        description: data.description || null,
        start_date: data.startDate,
        end_date: data.endDate,
        cover_image_url: coverImageUrl,
        estimated_budget: estimatedBudget,
        status: 'upcoming',
        progress: 25,
      })
      .select()
      .single();

    if (tripError || !insertedTrip) {
      return { trip: null, error: tripError?.message || 'Failed to create trip' };
    }

    // Insert destination junction records
    if (data.destinationIds.length > 0) {
      const junctionRows = data.destinationIds.map((destId, index) => ({
        trip_id: insertedTrip.id,
        destination_id: destId,
        sequence_order: index + 1,
      }));

      const { error: destinationsError } = await supabase.from('trip_destinations').insert(junctionRows);

      if (destinationsError) {
        return { trip: null, error: `Trip created, but destination links failed: ${destinationsError.message}` };
      }
    }

    const dayRows = buildTripDayRows(insertedTrip.id, data.startDate, data.endDate);
    if (dayRows.length > 0) {
      const { error: daysError } = await supabase.from('trip_days').insert(dayRows);

      if (daysError) {
        return { trip: null, error: `Trip created, but itinerary days failed: ${daysError.message}` };
      }
    }

    const newTrip: Trip = {
      id: insertedTrip.id,
      ownerId: insertedTrip.owner_id,
      name: insertedTrip.name,
      description: insertedTrip.description || '',
      coverImageUrl: insertedTrip.cover_image_url,
      startDate: insertedTrip.start_date,
      endDate: insertedTrip.end_date,
      estimatedBudget: Number(insertedTrip.estimated_budget),
      status: 'upcoming',
      progress: 25,
      destinationIds: data.destinationIds,
      destinations: selectedDestinations,
      isPublic: false,
      shareSlug: null,
      createdAt: insertedTrip.created_at,
    };

    return { trip: newTrip, error: null };
  }

  // Local fallback storage
  const currentTrips = await getTrips(data.ownerId);
  const newTrip: Trip = {
    id: `trp-${Date.now()}`,
    ownerId: data.ownerId,
    name: data.name,
    description: data.description || '',
    coverImageUrl: data.customCoverUrl || defaultCover,
    startDate: data.startDate,
    endDate: data.endDate,
    estimatedBudget,
    status: 'upcoming',
    progress: 25,
    destinationIds: data.destinationIds,
    destinations: selectedDestinations,
    isPublic: false,
    shareSlug: null,
    createdAt: new Date().toISOString(),
  };

  const updatedTrips = [newTrip, ...currentTrips];
  if (typeof window !== 'undefined') {
    localStorage.setItem('gt_user_trips', JSON.stringify(updatedTrips));
  }

  return { trip: newTrip, error: null };
}

export async function deleteTrip(tripId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase.from('trips').delete().eq('id', tripId);
    if (error) return false;
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('gt_user_trips');
    if (saved) {
      try {
        const trips: Trip[] = JSON.parse(saved);
        const filtered = trips.filter((t) => t.id !== tripId);
        localStorage.setItem('gt_user_trips', JSON.stringify(filtered));
      } catch (e) {
        // continue
      }
    }
  }

  return true;
}
