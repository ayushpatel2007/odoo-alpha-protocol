export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  country?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TravelStyle = 'relaxed' | 'balanced' | 'packed';
export type BudgetTier = 'budget' | 'moderate' | 'premium';

export type TravelPreferences = {
  id?: string;
  userId?: string;
  travelStyle: TravelStyle;
  budgetTier: BudgetTier;
  interests: string[];
  language: string;
  currency: string;
};

export type TripStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed';

export type Trip = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  status: TripStatus;
  progress: number;
  destinationIds: string[];
  destinations?: Destination[];
  createdAt?: string;
  updatedAt?: string;
};

export type Destination = {
  id: string;
  city: string;
  country: string;
  region?: string;
  description: string;
  imageUrl: string;
  estimatedBudget: number;
  rating: number;
  popularity?: number;
};

export type SavedDestination = {
  id: string;
  userId: string;
  destinationId: string;
  destination?: Destination;
  createdAt?: string;
};

export type Activity = {
  id: string;
  title: string;
  city: string;
  category: string;
  estimatedCost: number;
  durationHours: number;
  description: string;
  imageUrl: string;
};
