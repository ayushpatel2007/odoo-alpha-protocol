'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Eye, EyeOff, ArrowRight, Lock, Mail, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans">
      {/* Left Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-10000 hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Globe className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white block">GlobeTrotter</span>
            <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
              Odoo × LDCE Hackathon · Team Alpha Protocol
            </span>
          </div>
        </div>

        {/* Center Tagline & Feature Highlights */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Travel Planning
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Empowering Personalized Travel Planning.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Craft multi-city itineraries, organize activities, track budgets seamlessly, and explore global destinations with intelligent travel recommendations.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 backdrop-blur-md p-3 rounded-xl border border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-City Routing</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 backdrop-blur-md p-3 rounded-xl border border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-Time Budgeting</span>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 text-xs text-slate-400">
          © 2026 GlobeTrotter. Built for Odoo × LDCE Hackathon by Team Alpha Protocol.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header Logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <Globe className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-lg text-white block">GlobeTrotter</span>
              <span className="text-[10px] text-amber-400 uppercase font-semibold">Team Alpha Protocol</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Sign in to manage your itineraries, destinations, and travel preferences.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <a href="#" className="text-xs font-semibold text-amber-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to GlobeTrotter</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Social Google Sign-in Visual Button */}
          <div className="space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-950 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider absolute">
                Or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-3 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          {/* Registration Redirect */}
          <div className="text-center text-xs text-slate-400 pt-2">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="font-bold text-amber-400 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
