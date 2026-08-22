import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { TripCard, TripData } from '../components/TripCard';
import { User, Mail, Phone, MapPin, Globe, Save, Trash2, Edit, Luggage, ShieldAlert } from 'lucide-react';

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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserTrips();
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
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('CAUTION: Are you sure you want to permanently delete your GlobeTrotter account? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete('/auth/account');
      logout();
    } catch (err) {
      alert('Failed to delete account.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Screen 7 Wireframe Header: Image of the User + User Details with appropriate edit options */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center space-x-2">
            <User className="w-6 h-6 text-emerald-600" />
            <span>User Profile & Settings</span>
          </h1>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
            {user?.role === 'ADMIN' ? 'Admin Profile' : 'Standard Traveler'}
          </span>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
            {message}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Image of the User (Circle Avatar Wireframe Screen 7) */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-xl bg-gray-100">
                <img
                  src={profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-bold text-gray-400">Profile Image</span>
            </div>

            {/* User Details Form Fields */}
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Language Preference</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                  >
                    <option value="English">English</option>
                    <option value="French">French (Français)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Japanese">Japanese (日本語)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Profile Photo URL</label>
                  <input
                    type="url"
                    value={profilePic}
                    onChange={(e) => setProfilePic(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bio / Traveler Summary</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Screen 7 Wireframe: Preplanned Trips Section */}
      <section className="space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h2 className="text-xl font-extrabold text-gray-900">Preplanned Trips</h2>
          <p className="text-xs text-gray-500">Upcoming and active travel plans saved to your profile</p>
        </div>

        {preplannedTrips.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-gray-100 text-xs text-gray-400 text-center">
            No preplanned trips found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {preplannedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      {/* Screen 7 Wireframe: Previous Trips Section */}
      <section className="space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h2 className="text-xl font-extrabold text-gray-900">Previous Trips</h2>
          <p className="text-xs text-gray-500">Completed travel itineraries from past journeys</p>
        </div>

        {previousTrips.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-gray-100 text-xs text-gray-400 text-center">
            No completed previous trips.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {previousTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      {/* Danger Zone: Delete Account */}
      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-rose-900 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Delete Account</span>
          </h3>
          <p className="text-xs text-rose-700">Permanently delete your profile and all personal travel data from GlobeTrotter.</p>
        </div>

        <button
          onClick={handleDeleteAccount}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete My Account</span>
        </button>
      </div>
    </div>
  );
};
