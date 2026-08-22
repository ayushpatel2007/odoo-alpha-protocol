import { Destination, Trip, UserProfile, TravelPreferences } from '@/types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    description: 'The City of Light boasts historic avenues, iconic museums like the Louvre, fine dining, and romantic architecture along the Seine.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    estimatedBudget: 75000,
    rating: 4.9,
    popularity: 98,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    description: 'A breathtaking synthesis of ultra-modern skyscrapers, neon lights, ancient shinto shrines, and world-renowned culinary culture.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    estimatedBudget: 95000,
    rating: 4.9,
    popularity: 97,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    description: 'Futuristic architecture, luxury shopping experiences, desert safari adventures, and world-record holding landmarks like the Burj Khalifa.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    estimatedBudget: 65000,
    rating: 4.8,
    popularity: 95,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    description: 'A cosmopolitan center filled with royal history, West End theatre shows, historic pubs, world-class museums, and Thames views.',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    estimatedBudget: 82000,
    rating: 4.7,
    popularity: 96,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    city: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    description: 'A lush garden city famous for Gardens by the Bay, Marina Bay Sands, vibrant hawker food stalls, and futuristic urban planning.',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    estimatedBudget: 58000,
    rating: 4.8,
    popularity: 94,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    city: 'Rome',
    country: 'Italy',
    region: 'Europe',
    description: 'An open-air museum filled with ancient Colosseum ruins, Vatican treasures, charming cobblestone alleyways, and authentic Italian gelato.',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    estimatedBudget: 68000,
    rating: 4.9,
    popularity: 93,
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    city: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    description: 'Tropical paradise featuring serene rice terraces in Ubud, coastal surf breaks, spiritual water temples, and relaxing wellness retreats.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    estimatedBudget: 42000,
    rating: 4.8,
    popularity: 92,
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    city: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    description: 'Energetic street life, ornate Grand Palace temples, bustling night markets, and incredible authentic Thai street cuisine.',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    estimatedBudget: 35000,
    rating: 4.7,
    popularity: 91,
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    city: 'Mumbai',
    country: 'India',
    region: 'Asia',
    description: 'India\'s vibrant financial capital, home to the Gateway of India, Marine Drive Promenade, historic colonial architecture, and Bollywood.',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    estimatedBudget: 25000,
    rating: 4.6,
    popularity: 89,
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    city: 'New Delhi',
    country: 'India',
    region: 'Asia',
    description: 'Rich historic capital spanning Mughal monuments like Qutub Minar and Humayun\'s Tomb alongside bustling bazaars and modern avenues.',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    estimatedBudget: 22000,
    rating: 4.6,
    popularity: 88,
  }
];

export const DEMO_USER: UserProfile = {
  id: 'usr-demo-alpha-001',
  email: 'ayush@alphaprotocol.io',
  firstName: 'Ayush',
  lastName: 'Patel',
  phone: '+91 98765 43210',
  city: 'Ahmedabad',
  country: 'India',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Avid explorer, technology architect & team lead for Team Alpha Protocol. Planning multi-city journeys across Europe & Asia.',
  createdAt: '2026-01-15T08:00:00Z'
};

export const DEMO_PREFERENCES: TravelPreferences = {
  travelStyle: 'balanced',
  budgetTier: 'moderate',
  interests: ['Culture', 'Food', 'Adventure', 'History'],
  language: 'en',
  currency: 'INR'
};

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trp-euro-escape-2026',
    ownerId: 'usr-demo-alpha-001',
    name: 'European Escape',
    description: 'A multi-city trip across the art capitals of Western Europe, exploring museums, canals, and mountain landscapes.',
    coverImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-09-12',
    endDate: '2026-09-21',
    estimatedBudget: 85000,
    status: 'upcoming',
    progress: 72,
    destinationIds: ['11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666'],
    destinations: [
      INITIAL_DESTINATIONS[0], // Paris
      INITIAL_DESTINATIONS[3], // London
      INITIAL_DESTINATIONS[5], // Rome
    ]
  },
  {
    id: 'trp-asian-odyssey-2026',
    ownerId: 'usr-demo-alpha-001',
    name: 'Asian Futuristic Odyssey',
    description: 'Experiencing neon skyline views, culinary night markets, and high-tech gardens.',
    coverImageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-11-05',
    endDate: '2026-11-18',
    estimatedBudget: 120000,
    status: 'draft',
    progress: 40,
    destinationIds: ['22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555'],
    destinations: [
      INITIAL_DESTINATIONS[1], // Tokyo
      INITIAL_DESTINATIONS[4], // Singapore
    ]
  },
  {
    id: 'trp-desert-luxury-2025',
    ownerId: 'usr-demo-alpha-001',
    name: 'Dubai & Arabian Gulf',
    description: 'Luxury architecture, desert safaris, and coastline relaxation.',
    coverImageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    startDate: '2025-12-10',
    endDate: '2025-12-17',
    estimatedBudget: 65000,
    status: 'completed',
    progress: 100,
    destinationIds: ['33333333-3333-3333-3333-333333333333'],
    destinations: [
      INITIAL_DESTINATIONS[2] // Dubai
    ]
  }
];
