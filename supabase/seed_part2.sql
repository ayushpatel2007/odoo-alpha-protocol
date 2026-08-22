-- GlobeTrotter Frontend Part 2 activity catalog seed.
-- Run after 001_initial_globetrotter_schema.sql and 002_itinerary_activity_budget_sharing.sql.
-- Destination IDs are resolved by city/country so this seed does not depend on fixed UUIDs.

INSERT INTO public.activities (destination_id, title, category, description, image_url, duration_hours, estimated_cost, rating)
SELECT d.id, v.title, v.category, v.description, v.image_url, v.duration_hours, v.estimated_cost, v.rating
FROM (VALUES
  ('Paris','France','Eiffel Tower Visit','Culture','Visit the iconic Eiffel Tower and enjoy panoramic views of Paris.','https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=1000&q=80',2.0,2500,4.9),
  ('Paris','France','Louvre Museum','History','Explore one of the world’s most famous art museums.','https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1000&q=80',3.0,1800,4.8),
  ('Paris','France','Seine River Cruise','Entertainment','A relaxed cruise with views of central Paris landmarks.','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',1.5,2200,4.7),
  ('Tokyo','Japan','Senso-ji Temple','Culture','Discover Tokyo’s historic Buddhist temple in Asakusa.','https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1000&q=80',2.0,800,4.8),
  ('Tokyo','Japan','Shibuya Crossing','Shopping','Experience Tokyo’s iconic crossing and surrounding district.','https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80',2.0,1200,4.8),
  ('Tokyo','Japan','Tsukiji Food Tour','Food','Taste local Japanese specialties around the historic market area.','https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1000&q=80',2.5,3000,4.9),
  ('Dubai','United Arab Emirates','Burj Khalifa','Culture','See Dubai from the observation decks of Burj Khalifa.','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',2.0,3500,4.8),
  ('Dubai','United Arab Emirates','Desert Safari','Adventure','Spend an evening in the desert with dune experiences and dinner.','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=80',6.0,4500,4.9)
) AS v(city,country,title,category,description,image_url,duration_hours,estimated_cost,rating)
JOIN public.destinations d ON d.city = v.city AND d.country = v.country
WHERE NOT EXISTS (
  SELECT 1 FROM public.activities a WHERE a.title = v.title AND a.destination_id = d.id
);
