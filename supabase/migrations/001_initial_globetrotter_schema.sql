-- ========================================================
-- GLOBETROTTER SUPABASE DATABASE SCHEMA MIGRATION
-- Odoo x LDCE Hackathon - Team Alpha Protocol
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. PROFILES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  city TEXT,
  country TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- --------------------------------------------------------
-- 2. PROFILE PREFERENCES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  travel_style TEXT DEFAULT 'balanced', -- 'relaxed' | 'balanced' | 'packed'
  budget_tier TEXT DEFAULT 'moderate',   -- 'budget' | 'moderate' | 'premium'
  interests TEXT[] DEFAULT ARRAY['Culture', 'Food'],
  language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_preference UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profile_preferences ENABLE ROW LEVEL SECURITY;

-- Preferences Policies
CREATE POLICY "Users can view own preferences"
  ON public.profile_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.profile_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.profile_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- 3. TRIPS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  estimated_budget NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'draft', -- 'draft' | 'upcoming' | 'ongoing' | 'completed'
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Trips Policies
CREATE POLICY "Users can view own trips"
  ON public.trips FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = owner_id);

-- --------------------------------------------------------
-- 4. DESTINATIONS TABLE (Master Catalog)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  description TEXT,
  image_url TEXT,
  estimated_budget NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 4.8,
  popularity INTEGER DEFAULT 90,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Destinations Policies (Readable by all authenticated users)
CREATE POLICY "Authenticated users can view destinations"
  ON public.destinations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anon users can view destinations"
  ON public.destinations FOR SELECT
  TO anon
  USING (true);

-- --------------------------------------------------------
-- 5. TRIP DESTINATIONS (Junction Table)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trip_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  sequence_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.trip_destinations ENABLE ROW LEVEL SECURITY;

-- Trip Destinations Policies (Users manage destinations of their own trips)
CREATE POLICY "Users can view destinations of own trips"
  ON public.trip_destinations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_destinations.trip_id
        AND trips.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert destinations into own trips"
  ON public.trip_destinations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_destinations.trip_id
        AND trips.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete destinations from own trips"
  ON public.trip_destinations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_destinations.trip_id
        AND trips.owner_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- 6. SAVED DESTINATIONS (Wishlist)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_saved_destination UNIQUE(user_id, destination_id)
);

-- Enable RLS
ALTER TABLE public.saved_destinations ENABLE ROW LEVEL SECURITY;

-- Saved Destinations Policies
CREATE POLICY "Users can view own saved destinations"
  ON public.saved_destinations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved destinations"
  ON public.saved_destinations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved destinations"
  ON public.saved_destinations FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- 7. STORAGE BUCKETS SETUP
-- --------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('trip-covers', 'trip-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for avatars
CREATE POLICY "Avatar Images Public Read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Avatar Images User Insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Avatar Images User Update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Storage Policies for trip-covers
CREATE POLICY "Trip Covers Public Read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'trip-covers');

CREATE POLICY "Trip Covers User Insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'trip-covers' AND auth.role() = 'authenticated');

-- --------------------------------------------------------
-- 8. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );

  INSERT INTO public.profile_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
