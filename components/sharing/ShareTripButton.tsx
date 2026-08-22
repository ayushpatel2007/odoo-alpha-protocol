'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { setTripPublic } from '@/lib/api/sharing';

export function ShareTripButton({ tripId, initialPublic = false, initialSlug = null }: { tripId: string; initialPublic?: boolean; initialSlug?: string | null }) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [slug, setSlug] = useState<string | null>(initialSlug);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    try {
      const next = !isPublic;
      const nextSlug = await setTripPublic(tripId, next);
      setIsPublic(next);
      setSlug(nextSlug);
    } finally {
      setSaving(false);
    }
  }

  async function copy() {
    if (!slug) return;
    const url = `${window.location.origin}/shared/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm font-extrabold text-slate-900">Share this trip</p><p className="mt-1 text-xs text-slate-500">{isPublic ? 'Anyone with the link can view it.' : 'This trip is private.'}</p></div>
        <button disabled={saving} onClick={toggle} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold ${isPublic ? 'bg-slate-900 text-white' : 'bg-amber-500 text-slate-950'}`}><Share2 className="h-4 w-4" />{saving ? 'Saving...' : isPublic ? 'Make Private' : 'Make Public'}</button>
      </div>
      {isPublic && slug && <div className="mt-3 flex gap-2"><input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/shared/${slug}`} className="min-w-0 flex-1 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600" /><button onClick={copy} className="rounded-xl bg-slate-100 px-3 text-slate-700" aria-label="Copy share link">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button></div>}
    </div>
  );
}
