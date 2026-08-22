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
  Globe,
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Globe className="w-6 h-6 text-slate-950 stroke-[2.2]" />
          </div>

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

      {/* Primary CTA */}
      <div className="px-4 py-4">
        <Link
          href="/trips/new"
          onClick={onCloseMobile}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-xl shadow-md shadow-amber-500/20 transition-all hover:shadow-amber-500/30 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Plan a New Trip</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 text-sm">
        {/* Main Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Main
          </div>

          <nav className="space-y-1">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center px-3 py-2.5 rounded-lg font-medium transition-all ${active
                      ? 'bg-amber-500/15 text-amber-400 border-l-4 border-amber-500 pl-2'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${active ? 'text-amber-400' : 'text-slate-400'
                        }`}
                    />

                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Plan Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Plan
          </div>

          <nav className="space-y-1">
            {planNav.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-400 cursor-not-allowed opacity-75 hover:bg-slate-800/30"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-400" />

                    <span>{item.name}</span>
                  </div>

                  {item.comingSoon && (
                    <span className="text-[10px] bg-slate-800 text-slate-400 font-medium px-2 py-0.5 rounded-full border border-slate-700">
                      Soon
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Account Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Account
          </div>

          <nav className="space-y-1">
            {accountNav.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${active
                      ? 'bg-amber-500/15 text-amber-400 border-l-4 border-amber-500 pl-2'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 ${active ? 'text-amber-400' : 'text-slate-400'
                      }`}
                  />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Badge / Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              `${user?.firstName?.[0] || 'A'}${user?.lastName?.[0] || 'P'}`
            )}
          </div>

          <div className="truncate min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {user
                ? `${user.firstName} ${user.lastName}`
                : 'Ayush Patel'}
            </p>

            <p className="text-[10px] text-slate-400 truncate">
              {user?.email || 'ayush@alphaprotocol.io'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}