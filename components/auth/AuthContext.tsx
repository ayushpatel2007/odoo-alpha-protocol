'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, TravelPreferences } from '@/types';
import { getCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister } from '@/lib/api/auth';
import { getPreferences, updatePreferences as apiUpdatePreferences } from '@/lib/api/users';
import { DEMO_PREFERENCES } from '@/lib/mock-data/seed-catalog';

type AuthContextType = {
  user: UserProfile | null;
  preferences: TravelPreferences;
  isLoading: boolean;
  login: typeof apiLogin;
  register: typeof apiRegister;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updatePreferences: (prefs: TravelPreferences) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<TravelPreferences>(DEMO_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
      if (u) {
        const prefs = await getPreferences(u.id);
        setPreferences(prefs);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error restoring session:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogin: typeof apiLogin = async (email, password) => {
    const res = await apiLogin(email, password);
    if (res.user) {
      setUser(res.user);
      const prefs = await getPreferences(res.user.id);
      setPreferences(prefs);
    }
    return res;
  };

  const handleRegister: typeof apiRegister = async (data) => {
    const res = await apiRegister(data);
    if (res.user) {
      setUser(res.user);
      const prefs = await getPreferences(res.user.id);
      setPreferences(prefs);
    }
    return res;
  };

  const handleLogout = async () => {
    await apiLogout();
    setUser(null);
  };

  const handleUpdatePreferences = async (newPrefs: TravelPreferences) => {
    if (user) {
      const updated = await apiUpdatePreferences(user.id, newPrefs);
      setPreferences(updated);
    } else {
      setPreferences(newPrefs);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        preferences,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshUser,
        updatePreferences: handleUpdatePreferences,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
