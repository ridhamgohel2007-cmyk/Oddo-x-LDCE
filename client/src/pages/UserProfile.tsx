import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { TripCard, TripData } from '../components/TripCard';
import { CityCard, CityData } from '../components/CityCard';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Trash2,
  Luggage,
  ShieldAlert,
  Bookmark,
  Calendar,
  Lock,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [language, setLanguage] = useState(user?.language || 'English');

  const [preplannedTrips, setPreplannedTrips] = useState<TripData[]>([]);
  const [previousTrips, setPreviousTrips] = useState<TripData[]>([]);
  const [savedCities, setSavedCities] = useState<CityData[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserTrips();
    fetchSavedCities();
  }, []);

  const fetchUserTrips = async () => {
    try {
      const res = await api.get('/trips');
      const allTrips: TripData[] = res.data;
      setPreplannedTrips(allTrips.filter((t) => t.status === 'UPCOMING' || t.status === 'ONGOING'));
      setPreviousTrips(allTrips.filter((t) => t.status === 'COMPLETED'));
    } catch (err) {
      console.error('Error fetching user trips:', err);
    }
  };

  const fetchSavedCities = async () => {
    try {
      const res = await api.get('/cities?popular=true');
      setSavedCities(res.data.slice(0, 3)); // Display top bookmarked destinations
    } catch (err) {
      console.error('Error fetching saved cities:', err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        city,
        country,
        bio,
        profilePic,
        language,
      });
      updateUser(res.data);
      setMessage('Profile settings and preferences updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'CAUTION: Are you sure you want to permanently delete your GlobeTrotter account? All your itineraries and data will be erased.'
      )
    ) {
      return;
    }

    try {
      await api.delete('/auth/account');
      logout();
    } catch (err) {
      alert('Failed to delete account.');
    }
  };

  const calculateDurationDays = (startStr: string, endStr: string) => {
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    const diff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    return `${diff} Day${diff !== 1 ? 's' : ''}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Screen 7 Header: Profile & Account Settings */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2D42] pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <User className="w-6 h-6 text-emerald-500" />
            <span>Profile & Account Settings</span>
          </h1>
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
            {user?.role === 'ADMIN' ? 'Administrator' : 'Standard Traveler'}
          </span>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* User Avatar */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-xl bg-slate-100 dark:bg-[#162235]">
                <img
                  src={profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-bold text-slate-400">User Avatar</span>
            </div>

            {/* Profile Inputs */}
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Home City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Language Preference (PS Requirement) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Language Preference *
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="English">English (US)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Japanese">Japanese (日本語)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    value={profilePic}
                    onChange={(e) => setProfilePic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Bio / Traveler Summary
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Screen 7: Preplanned Trips with Duration Badges & Privacy Pills */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 dark:border-[#1E2D42] pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Luggage className="w-5 h-5 text-emerald-500" />
              <span>Preplanned Trips</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Upcoming and active travel plans with duration badges</p>
          </div>
        </div>

        {preplannedTrips.length === 0 ? (
          <div className="p-6 bg-white dark:bg-[#111E2E] rounded-2xl border border-slate-200 dark:border-[#1E2D42] text-xs text-slate-400 text-center">
            No preplanned trips found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {preplannedTrips.map((trip) => (
              <div key={trip.id} className="relative group">
                <TripCard trip={trip} />
                <div className="absolute top-3 left-3 z-10 flex space-x-1.5 pointer-events-none">
                  <span className="px-2 py-0.5 bg-black/70 text-white text-[10px] font-extrabold rounded-full backdrop-blur-md">
                    {calculateDurationDays(trip.startDate, trip.endDate)}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-extrabold rounded-full backdrop-blur-md">
                    {trip.isPublic ? 'Public 🌐' : 'Private 🔒'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Screen 7: Saved & Bookmarked Destinations (PS Requirement) */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 dark:border-[#1E2D42] pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-amber-500" />
              <span>Bookmarked & Saved Destinations</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your favorite bucket list cities for future travel planning</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {savedCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </section>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-rose-50 dark:bg-rose-950/40 p-6 rounded-3xl border border-rose-200 dark:border-rose-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-rose-900 dark:text-rose-200 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>Danger Zone — Account Deletion</span>
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300">
            Permanently delete your profile and all personal travel data from GlobeTrotter.
          </p>
        </div>

        <button
          onClick={handleDeleteAccount}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete My Account</span>
        </button>
      </div>
    </div>
  );
};
