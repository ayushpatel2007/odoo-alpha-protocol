export type ItineraryDay = {
  id: string;
  tripId: string;
  dayNumber: number;
  date: string;
  destinationId?: string | null;
  notes?: string | null;
};

export type ItineraryActivity = {
  id: string;
  tripDayId: string;
  activityId?: string | null;
  title: string;
  startTime?: string | null;
  endTime?: string | null;
  customNotes?: string | null;
  customCost: number;
  sequenceOrder: number;
};
