import React from 'react';
import { TripStatus } from '@/types';

type TripStatusBadgeProps = {
  status: TripStatus;
};

export function TripStatusBadge({ status }: TripStatusBadgeProps) {
  const configs: Record<TripStatus, { label: string; className: string }> = {
    draft: {
      label: 'Draft',
      className: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    upcoming: {
      label: 'Upcoming',
      className: 'bg-amber-50 text-amber-700 border-amber-300',
    },
    ongoing: {
      label: 'Ongoing',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse',
    },
    completed: {
      label: 'Completed',
      className: 'bg-indigo-50 text-indigo-700 border-indigo-300',
    },
  };

  const config = configs[status] || configs.draft;

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs inline-flex items-center gap-1.5 ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
