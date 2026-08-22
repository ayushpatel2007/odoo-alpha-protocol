'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('GlobeTrotter application error:', error); }, [error]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">GlobeTrotter</p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-3">Something went wrong</h1>
        <p className="text-slate-400 mt-3 leading-6">We couldn&apos;t complete that request. Try again, or return to your dashboard.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <button type="button" onClick={() => reset()} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium transition">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
