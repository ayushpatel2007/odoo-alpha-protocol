'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { getTripById } from '@/lib/api/trips';
import { Trip } from '@/types';
import { TripStatusBadge } from '@/components/trips/TripStatusBadge';
import { MapPin, Calendar, Clock, IndianRupee, ArrowLeft, Sparkles, Layers, CheckCircle } from 'lucide-react';
import { ShareTripButton } from '@/components/sharing/ShareTripButton';

export default function TripOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params?.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrip() {
      if (tripId) {
        const found = await getTripById(tripId);
        setTrip(found);
      }
      setLoading(false);
    }
    loadTrip();
  }, [tripId]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (!trip) {
    return (
      <PageContainer>
        <div className="text-center py-16 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Trip Not Found</h2>
          <p className="text-xs text-slate-500">The requested trip could not be located.</p>
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Trips</span>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const destinationCities = trip.destinations?.map((d) => d.city).join(' → ') || 'Multi-city Trip';

  return (
    <PageContainer>
      {/* Top Back Navigation */}
      <div>
        <Link
          href="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-900 text-white min-h-[280px] flex flex-col justify-end p-6 md:p-8">
        <img
          src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'}
          alt={trip.name}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <TripStatusBadge status={trip.status} />
            <span className="text-xs font-semibold text-amber-300">
              Created on {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : '2026'}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">{trip.name}</h1>

          <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{destinationCities}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {trip.startDate} to {trip.endDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-slate-400" />
              Est. Budget: ₹{(trip.estimatedBudget || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <ShareTripButton tripId={tripId} initialPublic={trip.isPublic} initialSlug={trip.shareSlug} />
      </div>

      {/* Part 2 Planning Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href={`/trips/${tripId}/itinerary`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-400 hover:bg-amber-50/40">
          <div className="text-sm font-extrabold text-slate-900">Itinerary</div>
          <div className="mt-1 text-[11px] text-slate-500">Plan each day</div>
        </Link>
        <Link href={`/trips/${tripId}/activities`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-400 hover:bg-amber-50/40">
          <div className="text-sm font-extrabold text-slate-900">Activities</div>
          <div className="mt-1 text-[11px] text-slate-500">Discover experiences</div>
        </Link>
        <Link href={`/trips/${tripId}/budget`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-400 hover:bg-amber-50/40">
          <div className="text-sm font-extrabold text-slate-900">Budget</div>
          <div className="mt-1 text-[11px] text-slate-500">Track expenses</div>
        </Link>
        <Link href={`/trips/${tripId}/calendar`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-400 hover:bg-amber-50/40">
          <div className="text-sm font-extrabold text-slate-900">Calendar</div>
          <div className="mt-1 text-[11px] text-slate-500">See your timeline</div>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Description & Overview */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Trip Description & Summary</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {trip.description || 'No description provided for this trip.'}
          </p>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Destinations Included:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trip.destinations?.map((d, i) => (
                <div key={d.id || i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <img src={d.imageUrl} alt={d.city} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">{d.city}</h4>
                    <p className="text-[11px] text-amber-600 font-semibold">{d.country}</p>
                    <p className="text-[10px] text-slate-400">Est. ₹{d.estimatedBudget.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon Itinerary Engine Integration */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-50 rounded-3xl p-6 border border-amber-500/30 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Interactive Itinerary Builder
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Build your day-by-day itinerary, add activities, track expenses, and view the trip calendar.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-amber-500/20 text-[11px] font-semibold text-amber-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Reserved Route: /trips/{tripId}</span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
