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
  ArrowRight,
  ShieldCheck,
  Compass as CompassIcon,
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
      {/* 1. Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 min-h-[360px] flex items-center border border-slate-800">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
          alt="GlobeTrotter Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
        />
        <div className="relative z-10 p-8 sm:p-14 max-w-3xl text-white space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white/10 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-xs font-bold text-cyan-300 border border-white/15">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Intelligent Multi-City Travel Planner</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Design Your Next <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">Multi-City</span> Journey
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Welcome back, <span className="font-bold text-white">{user?.name}</span>! Organize day-wise stops, auto-calculate trip budgets, and discover curated global activities.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/create-trip"
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Plan New Trip</span>
            </Link>
            <Link
              to="/community"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs backdrop-blur-md transition"
            >
              Browse Public Itineraries
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Search & Region Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations (e.g. Paris, Tokyo, Agra, Jaipur, Bali)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'Asia', 'Europe', 'North America'].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedRegion === region
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {region === 'ALL' ? 'All Regions' : region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Top Regional Selections */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Top Regional Selections</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Handpicked popular cities and destinations worldwide</p>
          </div>
          <Link to="/search" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1">
            <span>View All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
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
      <section className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <span>Your Travel Plans</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage your active, upcoming, and past travel itineraries</p>
          </div>
          <Link to="/my-trips" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1">
            <span>See All Trips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
            <CompassIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No trips created yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Start planning your customized multi-city itinerary now!</p>
            <Link
              to="/create-trip"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
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
    </div>
  );
};
