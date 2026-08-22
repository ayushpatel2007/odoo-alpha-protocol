'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Printer, RefreshCw } from 'lucide-react';
import { getTripById } from '@/lib/api/trips';
import { getTripActivities, getTripDays } from '@/lib/api/itinerary';
import { getExpenses } from '@/lib/api/budget';
import { Trip } from '@/types';
import { TripInsights } from '@/components/insights/TripInsights';

export default function TripInsightsPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<Awaited<ReturnType<typeof getTripDays>>>([]);
  const [activities, setActivities] = useState<Awaited<ReturnType<typeof getTripActivities>>>([]);
  const [expenses, setExpenses] = useState<Awaited<ReturnType<typeof getExpenses>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const tripData = await getTripById(params.id);
      if (!tripData) {
        setError('Trip not found.');
        return;
      }
      const [dayData, activityData, expenseData] = await Promise.all([
        getTripDays(params.id),
        getTripActivities(params.id),
        getExpenses(params.id),
      ]);
      setTrip(tripData);
      setDays(dayData);
      setActivities(activityData);
      setExpenses(expenseData);
    } catch (err) {
      console.error(err);
      setError('Unable to load trip insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInsights(); }, [params.id]);

  if (loading) return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin" /> Loading trip insights...
      </div>
    </main>
  );

  if (error || !trip) return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/trips" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to trips
        </Link>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <h1 className="text-xl font-semibold">Unable to open insights</h1>
          <p className="text-slate-400 mt-2">{error || 'Trip not found.'}</p>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link href={`/trips/${params.id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-3">
              <ArrowLeft className="w-4 h-4" /> Back to trip
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{trip.name} Insights</h1>
                <p className="text-slate-400 text-sm mt-1">Overview of itinerary, activities and spending.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={loadInsights} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-sm font-medium">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <Link href={`/trips/${params.id}/print`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold">
              <Printer className="w-4 h-4" /> Print / Export
            </Link>
          </div>
        </div>
        <TripInsights trip={trip} days={days} activities={activities} expenses={expenses} />
      </div>
    </main>
  );
}
