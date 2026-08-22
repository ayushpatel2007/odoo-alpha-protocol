'use client';

import { IndianRupee } from 'lucide-react';

export function BudgetSummary({ estimated, spent }: { estimated: number; spent: number }) {
  const remaining = Math.max(estimated - spent, 0);
  const percent = estimated > 0 ? Math.min((spent / estimated) * 100, 100) : 0;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold text-slate-500">Estimated Budget</p>
        <p className="mt-2 flex items-center text-2xl font-black text-slate-900"><IndianRupee className="h-5 w-5" />{estimated.toLocaleString('en-IN')}</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold text-slate-500">Spent</p>
        <p className="mt-2 flex items-center text-2xl font-black text-slate-900"><IndianRupee className="h-5 w-5" />{spent.toLocaleString('en-IN')}</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${percent}%` }} /></div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold text-slate-500">Remaining</p>
        <p className="mt-2 flex items-center text-2xl font-black text-emerald-600"><IndianRupee className="h-5 w-5" />{remaining.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
}
