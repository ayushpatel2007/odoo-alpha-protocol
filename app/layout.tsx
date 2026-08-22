import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'GlobeTrotter — Empowering Personalized Travel Planning',
  description: 'GlobeTrotter is a personalized travel planning web application built for the Odoo × LDCE Hackathon by Team Alpha Protocol.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
