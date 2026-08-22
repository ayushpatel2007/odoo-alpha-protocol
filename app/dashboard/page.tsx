'use client';

import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { FeaturedTrip } from '@/components/dashboard/FeaturedTrip';
import { RecommendedDestinations } from '@/components/dashboard/RecommendedDestinations';
import { RecentTrips } from '@/components/dashboard/RecentTrips';
import { getTrips, deleteTrip as apiDeleteTrip } from '@/lib/api/trips';
import { getDestinations, getSavedDestinations } from '@/lib/api/destinations';
import { Trip, Destination } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tripsData, destsData] = await Promise.all([
        getTrips(user?.id),
        getDestinations(),
      ]);
      setTrips(tripsData);
      setDestinations(destsData);

      if (user) {
        const saved = await getSavedDestinations(user.id);
        setSavedDestinations(saved);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleDeleteTrip = async (id: string) => {
    const success = await apiDeleteTrip(id);
    if (success) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const upcomingTrip = trips.find((t) => t.status === 'upcoming') || trips[0];

  return (
    <PageContainer>
      {/* Welcome Hero Banner */}
      <WelcomeHeader />

      {/* 4 Quick Stat Cards */}
      <QuickStats trips={trips} />

      {/* Featured / Hero Upcoming Trip */}
      <FeaturedTrip trip={upcomingTrip} />

      {/* Recommended Destinations Grid */}
      <RecommendedDestinations destinations={destinations} savedDestinations={savedDestinations} />

      {/* Recent Trips Cards */}
      <RecentTrips trips={trips} onDeleteTrip={handleDeleteTrip} />
    </PageContainer>
  );
}
