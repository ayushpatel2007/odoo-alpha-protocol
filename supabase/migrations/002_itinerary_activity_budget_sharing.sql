-- GlobeTrotter Frontend Part 2
-- Odoo x LDCE Hackathon - Team Alpha Protocol

-- Trip-day records
CREATE TABLE IF NOT EXISTS public.trip_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number > 0),
  date DATE NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, day_number),
  UNIQUE(trip_id, date)
);

-- Master activity catalog
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Culture',
  description TEXT DEFAULT '',
  image_url TEXT,
  duration_hours NUMERIC(5,2) DEFAULT 1,
  estimated_cost NUMERIC DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities scheduled inside a user's itinerary
CREATE TABLE IF NOT EXISTS public.trip_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_day_id UUID NOT NULL REFERENCES public.trip_days(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  start_time TIME,
  end_time TIME,
  custom_notes TEXT,
  custom_cost NUMERIC DEFAULT 0,
  sequence_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trip expenses
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public sharing metadata
ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS share_slug TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_trip_days_trip_id ON public.trip_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_activities_day_id ON public.trip_activities(trip_day_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON public.expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_destination_id ON public.activities(destination_id);
CREATE INDEX IF NOT EXISTS idx_trips_share_slug ON public.trips(share_slug);

-- RLS
ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Master activities are readable; writes can be handled by an admin layer later.
DROP POLICY IF EXISTS "Authenticated users can view activities" ON public.activities;
CREATE POLICY "Authenticated users can view activities"
  ON public.activities FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anon users can view activities" ON public.activities;
CREATE POLICY "Anon users can view activities"
  ON public.activities FOR SELECT TO anon USING (true);

-- Trip days
DROP POLICY IF EXISTS "Users can view own trip days" ON public.trip_days;
CREATE POLICY "Users can view own trip days"
  ON public.trip_days FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_days.trip_id AND t.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert own trip days" ON public.trip_days;
CREATE POLICY "Users can insert own trip days"
  ON public.trip_days FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_days.trip_id AND t.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update own trip days" ON public.trip_days;
CREATE POLICY "Users can update own trip days"
  ON public.trip_days FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_days.trip_id AND t.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete own trip days" ON public.trip_days;
CREATE POLICY "Users can delete own trip days"
  ON public.trip_days FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_days.trip_id AND t.owner_id = auth.uid()
  ));

-- Trip activities
DROP POLICY IF EXISTS "Users can view own trip activities" ON public.trip_activities;
CREATE POLICY "Users can view own trip activities"
  ON public.trip_activities FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.trip_days d
    JOIN public.trips t ON t.id = d.trip_id
    WHERE d.id = trip_activities.trip_day_id AND t.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert own trip activities" ON public.trip_activities;
CREATE POLICY "Users can insert own trip activities"
  ON public.trip_activities FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1
    FROM public.trip_days d
    JOIN public.trips t ON t.id = d.trip_id
    WHERE d.id = trip_activities.trip_day_id AND t.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update own trip activities" ON public.trip_activities;
CREATE POLICY "Users can update own trip activities"
  ON public.trip_activities FOR UPDATE
  USING (EXISTS (
    SELECT 1
    FROM public.trip_days d
    JOIN public.trips t ON t.id = d.trip_id
    WHERE d.id = trip_activities.trip_day_id AND t.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete own trip activities" ON public.trip_activities;
CREATE POLICY "Users can delete own trip activities"
  ON public.trip_activities FOR DELETE
  USING (EXISTS (
    SELECT 1
    FROM public.trip_days d
    JOIN public.trips t ON t.id = d.trip_id
    WHERE d.id = trip_activities.trip_day_id AND t.owner_id = auth.uid()
  ));

-- Expenses
DROP POLICY IF EXISTS "Users can view own expenses" ON public.expenses;
CREATE POLICY "Users can view own expenses"
  ON public.expenses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = expenses.trip_id AND t.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert own expenses" ON public.expenses;
CREATE POLICY "Users can insert own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = expenses.trip_id AND t.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update own expenses" ON public.expenses;
CREATE POLICY "Users can update own expenses"
  ON public.expenses FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = expenses.trip_id AND t.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete own expenses" ON public.expenses
;
CREATE POLICY "Users can delete own expenses"
  ON public.expenses FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = expenses.trip_id AND t.owner_id = auth.uid()
  ));

-- Public trip read policy. Only public trips can be read anonymously.
DROP POLICY IF EXISTS "Anyone can view public trips" ON public.trips;
CREATE POLICY "Anyone can view public trips"
  ON public.trips FOR SELECT TO anon
  USING (is_public = true);

DROP POLICY IF EXISTS "Authenticated users can view public trips" ON public.trips;
CREATE POLICY "Authenticated users can view public trips"
  ON public.trips FOR SELECT TO authenticated
  USING (is_public = true OR auth.uid() = owner_id);

-- Public itinerary data
DROP POLICY IF EXISTS "Anyone can view days of public trips" ON public.trip_days;
CREATE POLICY "Anyone can view days of public trips"
  ON public.trip_days FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_days.trip_id AND t.is_public = true
  ));

DROP POLICY IF EXISTS "Anyone can view activities of public trips" ON public.trip_activities;
CREATE POLICY "Anyone can view activities of public trips"
  ON public.trip_activities FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1
    FROM public.trip_days d
    JOIN public.trips t ON t.id = d.trip_id
    WHERE d.id = trip_activities.trip_day_id AND t.is_public = true
  ));

-- Helper trigger to keep trip updated_at current.
CREATE OR REPLACE FUNCTION public.set_trip_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trips_updated_at_part2 ON public.trips;
CREATE TRIGGER trips_updated_at_part2
BEFORE UPDATE ON public.trips
FOR EACH ROW EXECUTE FUNCTION public.set_trip_updated_at();
