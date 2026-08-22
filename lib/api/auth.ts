import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/types';
import { DEMO_USER } from '@/lib/mock-data/seed-catalog';

export async function login(email: string, password?: string): Promise<{ user: UserProfile | null; error: string | null }> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || '',
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userProfile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        firstName: profile?.first_name || data.user.user_metadata?.first_name || 'Traveler',
        lastName: profile?.last_name || data.user.user_metadata?.last_name || '',
        phone: profile?.phone || '',
        city: profile?.city || '',
        country: profile?.country || '',
        avatarUrl: profile?.avatar_url || data.user.user_metadata?.avatar_url || '',
        bio: profile?.bio || '',
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('gt_session_user', JSON.stringify(userProfile));
      }

      return { user: userProfile, error: null };
    }
  }

  // Local / Demo mode fallback
  const userProfile: UserProfile = {
    ...DEMO_USER,
    email: email || DEMO_USER.email,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem('gt_session_user', JSON.stringify(userProfile));
  }
  return { user: userProfile, error: null };
}

export async function register(data: {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  country?: string;
  bio?: string;
  avatarFile?: File | null;
}): Promise<{ user: UserProfile | null; error: string | null }> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password || 'Password123!',
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (authData.user) {
      let avatarUrl = '';
      if (data.avatarFile) {
        const fileExt = data.avatarFile.name.split('.').pop();
        const filePath = `${authData.user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(filePath, data.avatarFile);

        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          avatarUrl = publicUrlData.publicUrl;
        }
      }

      // Upsert profile
      const { error: profileErr } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        city: data.city || null,
        country: data.country || null,
        bio: data.bio || null,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      });

      if (profileErr) {
        console.warn('Profile creation note:', profileErr.message);
      }

      const userProfile: UserProfile = {
        id: authData.user.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || '',
        city: data.city || '',
        country: data.country || '',
        avatarUrl,
        bio: data.bio || '',
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('gt_session_user', JSON.stringify(userProfile));
      }

      return { user: userProfile, error: null };
    }
  }

  // Fallback state
  const newUser: UserProfile = {
    id: `usr-${Date.now()}`,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone || '',
    city: data.city || '',
    country: data.country || '',
    avatarUrl: data.avatarFile ? URL.createObjectURL(data.avatarFile) : DEMO_USER.avatarUrl,
    bio: data.bio || '',
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('gt_session_user', JSON.stringify(newUser));
  }

  return { user: newUser, error: null };
}

export async function logout(): Promise<void> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    await supabase.auth.signOut();
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem('gt_session_user');
  }
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email || '',
        firstName: profile?.first_name || user.user_metadata?.first_name || 'Traveler',
        lastName: profile?.last_name || user.user_metadata?.last_name || '',
        phone: profile?.phone || '',
        city: profile?.city || '',
        country: profile?.country || '',
        avatarUrl: profile?.avatar_url || '',
        bio: profile?.bio || '',
      };
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('gt_session_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USER;
      }
    }
  }

  return DEMO_USER;
}
