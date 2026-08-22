import { createClient } from '@/lib/supabase/client';
import { UserProfile, TravelPreferences } from '@/types';
import { DEMO_USER, DEMO_PREFERENCES } from '@/lib/mock-data/seed-catalog';

export async function getProfile(userId: string): Promise<UserProfile> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      return {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        city: profile.city || '',
        country: profile.country || '',
        avatarUrl: profile.avatar_url || '',
        bio: profile.bio || '',
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('gt_session_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // continue
      }
    }
  }

  return DEMO_USER;
}

export async function updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    const { data: updated } = await supabase
      .from('profiles')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        city: data.city,
        country: data.country,
        bio: data.bio,
        avatar_url: data.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (updated) {
      const userProfile: UserProfile = {
        id: updated.id,
        email: updated.email,
        firstName: updated.first_name || '',
        lastName: updated.last_name || '',
        phone: updated.phone || '',
        city: updated.city || '',
        country: updated.country || '',
        avatarUrl: updated.avatar_url || '',
        bio: updated.bio || '',
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('gt_session_user', JSON.stringify(userProfile));
      }
      return userProfile;
    }
  }

  // Local fallback update
  const current = await getProfile(userId);
  const updatedUser: UserProfile = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem('gt_session_user', JSON.stringify(updatedUser));
  }
  return updatedUser;
}

export async function getPreferences(userId: string): Promise<TravelPreferences> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    const { data: prefs } = await supabase
      .from('profile_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (prefs) {
      return {
        id: prefs.id,
        userId: prefs.user_id,
        travelStyle: prefs.travel_style || 'balanced',
        budgetTier: prefs.budget_tier || 'moderate',
        interests: prefs.interests || ['Culture', 'Food'],
        language: prefs.language || 'en',
        currency: prefs.currency || 'INR',
      };
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('gt_user_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // continue
      }
    }
  }

  return DEMO_PREFERENCES;
}

export async function updatePreferences(userId: string, preferences: TravelPreferences): Promise<TravelPreferences> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    await supabase.from('profile_preferences').upsert({
      user_id: userId,
      travel_style: preferences.travelStyle,
      budget_tier: preferences.budgetTier,
      interests: preferences.interests,
      language: preferences.language,
      currency: preferences.currency,
      updated_at: new Date().toISOString(),
    });
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('gt_user_preferences', JSON.stringify(preferences));
  }

  return preferences;
}
