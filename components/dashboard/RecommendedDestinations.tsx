'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Heart, ArrowRight, Compass, Plus, Check } from 'lucide-react';
import { Destination } from '@/types';
import { toggleSaveDestination } from '@/lib/api/destinations';
import { useAuth } from '@/components/auth/AuthContext';

type RecommendedDestinationsProps = {
  destinations: Destination[];
  savedDestinations?: Destination[];
};

export function RecommendedDestinations({ destinations, savedDestinations = [] }: RecommendedDestinationsProps) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>(savedDestinations.map((d) => d.id));

  const handleToggleSave = async (destinationId: string) => {
    if (!user) return;
    const isSaved = await toggleSaveDestination(user.id, destinationId);
    if (isSaved) {
      setSavedIds((prev) => [...prev, destinationId]);
    } else {
      setSavedIds((prev) => prev.filter((id) => id !== destinationId));
    }
  };

  return (
    <div id="explore-destinations" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-500" />
            <span>Recommended Destinations</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover popular global cities curated for your next travel itinerary.
          </p>
        </div>
        <Link
          href="/trips/new"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 hover:underline"
        >
          <span>Create Trip with Cities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid Catalog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {destinations.slice(0, 8).map((dest) => {
          const isSaved = savedIds.includes(dest.id);
          return (
            <div
              key={dest.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={dest.imageUrl}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1 border border-slate-700">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{dest.rating}</span>
                </div>

                {/* Save Heart Button */}
                <button
                  onClick={() => handleToggleSave(dest.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
                  aria-label="Save Destination"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isSaved ? 'text-rose-500 fill-rose-500' : 'text-slate-300 hover:text-white'
                    }`}
                  />
                </button>

                {/* City & Country Header */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-lg tracking-tight leading-none">
                    {dest.city}
                  </h3>
                  <p className="text-xs text-amber-300/90 font-medium mt-0.5">{dest.country}</p>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Est. Budget / Stop
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{dest.estimatedBudget.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link
                    href={`/trips/new?destination=${dest.id}`}
                    className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500 text-amber-700 hover:text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Plan Trip</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
