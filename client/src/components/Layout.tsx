import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Globe,
  Plus,
  LogOut,
  Menu,
  X,
  Search,
  ChevronRight,
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Trips', path: '/my-trips' },
    { name: 'Explore Destinations', path: '/search' },
    { name: 'Community Hub', path: '/community' },
    { name: 'Calendar View', path: '/calendar' },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ name: 'Admin Panel', path: '/admin' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    navigate(`/search?q=${encodeURIComponent(globalSearch.trim())}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1320] text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1320]/95 backdrop-blur-xl border-b border-slate-200 dark:border-[#1E2D42] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Brand Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 group shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all duration-300">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  GlobeTrotter
                </span>
                <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest -mt-1 whitespace-nowrap">
                  Multi-City Travel Platform
                </span>
              </div>
            </Link>

            {/* Header Search Bar */}
            {user && (
              <form onSubmit={handleGlobalSearch} className="hidden xl:flex items-center flex-1 max-w-xs mx-2">
                <div className="relative w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="Search destinations or trips..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all whitespace-nowrap"
                  />
                </div>
              </form>
            )}

            {/* Desktop Navigation Links with High-Contrast Active State */}
            {user && (
              <nav className="hidden md:flex items-center space-x-1.5 bg-slate-100/90 dark:bg-[#111E2E] p-1.5 rounded-2xl border border-slate-200 dark:border-[#1E2D42] shrink-0">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 inline-block ${
                        isActive
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 border border-emerald-400'
                          : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-[#162235]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right Action Controls Bar (Plan Trip + Profile + Logout) */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {user ? (
                <>
                  <Link
                    to="/create-trip"
                    className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black whitespace-nowrap shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="whitespace-nowrap">Plan New Trip</span>
                  </Link>

                  {/* Profile Avatar Settings */}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 p-1 bg-slate-100 dark:bg-[#162235] hover:bg-slate-200 dark:hover:bg-[#1E2D42] rounded-full transition border border-slate-200 dark:border-[#1E2D42] shrink-0"
                    title="Account Settings"
                  >
                    <img
                      src={user.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500"
                    />
                    <span className="hidden xl:inline text-xs font-black text-slate-800 dark:text-slate-200 pr-2 whitespace-nowrap">
                      {user.name.split(' ')[0]}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition shrink-0"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2 shrink-0">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162235] rounded-xl transition whitespace-nowrap"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-extrabold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition whitespace-nowrap"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
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

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-slate-200 dark:border-[#1E2D42] bg-white dark:bg-[#0B1320] px-4 pt-3 pb-5 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-[#162235] hover:text-emerald-600'
                  }`}
                >
                  <span className="whitespace-nowrap">{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100 dark:border-[#1E2D42] flex items-center justify-between">
              <Link
                to="/create-trip"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="whitespace-nowrap">Plan New Trip</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 px-3 py-2 whitespace-nowrap"
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
            <p>© 2026 GlobeTrotter Inc. Professional Multi-City Itinerary & Budget Platform.</p>
          </div>
          <div className="flex space-x-5 font-bold text-slate-600 dark:text-slate-300">
            <Link to="/search" className="hover:text-emerald-500 transition whitespace-nowrap">Explore Destinations</Link>
            <Link to="/community" className="hover:text-emerald-500 transition whitespace-nowrap">Public Itineraries</Link>
            <Link to="/profile" className="hover:text-emerald-500 transition whitespace-nowrap">Account & Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
