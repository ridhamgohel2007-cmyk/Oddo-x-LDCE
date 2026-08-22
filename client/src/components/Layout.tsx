import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 group -ml-1 sm:-ml-3 mr-6 sm:mr-10 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-baseline space-x-2 whitespace-nowrap">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  GlobeTrotter
                </span>
                <span className="hidden sm:inline text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  Personalized Travel
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center space-x-1.5 whitespace-nowrap">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-200/50 dark:border-emerald-800/50'
                          : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-slate-400'}`} />
                      <span className="whitespace-nowrap">{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {user ? (
                <>
                  <Link
                    to="/create-trip"
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] whitespace-nowrap shrink-0"
                  >
                    <PlusCircle className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Plan New Trip</span>
                  </Link>

                  {/* Profile Avatar */}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition border border-gray-200 dark:border-slate-800"
                    title="User Settings"
                  >
                    <img
                      src={user.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                    />
                    <span className="hidden lg:inline text-xs font-semibold text-gray-700 dark:text-slate-300 pr-2">
                      {user.name.split(' ')[0]}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                to="/create-trip"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold whitespace-nowrap shrink-0"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Plan New Trip</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-red-600 dark:text-red-400 px-3 py-2"
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
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-6 text-center text-xs text-gray-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <p>© 2026 GlobeTrotter Inc. Empowering Personalized Multi-City Travel Planning.</p>
          <div className="flex space-x-4 font-medium text-gray-600 dark:text-slate-300">
            <Link to="/search" className="hover:text-emerald-600 dark:hover:text-emerald-400">Explore Cities</Link>
            <Link to="/community" className="hover:text-emerald-600 dark:hover:text-emerald-400">Public Itineraries</Link>
            <Link to="/profile" className="hover:text-emerald-600 dark:hover:text-emerald-400">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
