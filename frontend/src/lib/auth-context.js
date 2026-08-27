'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch, getToken, getUser, setToken, setUser, clearToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const cached = getUser();

    if (!token) {
      setLoading(false);
      return;
    }

    // Show cached user immediately for snappy UI, then always refresh from server
    if (cached) {
      setUserState(cached);
    }

    apiFetch('/api/auth/me')
      .then((me) => {
        setUser(me);
        setUserState(me);
      })
      .catch(() => {
        clearToken();
        setUserState(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      auth: false,
      body: { email, password },
    });
    setToken(data.token);
    setUser(data.user);
    setUserState(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      auth: false,
      body: payload,
    });
    setToken(data.token);
    setUser(data.user);
    setUserState(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUserState(null);
  }, []);

  const updateUser = useCallback((next) => {
    setUser(next);
    setUserState(next);
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await apiFetch('/api/auth/me');
    setUser(me);
    setUserState(me);
    return me;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
