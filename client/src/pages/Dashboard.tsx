import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { CityCard, CityData } from '../components/CityCard';
import { TripCard, TripData } from '../components/TripCard';
import {
  Search,
  Plus,
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Filter,
  TrendingUp,
  Globe2,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cities, setCities] = useState<CityData[]>([]);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, tripsRes] = await Promise.all([
          api.get('/cities?popular=true'),
          api.get('/trips?limit=4'),
        ]);
        setCities(citiesRes.data);
        setTrips(tripsRes.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'ALL' || city.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-10 pb-12">
      {/* 1. Hero Banner Image (Wireframe Screen 3) */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 min-h-[340px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
          alt="GlobeTrotter Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay"
        />
        <div className="relative z-10 p-8 sm:p-12 max-w-2xl text-white space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-300 border border-white/10">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Plan Smart. Travel Stress-Free.</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Design Your Next <span className="text-emerald-400">Multi-City</span> Journey
          </h1>
          <p className="text-sm sm:text-base text-gray-200 font-normal">
            Welcome back, <span className="font-bold text-white">{user?.name}</span>! Organize day-wise stops, auto-calculate trip budgets, and discover curated activities.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/create-trip"
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/30 flex items-center space-x-2 transition hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Plan a Trip</span>
            </Link>
            <Link
              to="/community"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-semibold text-sm backdrop-blur-md transition"
            >
              Browse Public Itineraries
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-gray-400 dark:text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations (e.g. Paris, Tokyo, Bali)..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'Europe', 'Asia', 'North America'].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                  selectedRegion === region
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {region === 'ALL' ? 'All Regions' : region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Top Regional Selections (Screen 3 Wireframe) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center space-x-2">
              <Globe2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 dark:from-emerald-400 dark:via-teal-300 dark:to-white bg-clip-text text-transparent font-black">
                Top Regional Selections
              </span>
            </h2>
            <p className="text-xs font-medium text-gray-600 dark:text-slate-400 mt-0.5">Popular travel destinations recommended for your trip builder</p>
          </div>
          <Link to="/search" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            View All Cities →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.slice(0, 6).map((city) => (
              <CityCard
                key={city.id}
                city={city}
                onSelect={(selectedCity) => {
                  navigate(`/create-trip?cityId=${selectedCity.id}`);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Previous / Upcoming Trips Grid */}
      <section className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 dark:from-emerald-400 dark:via-teal-300 dark:to-white bg-clip-text text-transparent font-black">
                Your Recent Trips
              </span>
            </h2>
            <p className="text-xs font-medium text-gray-600 dark:text-slate-400 mt-0.5">Access your active and upcoming travel plans</p>
          </div>
          <Link to="/my-trips" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            See All My Trips →
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-300 dark:border-slate-700 text-center space-y-3">
            <Compass className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto" />
            <h3 className="text-base font-black text-gray-900 dark:text-white">No trips created yet</h3>
            <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 max-w-sm mx-auto">Start planning your customized multi-city itinerary now!</p>
            <Link
              to="/create-trip"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Plan First Trip</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Floating Quick Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <Link
          to="/create-trip"
          className="flex items-center space-x-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-sm shadow-2xl shadow-emerald-600/50 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Plan a Trip</span>
        </Link>
      </div>
    </div>
  );
};
