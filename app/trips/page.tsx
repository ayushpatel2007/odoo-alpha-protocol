'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { TripCard } from '@/components/trips/TripCard';
import { Trip, TripStatus } from '@/types';
import { getTrips, deleteTrip as apiDeleteTrip } from '@/lib/api/trips';
import { useAuth } from '@/components/auth/AuthContext';
import { Plus, Search, LayoutGrid, List, Map, Filter } from 'lucide-react';

export default function TripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchTrips = async () => {
    try {
      const data = await getTrips(user?.id);
      setTrips(data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleDeleteTrip = async (id: string) => {
    const success = await apiDeleteTrip(id);
    if (success) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Filtering logic
  const filteredTrips = trips.filter((trip) => {
    const matchesTab =
      selectedTab === 'all' || trip.status.toLowerCase() === selectedTab.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destinations?.some((d) => d.city.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    all: trips.length,
    upcoming: trips.filter((t) => t.status === 'upcoming').length,
    ongoing: trips.filter((t) => t.status === 'ongoing').length,
    completed: trips.filter((t) => t.status === 'completed').length,
    draft: trips.filter((t) => t.status === 'draft').length,
  };

  return (
    <PageContainer>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Map className="w-7 h-7 text-amber-500" />
            <span>My Trips</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            All your multi-city journeys, itineraries, and drafts in one place.
          </p>
        </div>

        <Link
          href="/trips/new"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow-md shadow-amber-500/20 transition-all text-xs md:text-sm active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Controls Bar: Search, Status Tabs & Grid/List Toggle */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trips by name or destination..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xs"
            />
          </div>

          {/* Grid vs List View Toggle */}
          <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">View Mode:</span>
            <div className="flex items-center p-1 bg-slate-200/70 rounded-xl border border-slate-300/60">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/60 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Trips', count: tabCounts.all },
            { id: 'upcoming', label: 'Upcoming', count: tabCounts.upcoming },
            { id: 'ongoing', label: 'Ongoing', count: tabCounts.ongoing },
            { id: 'completed', label: 'Completed', count: tabCounts.completed },
            { id: 'draft', label: 'Drafts', count: tabCounts.draft },
          ].map((tab) => {
            const active = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    active ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trips Content */}
      {filteredTrips.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Map className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No trips found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No matching itineraries found for this status or search filter. Try adjusting your search query or create a new trip!
            </p>
          </div>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Plan a New Trip</span>
          </Link>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              viewMode={viewMode}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
