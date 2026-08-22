'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Compass, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export function WelcomeHeader() {
  const { user } = useAuth();
  const firstName = user?.firstName || 'Ayush';

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="space-y-2 relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> GlobeTrotter Assistant Active
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
          Good morning, {firstName} 👋
        </h1>
        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
          Ready for your next adventure? Organize itineraries, discover destinations, and keep your travel budget on track.
        </p>
      </div>

      <div className="flex items-center gap-3 relative z-10 shrink-0">
        <Link
          href="/trips/new"
          className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40 active:scale-95 text-xs md:text-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Plan a New Trip</span>
        </Link>
        <a
          href="#explore-destinations"
          className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-2xl transition-all text-xs md:text-sm"
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Explore Destinations</span>
        </a>
      </div>
    </div>
  );
}
