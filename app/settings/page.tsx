'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Settings,
  User,
  Globe2,
  Bell,
  Lock,
  AlertTriangle,
  CheckCircle,
  Save,
  ShieldAlert,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, preferences, updatePreferences } = useAuth();

  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'notifications' | 'privacy' | 'danger'>('account');

  // Preferences State
  const [language, setLanguage] = useState(preferences.language || 'en');
  const [currency, setCurrency] = useState(preferences.currency || 'INR');
  const [travelStyle, setTravelStyle] = useState(preferences.travelStyle || 'balanced');

  // Notification Toggles
  const [tripReminders, setTripReminders] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [recommendations, setRecommendations] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(false);

  // Privacy Toggles
  const [publicProfile, setPublicProfile] = useState(false);
  const [publicTrips, setPublicTrips] = useState(true);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSavePreferences = async () => {
    await updatePreferences({
      ...preferences,
      language,
      currency,
      travelStyle: travelStyle as any,
    });
    setSuccessMsg('Settings updated successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-amber-500" />
          <span>Account Settings</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Manage your account credentials, travel preferences, notifications, and privacy options.
        </p>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar Tabs */}
        <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm space-y-1 h-fit">
          {[
            { id: 'account', label: 'Account Information', icon: User },
            { id: 'preferences', label: 'Preferences', icon: Globe2 },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy & Visibility', icon: Lock },
            { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true },
          ].map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  active
                    ? tab.danger
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-slate-900 text-white shadow-sm'
                    : tab.danger
                    ? 'text-rose-600 hover:bg-rose-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : tab.danger ? 'text-rose-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm">
          {/* TAB 1: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Account Credentials</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update primary account details and security settings.
                </p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || 'ayush@alphaprotocol.io'}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400">Email address is managed via Supabase Auth.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">System & Travel Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Default currency, language, and travel style settings.
                </p>
              </div>

              <div className="space-y-5 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Display Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="en">English (US)</option>
                    <option value="fr">French (Français)</option>
                    <option value="es">Spanish (Español)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Default Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="INR">INR (₹ Indian Rupee)</option>
                    <option value="USD">USD ($ US Dollar)</option>
                    <option value="EUR">EUR (€ Euro)</option>
                    <option value="GBP">GBP (£ British Pound)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Notification Channels</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control which alerts you receive for trips and budget updates.
                </p>
              </div>

              <div className="space-y-4 max-w-lg">
                {[
                  {
                    title: 'Trip Reminders',
                    desc: 'Alerts for upcoming flight stops, dates, and packing deadlines.',
                    state: tripReminders,
                    setter: setTripReminders,
                  },
                  {
                    title: 'Budget & Cost Alerts',
                    desc: 'Notifications when estimated trip costs exceed threshold.',
                    state: budgetAlerts,
                    setter: setBudgetAlerts,
                  },
                  {
                    title: 'Travel Recommendations',
                    desc: 'Curated destination picks based on your travel style.',
                    state: recommendations,
                    setter: setRecommendations,
                  },
                  {
                    title: 'Community Updates',
                    desc: 'News and shared itineraries from fellow travelers.',
                    state: communityUpdates,
                    setter: setCommunityUpdates,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="w-5 h-5 rounded bg-white border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Privacy & Visibility</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage public visibility of your profile and itineraries.
                </p>
              </div>

              <div className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">Public Profile</h4>
                    <p className="text-[11px] text-slate-500">Allow other travelers to search and view your profile.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={publicProfile}
                    onChange={(e) => setPublicProfile(e.target.checked)}
                    className="w-5 h-5 rounded bg-white border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">Shareable Itineraries</h4>
                    <p className="text-[11px] text-slate-500">Allow sharing public links for completed trip itineraries.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={publicTrips}
                    onChange={(e) => setPublicTrips(e.target.checked)}
                    className="w-5 h-5 rounded bg-white border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DANGER ZONE */}
          {activeTab === 'danger' && (
            <div className="space-y-6">
              <div className="border-b border-rose-100 pb-4">
                <h3 className="text-lg font-extrabold text-rose-600 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>Danger Zone</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Irreversible account management actions.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 space-y-4 max-w-lg">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-rose-700">Delete Account</h4>
                  <p className="text-xs text-rose-600/90 leading-relaxed">
                    Permanently remove your account, profile details, and all created trip itineraries from GlobeTrotter. This action cannot be undone.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900">Are you absolutely sure?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will permanently delete your GlobeTrotter account and all associated trip itineraries.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  alert('Account deletion request acknowledged.');
                }}
                className="px-5 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
