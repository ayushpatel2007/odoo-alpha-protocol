'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, MoreVertical, Eye, Edit3, Trash2, IndianRupee, Clock } from 'lucide-react';
import { Trip } from '@/types';
import { TripStatusBadge } from './TripStatusBadge';

type TripCardProps = {
  trip: Trip;
  viewMode?: 'grid' | 'list';
  onDelete?: (id: string) => void;
};

export function TripCard({ trip, viewMode = 'grid', onDelete }: TripCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const destinationCities =
    trip.destinations?.map((d) => d.city).join(' · ') ||
    (trip.destinationIds?.length ? `${trip.destinationIds.length} Destinations` : 'Multi-city Trip');

  // Calculate duration days
  const getDurationDays = () => {
    try {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays || 7;
    } catch {
      return 7;
    }
  };

  const days = getDurationDays();

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
        <div className="flex items-center gap-4 min-w-0">
          <img
            src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80'}
            alt={trip.name}
            className="w-20 h-20 rounded-xl object-cover shrink-0"
          />
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <TripStatusBadge status={trip.status} />
              <h3 className="font-extrabold text-slate-900 text-base tracking-tight truncate">
                {trip.name}
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{destinationCities}</span>
            </p>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {trip.startDate} to {trip.endDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {days} days
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Est. Budget
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              ₹{(trip.estimatedBudget || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="w-24 space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-slate-500">
              <span>Progress</span>
              <span>{trip.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${trip.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/trips/${trip.id}`}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              View Trip
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(trip.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Trip"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all relative">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3">
          <TripStatusBadge status={trip.status} />
        </div>

        {/* Dropdown Menu */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700 flex items-center justify-center text-white hover:bg-slate-900 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 text-xs font-semibold">
              <Link
                href={`/trips/${trip.id}`}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                onClick={() => setShowMenu(false)}
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                View Trip
              </Link>
              <Link
                href={`/trips/${trip.id}`}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                onClick={() => setShowMenu(false)}
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                Edit Plan
              </Link>
              {onDelete && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(trip.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 text-left"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Header Overlay Info */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-extrabold text-lg tracking-tight leading-snug truncate">
            {trip.name}
          </h3>
          <p className="text-xs text-amber-300 font-medium flex items-center gap-1 mt-0.5 truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{destinationCities}</span>
          </p>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {trip.startDate} – {trip.endDate}
            </span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-bold">
              {days} days
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-400 font-semibold">Estimated Budget</span>
            <span className="font-extrabold text-slate-900 text-sm">
              ₹{(trip.estimatedBudget || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500">
              <span>Planning Progress</span>
              <span className="text-amber-600 font-bold">{trip.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${trip.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2">
          <Link
            href={`/trips/${trip.id}`}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <span>View Trip</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
