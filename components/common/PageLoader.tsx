'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export function PageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="min-h-[280px] flex flex-col items-center justify-center gap-3 text-slate-400" role="status" aria-live="polite">
      <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
