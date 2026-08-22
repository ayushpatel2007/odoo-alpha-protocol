'use client';

import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuth } from '@/components/auth/AuthContext';
import { updateProfile, getPreferences } from '@/lib/api/users';
import { getSavedDestinations, toggleSaveDestination } from '@/lib/api/destinations';
import { Destination, TravelPreferences } from '@/types';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Upload,
  Heart,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  Star,
  Trash2,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, preferences, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || 'Ayush');
  const [lastName, setLastName] = useState(user?.lastName || 'Patel');
  const [email, setEmail] = useState(user?.email || 'ayush@alphaprotocol.io');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [city, setCity] = useState(user?.city || 'Ahmedabad');
  const [country, setCountry] = useState(user?.country || 'India');
  const [bio, setBio] = useState(user?.bio || 'Avid explorer & lead architect for Team Alpha Protocol.');

  const [savedDestinations, setSavedDestinations] = useState<Destination[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone || '');
      setCity(user.city || '');
      setCountry(user.country || '');
      setBio(user.bio || '');

      getSavedDestinations(user.id).then(setSavedDestinations);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      const updated = await updateProfile(user.id, {
        firstName,
        lastName,
        phone,
        city,
        country,
        bio,
      });

      setUser(updated);
      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSaved = async (destinationId: string) => {
    if (!user) return;
    await toggleSaveDestination(user.id, destinationId);
    setSavedDestinations((prev) => prev.filter((d) => d.id !== destinationId));
  };

  return (
    <PageContainer>
      {/* Profile Header Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-2xl overflow-hidden ring-4 ring-amber-500/20 shrink-0">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={firstName} className="w-full h-full object-cover" />
            ) : (
              `${firstName?.[0] || 'A'}${lastName?.[0] || 'P'}`
            )}
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {user ? `${user.firstName} ${user.lastName}` : 'Ayush Patel'}
              </h1>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Team Lead
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">{user?.email || 'ayush@alphaprotocol.io'}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                {city && country ? `${city}, ${country}` : 'Ahmedabad, India'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Member since Jan 2026
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 shrink-0 self-center md:self-auto">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancel Editing</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Profile Form & Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editable Profile Details */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" />
                <span>Personal Information</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your account credentials and travel profile.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">First Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Last Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">City</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Country</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Bio</label>
              <textarea
                rows={3}
                disabled={!isEditing}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            {isEditing && (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Right Col: Travel Preferences Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6 h-fit">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Travel Preferences</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Your travel style & interests.</p>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Pacing & Style
              </span>
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-extrabold rounded-full capitalize">
                {preferences.travelStyle || 'Balanced'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Budget Preference
              </span>
              <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-extrabold rounded-full capitalize">
                {preferences.budgetTier || 'Moderate'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Activity Interests
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(preferences.interests || ['Culture', 'Food', 'Adventure', 'History']).map((int) => (
                  <span
                    key={int}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                  >
                    {int}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Destinations Section */}
      <div className="space-y-6">
        <div className="border-b border-slate-200/80 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Saved Wishlist Destinations</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cities and stops you saved for future travel planning.
          </p>
        </div>

        {savedDestinations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center space-y-2">
            <p className="text-xs text-slate-500">No saved destinations yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {savedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm flex items-center justify-between gap-3 group"
              >
                <img
                  src={dest.imageUrl}
                  alt={dest.city}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-900 text-xs truncate">{dest.city}</h4>
                  <p className="text-[11px] text-amber-600 font-semibold truncate">{dest.country}</p>
                  <p className="text-[10px] text-slate-400">Est. ₹{dest.estimatedBudget.toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={() => handleRemoveSaved(dest.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
