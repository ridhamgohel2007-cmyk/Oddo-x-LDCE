import React, { useState, useEffect } from 'react';
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
  Sun,
  Moon,
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Theme Toggle State (Sun / Moon)
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Brand Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 group shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#714B67] via-[#7C3AED] to-[#00A09D] flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-all duration-300">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  GlobeTrotter
                </span>
                <span className="text-[10px] text-[#00A09D] dark:text-[#38BDF8] font-extrabold uppercase tracking-widest -mt-1 whitespace-nowrap">
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
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all whitespace-nowrap"
                  />
                </div>
              </form>
            )}

            {/* Desktop Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center space-x-1.5 bg-slate-100/90 dark:bg-[#1E293B] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shrink-0">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 inline-block ${
                        isActive
                          ? 'bg-[#714B67] dark:bg-[#7C3AED] text-white shadow-md shadow-purple-500/25 border border-purple-400'
                          : 'text-slate-700 dark:text-slate-300 hover:text-[#7C3AED] dark:hover:text-[#38BDF8] hover:bg-slate-200/60 dark:hover:bg-[#0F172A]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right Side User Profile, Theme Switcher & Actions */}
            {user ? (
              <div className="flex items-center space-x-2.5 shrink-0">
                <Link
                  to="/create-trip"
                  className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 bg-[#714B67] hover:bg-[#613E57] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 transition hover:-translate-y-0.5"
                >
                  <Plus className="w-4 h-4" />
                  <span className="whitespace-nowrap">Plan New Trip</span>
                </Link>

                {/* Theme Toggle Button (Sun / Moon - Request 2) */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-white/10 transition shadow-xs"
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label="Toggle Theme Mode"
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </button>

                {/* User Profile Avatar Pill (Request 2: Well-Padded & Unclipped) */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-white/10 shrink-0"
                  title={`${user.name} (${user.role})`}
                >
                  <img
                    src={user.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#7C3AED]/40 shrink-0"
                  />
                  <div className="hidden md:flex flex-col text-left max-w-[140px]">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 leading-tight truncate">
                      {user.name}
                    </span>
                    <span className="text-[9px] text-[#00A09D] dark:text-[#38BDF8] font-bold uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition rounded-xl hover:bg-slate-100 dark:hover:bg-[#1E293B]"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {/* Mobile Hamburger Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B]"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Theme Toggle Button when Logged Out */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-white/10 transition"
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </button>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#7C3AED]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#714B67] hover:bg-[#613E57] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] px-4 py-3 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#714B67] text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B]'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-white/10 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-[#7C3AED]" />
            <span className="font-extrabold text-slate-800 dark:text-slate-200">GlobeTrotter Enterprise</span>
            <span>— Smart Travel Planning Platform</span>
          </div>

          <div className="flex items-center space-x-4 font-semibold text-[11px]">
            <Link to="/community" className="hover:text-[#7C3AED]">Community</Link>
            <span>•</span>
            <Link to="/search" className="hover:text-[#7C3AED]">Explore</Link>
            <span>•</span>
            <Link to="/my-trips" className="hover:text-[#7C3AED]">Itineraries</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
