'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, Clock, Sparkles, Plus, Compass } from 'lucide-react';
import { Trip } from '@/types';

type FeaturedTripProps = {
  trip?: Trip | null;
};

export function FeaturedTrip({ trip }: FeaturedTripProps) {
  if (!trip) {
    return (
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Ready for your next journey?</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            No active trips scheduled yet
          </h2>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Build your personalized multi-city travel itinerary, customize budgets, and organize day-by-day activities.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Link
            href="/trips/new"
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Plan Your First Trip</span>
          </Link>
        </div>

        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    );
  }

  const destinationCities = trip.destinations?.map((d) => d.city).join(' → ') || trip.name;
  const startDateStr = new Date(trip.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const endDateStr = new Date(trip.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden flex flex-col lg:flex-row group hover:shadow-lg transition-all">
      {/* Cover Image Half */}
      <div className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden">
        <img
          src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/20" />
        <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow-md">
          Featured Journey
        </div>
      </div>

      {/* Details Half */}
      <div className="lg:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Upcoming Travel Stop
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {trip.name}
          </h2>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{destinationCities}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{startDateStr} – {endDateStr}</span>
            </div>
            {trip.destinations && trip.destinations.length > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{trip.destinations.length} destination{trip.destinations.length > 1 ? 's' : ''}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Financial & Progress Bar */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Estimated Budget</span>
            <span className="font-extrabold text-slate-900 text-base">
              ₹{(trip.estimatedBudget || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Planning Progress</span>
              <span className="text-amber-600 font-extrabold">{trip.progress || 25}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${trip.progress || 25}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href={`/trips/${trip.id}`}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
          >
            <span>Continue Planning</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
