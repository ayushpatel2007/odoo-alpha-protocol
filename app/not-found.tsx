'use client';

import Link from 'next/link';
import { ArrowLeft, Compass, Globe } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
          <Globe className="w-8 h-8" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">GlobeTrotter</p>
        <h1 className="text-6xl font-black tracking-tight mt-3">404</h1>
        <h2 className="text-2xl font-bold mt-2">Destination not found</h2>
        <p className="text-slate-400 mt-3 leading-6">This page does not exist or may have moved. Let&apos;s get you back to your trip.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <Link href="/explore/destinations" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium transition">
            <Compass className="w-4 h-4" /> Explore Destinations
          </Link>
        </div>
        <p className="text-xs text-slate-600 mt-10">Alpha Protocol · GlobeTrotter</p>
      </div>
    </main>
  );
}
