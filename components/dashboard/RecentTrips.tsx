'use client';

import React from 'react';
import Link from 'next/link';
import { Trip } from '@/types';
import { TripCard } from '@/components/trips/TripCard';
import { Map, ArrowRight, Plus } from 'lucide-react';

type RecentTripsProps = {
  trips: Trip[];
  onDeleteTrip?: (id: string) => void;
};

export function RecentTrips({ trips, onDeleteTrip }: RecentTripsProps) {
  const recent = trips.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Map className="w-6 h-6 text-amber-500" />
            <span>Recent Trips</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your recent multi-city travel plans and drafts.
          </p>
        </div>
        <Link
          href="/trips"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 hover:underline"
        >
          <span>View All ({trips.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Map className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No trips planned yet ✈️</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your next adventure starts here. Create your first customized multi-city travel itinerary.
            </p>
          </div>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Plan Your First Trip</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={onDeleteTrip} />
          ))}
        </div>
      )}
    </div>
  );
}
