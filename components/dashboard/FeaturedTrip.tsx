'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, IndianRupee, Clock, Sparkles } from 'lucide-react';
import { Trip } from '@/types';

type FeaturedTripProps = {
  trip?: Trip | null;
};

export function FeaturedTrip({ trip }: FeaturedTripProps) {
  // Default hero trip if none provided
  const featured = trip || {
    id: 'trp-euro-escape-2026',
    name: 'European Escape',
    description: 'Paris → London → Rome',
    startDate: '2026-09-12',
    endDate: '2026-09-21',
    estimatedBudget: 85000,
    progress: 72,
    coverImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    destinations: [
      { city: 'Paris', country: 'France' },
      { city: 'London', country: 'United Kingdom' },
      { city: 'Rome', country: 'Italy' },
    ],
  };

  const destinationCities = featured.destinations?.map((d) => d.city).join(' → ') || 'Paris → London → Rome';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden flex flex-col lg:flex-row group hover:shadow-lg transition-all">
      {/* Cover Image Half */}
      <div className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden">
        <img
          src={featured.coverImageUrl}
          alt={featured.name}
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
            {featured.name}
          </h2>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{destinationCities}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>12 Sep – 21 Sep 2026</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>9 days · 3 destinations</span>
            </div>
          </div>
        </div>

        {/* Financial & Progress Bar */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Estimated Budget</span>
            <span className="font-extrabold text-slate-900 text-base">
              ₹{featured.estimatedBudget.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Planning Progress</span>
              <span className="text-amber-600 font-extrabold">{featured.progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${featured.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href={`/trips/${featured.id}`}
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
