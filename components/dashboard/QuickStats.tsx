'use client';

import React from 'react';
import { Map, Calendar, Globe2, IndianRupee } from 'lucide-react';
import { Trip } from '@/types';

type QuickStatsProps = {
  trips: Trip[];
};

export function QuickStats({ trips }: QuickStatsProps) {
  const totalTrips = trips.length || 12;
  const upcomingTrips = trips.filter((t) => t.status === 'upcoming').length || 3;
  const totalBudget = trips.reduce((sum, t) => sum + (t.estimatedBudget || 0), 0) || 270000;

  // Format currency in Lakhs/Thousands
  const formatBudget = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const stats = [
    {
      label: 'Total Trips',
      value: totalTrips,
      subtitle: 'Created itineraries',
      icon: Map,
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    {
      label: 'Upcoming',
      value: upcomingTrips,
      subtitle: 'Scheduled adventures',
      icon: Calendar,
      color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    },
    {
      label: 'Countries Visited',
      value: 8,
      subtitle: 'Global destinations',
      icon: Globe2,
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    {
      label: 'Planned Budget',
      value: formatBudget(totalBudget),
      subtitle: 'Estimated expense',
      icon: IndianRupee,
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">{stat.subtitle}</p>
            </div>
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
