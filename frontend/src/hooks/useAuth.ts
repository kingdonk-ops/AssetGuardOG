import { useState, useCallback } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<any>(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const saveAuth = useCallback((t: string, u: any) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await API.post('/auth/login', { email, password });
    saveAuth(data.access_token, data.user);
    return data;
  }, [saveAuth]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    saveAuth(data.access_token, data.user);
    return data;
  }, [saveAuth]);

  return { token, user, login, register, logout };
}
