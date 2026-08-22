'use client';

import React, { useState } from 'react';
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
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

type TopNavbarProps = {
  onToggleMobileMenu?: () => void;
};

export function TopNavbar({ onToggleMobileMenu }: TopNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/trips') return 'My Trips';
    if (pathname === '/trips/new') return 'Plan a New Trip';
    if (pathname.startsWith('/trips/')) return 'Trip Details';
    if (pathname === '/profile') return 'User Profile';
    if (pathname === '/settings') return 'Settings';
    return 'GlobeTrotter';
  };

  const notifications = [
    {
      id: '1',
      title: 'European Escape Updated',
      message: 'New flight price estimates available for Paris stop.',
      time: '10m ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Welcome to GlobeTrotter!',
      message: 'Explore multi-city destination guides and create your first trip.',
      time: '1h ago',
      unread: false,
    },
  ];

  const handleSignOut = async () => {
    await logout();
    router.push('/login');
  };

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

      {/* Center: Search Bar */}
      <div className="hidden lg:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trips, destinations, or activities..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all"
          />
        </div>
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
                  2 New
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
                <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                `${user?.firstName?.[0] || 'A'}${user?.lastName?.[0] || 'P'}`
              )}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
              {user ? `${user.firstName} ${user.lastName}` : 'Ayush Patel'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'Ayush Patel'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || 'ayush@alphaprotocol.io'}
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
