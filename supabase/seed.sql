-- ========================================================
-- GLOBETROTTER SUPABASE SEED DATA
-- Odoo x LDCE Hackathon - Team Alpha Protocol
-- Populate destinations catalog with popular travel cities
-- ========================================================

INSERT INTO public.destinations (id, city, country, region, description, image_url, estimated_budget, rating, popularity)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Paris',
    'France',
    'Europe',
    'The City of Light boasts historic avenues, iconic museums like the Louvre, fine dining, and romantic architecture along the Seine.',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    75000,
    4.9,
    98
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Tokyo',
    'Japan',
    'Asia',
    'A breathtaking synthesis of ultra-modern skyscrapers, neon lights, ancient shinto shrines, and world-renowned culinary culture.',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    95000,
    4.9,
    97
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Dubai',
    'United Arab Emirates',
    'Middle East',
    'Futuristic architecture, luxury shopping experiences, desert safari adventures, and world-record holding landmarks like the Burj Khalifa.',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    65000,
    4.8,
    95
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'London',
    'United Kingdom',
    'Europe',
    'A cosmopolitan center filled with royal history, West End theatre shows, historic pubs, world-class museums, and Thames views.',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    82000,
    4.7,
    96
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Singapore',
    'Singapore',
    'Asia',
    'A lush garden city famous for Gardens by the Bay, Marina Bay Sands, vibrant hawker food stalls, and futuristic urban planning.',
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    58000,
    4.8,
    94
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Rome',
    'Italy',
    'Europe',
    'An open-air museum filled with ancient Colosseum ruins, Vatican treasures, charming cobblestone alleyways, and authentic Italian gelato.',
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    68000,
    4.9,
    93
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Bali',
    'Indonesia',
    'Asia',
    'Tropical paradise featuring serene rice terraces in Ubud, coastal surf breaks, spiritual water temples, and relaxing wellness retreats.',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    42000,
    4.8,
    92
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'Bangkok',
    'Thailand',
    'Asia',
    'Energetic street life, ornate Grand Palace temples, bustling night markets, and incredible authentic Thai street cuisine.',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    35000,
    4.7,
    91
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    'Mumbai',
    'India',
    'Asia',
    'India''s vibrant financial capital, home to the Gateway of India, Marine Drive Promenade, historic colonial architecture, and Bollywood.',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    25000,
    4.6,
    89
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'New Delhi',
    'India',
    'Asia',
    'Rich historic capital spanning Mughal monuments like Qutub Minar and Humayun''s Tomb alongside bustling bazaars and modern avenues.',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    22000,
    4.6,
    88
  )
ON CONFLICT (id) DO NOTHING;
