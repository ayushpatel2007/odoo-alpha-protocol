'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, Plus, User, Settings } from 'lucide-react';

export function MobileNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Trips', href: '/trips', icon: Map },
    { name: 'New Trip', href: '/trips/new', icon: Plus, isCta: true },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 z-40">
      {navItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;

        if (item.isCta) {
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-95 transition-transform">
                <Icon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-semibold text-amber-400 mt-1">{item.name}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
              active ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
