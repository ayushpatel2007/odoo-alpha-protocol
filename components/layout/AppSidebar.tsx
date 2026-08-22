'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Compass,
  Calendar,
  Users,
  User,
  Settings,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export function AppSidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const mainNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Trips', href: '/trips', icon: Map },
    { name: 'Explore', href: '/explore/destinations', icon: Compass },
  ];

  const planNav = [
    { name: 'Calendar', href: '#', icon: Calendar, comingSoon: true },
    { name: 'Community', href: '#', icon: Users, comingSoon: true },
  ];

  const accountNav = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '#') return false;
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col h-full border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group"
          onClick={onCloseMobile}
        >
          <img
            src="/gt-ap-favicon.png"
            alt="GlobeTrotter Favicon"
            className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform bg-slate-950 p-0.5 border border-amber-500/30"
          />

          <div>
            <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1">
              GlobeTrotter
            </h1>

            <p className="text-[11px] font-medium text-amber-400/90 tracking-wide uppercase">
              Alpha Protocol
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {/* Main Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            Main Menu
          </p>
          <nav className="space-y-1 pt-2">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Plan Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            Planning & Collaboration
          </p>
          <nav className="space-y-1 pt-2">
            {planNav.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs text-slate-400 cursor-not-allowed hover:bg-slate-800/30"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.name}</span>
                  </div>
                  {item.comingSoon && (
                    <span className="text-[9px] font-bold bg-slate-800 text-amber-400/80 px-1.5 py-0.5 rounded border border-slate-700">
                      Soon
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Account Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            Account
          </p>
          <nav className="space-y-1 pt-2">
            {accountNav.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* CTA Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-850 p-4 rounded-2xl border border-slate-700/60 space-y-3">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">Create New Journey</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Customize dates, activities, and budget estimates.
            </p>
          </div>
          <Link
            href="/trips/new"
            onClick={onCloseMobile}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Trip</span>
          </Link>
        </div>
      </div>

      {/* User Profile Mini Footer */}
      {user && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
            ) : (
              `${user.firstName?.[0] || 'A'}${user.lastName?.[0] || 'P'}`
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
      )}
    </aside>
  );
}