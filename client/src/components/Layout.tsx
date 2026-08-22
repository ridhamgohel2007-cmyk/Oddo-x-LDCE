import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import {
  Compass,
  MapPin,
  Calendar,
  Globe,
  Users,
  Shield,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Luggage,
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Compass },
    { name: 'My Trips', path: '/my-trips', icon: Luggage },
    { name: 'Explore', path: '/search', icon: MapPin },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ name: 'Admin Panel', path: '/admin', icon: Shield });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1320] text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B1320]/90 backdrop-blur-xl border-b border-slate-200 dark:border-[#1E2D42] shadow-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  GlobeTrotter
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest -mt-1">
                  Travel Platform
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 dark:bg-[#111E2E] p-1.5 rounded-2xl border border-slate-200 dark:border-[#1E2D42]">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-white dark:bg-[#162235] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-[#1E2D42]'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#162235]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right Action Bar (ThemeToggle + Profile / Actions) */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Theme Toggle Component */}
              <ThemeToggle />

              {user ? (
                <>
                  <Link
                    to="/create-trip"
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/25 transition-all hover:scale-[1.02]"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Plan New Trip</span>
                  </Link>

                  {/* Profile Avatar */}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#162235] transition border border-slate-200 dark:border-[#1E2D42]"
                    title="User Settings"
                  >
                    <img
                      src={user.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/80"
                    />
                    <span className="hidden lg:inline text-xs font-bold text-slate-700 dark:text-slate-200 pr-1.5">
                      {user.name.split(' ')[0]}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162235] rounded-xl transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162235]"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-slate-200 dark:border-[#1E2D42] bg-white dark:bg-[#0B1320] px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-[#162235] hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <Icon className="w-4 h-4 text-emerald-500" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-100 dark:border-[#1E2D42] flex items-center justify-between">
              <Link
                to="/create-trip"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Plan New Trip</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 px-3 py-2"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0B1320] border-t border-slate-200 dark:border-[#1E2D42] py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-500" />
            <p>© 2026 GlobeTrotter Inc. Enterprise Multi-City Travel Planning Solution.</p>
          </div>
          <div className="flex space-x-5 font-semibold text-slate-600 dark:text-slate-300">
            <Link to="/search" className="hover:text-emerald-500 transition">Explore Destinations</Link>
            <Link to="/community" className="hover:text-emerald-500 transition">Public Itineraries</Link>
            <Link to="/profile" className="hover:text-emerald-500 transition">Account Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
