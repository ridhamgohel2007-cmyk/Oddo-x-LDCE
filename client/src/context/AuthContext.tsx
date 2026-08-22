import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  phone?: string;
  city?: string;
  country?: string;
  bio?: string;
  profilePic?: string;
  language?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  toggleDemoRole: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  toggleDemoRole: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('globetrotter_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        localStorage.removeItem('globetrotter_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('globetrotter_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('globetrotter_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Instant Persona Switcher for Hackathon Demonstrations (Request Item 3)
  const toggleDemoRole = () => {
    if (!user) return;
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const updated = { ...user, role: newRole as 'USER' | 'ADMIN' };
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, toggleDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
