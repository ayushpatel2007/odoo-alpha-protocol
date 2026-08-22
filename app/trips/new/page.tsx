'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { getDestinations } from '@/lib/api/destinations';
import { createTrip } from '@/lib/api/trips';
import { Destination, TravelStyle, BudgetTier } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';
import {
  MapPin,
  Calendar,
  Upload,
  Check,
  Plus,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle,
  X,
  Compass,
} from 'lucide-react';

function CreateTripFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDestId = searchParams.get('destination');
  const { user } = useAuth();

  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [destQuery, setDestQuery] = useState('');

  // Form State
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('2026-09-12');
  const [endDate, setEndDate] = useState('2026-09-21');
  const [description, setDescription] = useState('');
  const [selectedDestIds, setSelectedDestIds] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('balanced');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('moderate');
  const [interests, setInterests] = useState<string[]>(['Culture', 'Food', 'Adventure']);

  // Cover photo upload state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      const dests = await getDestinations();
      setAllDestinations(dests);

      if (preselectedDestId) {
        if (dests.some((d) => d.id === preselectedDestId)) {
          setSelectedDestIds([preselectedDestId]);
        }
      } else {
        setSelectedDestIds([dests[0]?.id || '', dests[3]?.id || ''].filter(Boolean));
      }
    }
    loadCatalog();
  }, [preselectedDestId]);

  const handleToggleDestination = (id: string) => {
    if (selectedDestIds.includes(id)) {
      setSelectedDestIds(selectedDestIds.filter((dId) => dId !== id));
    } else {
      setSelectedDestIds([...selectedDestIds, id]);
    }
  };

  const handleToggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();

    if (!tripName) {
      setError('Please enter a name for your trip.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date.');
      return;
    }
    if (selectedDestIds.length === 0) {
      setError('Please select at least one destination stop.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await createTrip({
        ownerId: user?.id || 'usr-demo-alpha-001',
        name: tripName,
        description,
        startDate,
        endDate,
        destinationIds: selectedDestIds,
        travelStyle,
        budgetTier,
        interests,
        coverFile,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg(isDraft ? 'Trip draft saved successfully!' : 'Trip created successfully!');
        setTimeout(() => {
          router.push('/trips');
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create trip.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCatalog = allDestinations.filter(
    (d) =>
      d.city.toLowerCase().includes(destQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(destQuery.toLowerCase())
  );

  const selectedDestinations = allDestinations.filter((d) => selectedDestIds.includes(d.id));

  return (
    <PageContainer>
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Step-by-Step Trip Creation Wizard
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Plan a New Trip
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Create a personalized multi-city travel plan with custom dates, destinations, and preferences.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-semibold animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
        {/* SECTION 1: TRIP INFORMATION */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-extrabold">
                1
              </span>
              <span>Trip Information</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Give your travel itinerary a name, assign travel dates, and upload a cover photo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Trip Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g. Grand European Summer Escape"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your travel goals, highlights, or notes for this trip..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Cover Photo Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Cover Photo (Optional)</label>
              <div className="h-52 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview(null);
                      }}
                      className="absolute top-3 right-3 p-1.5 bg-slate-950/70 text-white rounded-full hover:bg-rose-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center space-y-2">
                    <Upload className="w-8 h-8 text-amber-500 mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Upload Trip Cover Image</p>
                      <p className="text-[11px] text-slate-400">JPG, PNG or WEBP up to 5MB</p>
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors">
                      <span>Browse Files</span>
                      <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: DESTINATION SELECTION */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-extrabold">
                  2
                </span>
                <span>Destination Selection</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select one or multiple cities to include in your trip itinerary.
              </p>
            </div>
            <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
              {selectedDestIds.length} Destinations Selected
            </span>
          </div>

          {/* Search Input */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={destQuery}
              onChange={(e) => setDestQuery(e.target.value)}
              placeholder="Search destinations by city or country..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-1">
            {filteredCatalog.map((dest) => {
              const isSelected = selectedDestIds.includes(dest.id);
              return (
                <div
                  key={dest.id}
                  onClick={() => handleToggleDestination(dest.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={dest.imageUrl}
                    alt={dest.city}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm truncate">{dest.city}</h4>
                    <p className="text-xs text-amber-600 font-semibold truncate">{dest.country}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Est. ₹{dest.estimatedBudget.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'border-slate-300 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Stops Summary */}
          {selectedDestinations.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Selected Itinerary Sequence:
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {selectedDestinations.map((d, index) => (
                  <span
                    key={d.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs"
                  >
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    {d.city}, {d.country}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: TRAVEL PREFERENCES */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-extrabold">
                3
              </span>
              <span>Travel Preferences</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Customize travel pacing, budget tier, and primary activity interests for recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Travel Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Travel Style (Pacing)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'relaxed', label: 'Relaxed', desc: 'Leisurely pace' },
                  { id: 'balanced', label: 'Balanced', desc: 'Mix of sights' },
                  { id: 'packed', label: 'Packed', desc: 'Action-packed' },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setTravelStyle(s.id as TravelStyle)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      travelStyle === s.id
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{s.label}</div>
                    <div className="text-[10px] opacity-80">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Tier */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Budget Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'budget', label: 'Budget', desc: 'Hostels & public transport' },
                  { id: 'moderate', label: 'Moderate', desc: '3★ Hotels & tours' },
                  { id: 'premium', label: 'Premium', desc: 'Luxury stays & fine dining' },
                ].map((b) => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setBudgetTier(b.id as BudgetTier)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      budgetTier === b.id
                        ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{b.label}</div>
                    <div className="text-[10px] opacity-80">{b.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Interests & Activities</label>
            <div className="flex flex-wrap gap-2">
              {['Culture', 'Food', 'Adventure', 'Nature', 'History', 'Shopping', 'Nightlife'].map(
                (interest) => {
                  const active = interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => handleToggleInterest(interest)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {active ? `✓ ${interest}` : `+ ${interest}`}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e, true)}
            className="px-6 py-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-2xl transition-all disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-2xl shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Trip</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </form>
    </PageContainer>
  );
}

export default function CreateTripPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </PageContainer>
      }
    >
      <CreateTripFormContent />
    </Suspense>
  );
}
