'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Map,
  MapPin,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { getTrips } from '@/lib/api/trips';
import { getDestinations } from '@/lib/api/destinations';
import { getActivities } from '@/lib/api/activities';
import { Trip, Destination } from '@/types';
import { Activity } from '@/lib/api/activities';

type TopNavbarProps = {
  onToggleMobileMenu?: () => void;
};

export function TopNavbar({ onToggleMobileMenu }: TopNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    trips: Trip[];
    destinations: Destination[];
    activities: Activity[];
  }>({ trips: [], destinations: [], activities: [] });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/trips') return 'My Trips';
    if (pathname === '/trips/new') return 'Plan a New Trip';
    if (pathname.startsWith('/trips/')) return 'Trip Details';
    if (pathname === '/profile') return 'User Profile';
    if (pathname === '/settings') return 'Settings';
    return 'GlobeTrotter';
  };

  const displayName = user
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
    : 'Traveler';

  const notifications = [
    {
      id: '1',
      title: `Welcome to GlobeTrotter, ${user?.firstName || 'Traveler'}!`,
      message: 'Explore multi-city destination guides and create your personalized travel itinerary.',
      time: 'Just now',
      unread: true,
    },
  ];

  // Perform search across Trips, Destinations, and Activities
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults({ trips: [], destinations: [], activities: [] });
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [allTrips, allDestinations, allActivities] = await Promise.all([
          getTrips(user?.id),
          getDestinations({ query: searchQuery }),
          getActivities({ query: searchQuery }),
        ]);

        const filteredTrips = allTrips.filter((t) =>
          `${t.name} ${t.description || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults({
          trips: filteredTrips,
          destinations: allDestinations,
          activities: allActivities,
        });
        setShowSearchResults(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, user?.id]);

  // Click outside listener to close search results & menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await logout();
    router.push('/login');
  };

  const hasResults =
    searchResults.trips.length > 0 ||
    searchResults.destinations.length > 0 ||
    searchResults.activities.length > 0;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">GlobeTrotter</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <h1 className="font-bold text-slate-800 text-lg md:text-xl tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center: Interactive Global Search Bar */}
      <div ref={searchContainerRef} className="hidden lg:flex items-center max-w-md w-full mx-6 relative">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
            placeholder="Search trips, destinations, or activities..."
            className="w-full pl-10 pr-9 py-2 bg-slate-100/80 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Real-time Search Results Dropdown Overlay */}
        {showSearchResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center p-6 text-xs text-slate-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                <span>Searching trips, destinations, and activities...</span>
              </div>
            ) : !hasResults ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No matching results found for <span className="font-bold text-slate-700">&quot;{searchQuery}&quot;</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Trips Results Section */}
                {searchResults.trips.length > 0 && (
                  <div>
                    <div className="px-4 py-1 text-[10px] font-extrabold uppercase text-amber-600 tracking-wider flex items-center gap-1.5">
                      <Map className="w-3 h-3" />
                      <span>Trips ({searchResults.trips.length})</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {searchResults.trips.map((t) => (
                        <Link
                          key={t.id}
                          href={`/trips/${t.id}`}
                          onClick={() => setShowSearchResults(false)}
                          className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900">{t.name}</p>
                            <p className="text-[11px] text-slate-500 truncate max-w-xs">{t.description || `${t.startDate} – ${t.endDate}`}</p>
                          </div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                            Trip
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Destinations Results Section */}
                {searchResults.destinations.length > 0 && (
                  <div>
                    <div className="px-4 py-1 text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      <span>Destinations ({searchResults.destinations.length})</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {searchResults.destinations.map((d) => (
                        <Link
                          key={d.id}
                          href="/explore/destinations"
                          onClick={() => setShowSearchResults(false)}
                          className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={d.imageUrl} alt={d.city} className="w-7 h-7 rounded-lg object-cover" />
                            <div>
                              <p className="text-xs font-bold text-slate-900">{d.city}, {d.country}</p>
                              <p className="text-[11px] text-slate-500">{d.region}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full">
                            Destination
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities Results Section */}
                {searchResults.activities.length > 0 && (
                  <div>
                    <div className="px-4 py-1 text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Activities ({searchResults.activities.length})</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {searchResults.activities.map((a) => (
                        <Link
                          key={a.id}
                          href="/explore/activities"
                          onClick={() => setShowSearchResults(false)}
                          className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900">{a.title}</p>
                            <p className="text-[11px] text-slate-500">{a.category} • ₹{a.estimatedCost.toLocaleString('en-IN')}</p>
                          </div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                            Activity
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-800">Notifications</h3>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  1 New
                </span>
              </div>
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full hover:bg-slate-100/80 transition-colors border border-slate-200/60"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                `${user?.firstName?.[0] || 'T'}${user?.lastName?.[0] || ''}`
              )}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
              {displayName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || ''}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  View Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Account Settings
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1 mt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
