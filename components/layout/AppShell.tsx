'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import { MobileNavigation } from './MobileNavigation';
import { X } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Unauthenticated auth screens do not render the application shell
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return <main className="min-h-screen bg-slate-950 text-slate-100">{children}</main>;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <AppSidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-slate-900 h-full shadow-2xl z-10">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <AppSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopNavbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-slate-50">{children}</main>
        <MobileNavigation />
      </div>
    </div>
  );
}
