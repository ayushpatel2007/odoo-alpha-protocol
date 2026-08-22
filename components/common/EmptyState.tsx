'use client';

import React from 'react';
import { Inbox, Plus } from 'lucide-react';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
};

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12">
      <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mb-4">{icon || <Inbox className="w-6 h-6" />}</div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-md mt-2 leading-6">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold transition">
          <Plus className="w-4 h-4" /> {actionLabel}
        </button>
      )}
    </div>
  );
}
