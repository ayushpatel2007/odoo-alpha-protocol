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
