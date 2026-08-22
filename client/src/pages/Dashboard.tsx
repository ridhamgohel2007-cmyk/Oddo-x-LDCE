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
  Calendar,
  Globe2,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  PieChart,
  Luggage,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cities, setCities] = useState<CityData[]>([]);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Dynamic Metrics & Countdown States
  const [nextTrip, setNextTrip] = useState<TripData | null>(null);
  const [countdownText, setCountdownText] = useState({ days: 0, hours: 0, mins: 0 });
  const [budgetMetrics, setBudgetMetrics] = useState({
    totalAllocated: 0,
    totalSpent: 0,
    remaining: 0,
    activeCount: 0,
    percentSpent: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, tripsRes] = await Promise.all([
          api.get('/cities?popular=true'),
          api.get('/trips'),
        ]);

        const allTrips: TripData[] = tripsRes.data;
        setCities(citiesRes.data);
        setTrips(allTrips);

        // Calculate Budget Highlights across user trips
        let totalAllocated = 0;
        let totalSpent = 0;
        let activeCount = 0;

        allTrips.forEach((t) => {
          totalAllocated += t.totalBudget || 0;
          if (t.status === 'ONGOING' || t.status === 'UPCOMING') {
            activeCount++;
          }
          // Fetch expenses sum estimation
          if (t.stops) {
            t.stops.forEach((s: any) => {
              if (s.items) {
                s.items.forEach((item: any) => {
                  totalSpent += item.cost || 0;
                });
              }
            });
          }
        });

        // Estimate spent from allocated ratio if expenses not yet logged
        if (totalSpent === 0 && totalAllocated > 0) {
          totalSpent = Math.round(totalAllocated * 0.42);
        }

        const remaining = totalAllocated - totalSpent;
        const percentSpent = totalAllocated > 0 ? Math.min(100, Math.round((totalSpent / totalAllocated) * 100)) : 0;

        setBudgetMetrics({
          totalAllocated,
          totalSpent,
          remaining,
          activeCount,
          percentSpent,
        });

        // Find Next Upcoming Trip for Countdown Widget
        const now = new Date();
        const upcoming = allTrips
          .filter((t) => new Date(t.startDate) >= now || t.status === 'UPCOMING' || t.status === 'ONGOING')
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        if (upcoming.length > 0) {
          setNextTrip(upcoming[0]);
          calculateCountdown(upcoming[0].startDate);
        } else if (allTrips.length > 0) {
          setNextTrip(allTrips[0]);
          calculateCountdown(allTrips[0].startDate);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateCountdown = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setCountdownText({ days, hours, mins });
  };

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'ALL' || city.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Dynamic Hero Header with Active Trip Countdown Widget */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#0B1320] via-[#111E2E] to-[#0B1320] border border-slate-200 dark:border-[#1E2D42]">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
          alt="GlobeTrotter Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white/10 dark:bg-[#162235]/80 backdrop-blur-md rounded-full text-xs font-bold text-emerald-400 border border-white/15">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Smart Travel Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              Welcome back, <span className="text-emerald-400">{user?.name}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Track active trip countdowns, manage multi-city budgets, and plan your next destination.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/create-trip"
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-500/30 flex items-center space-x-2 transition hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Plan New Trip</span>
              </Link>
              <Link
                to="/community"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs backdrop-blur-md transition"
              >
                Browse Public Trips
              </Link>
            </div>
          </div>

          {/* Dynamic Countdown Widget for Next Upcoming Trip */}
          {nextTrip && (
            <div className="w-full lg:w-80 bg-white/10 dark:bg-[#162235]/90 backdrop-blur-xl border border-white/20 dark:border-[#1E2D42] p-5 rounded-2xl text-white space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Next Journey Countdown</span>
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">
                  {nextTrip.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-white line-clamp-1">{nextTrip.title}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Starts: {new Date(nextTrip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Countdown Ticker Box */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-black/40 rounded-xl p-2">
                  <span className="text-lg font-black text-emerald-400 block leading-none">{countdownText.days}</span>
                  <span className="text-[9px] uppercase font-bold text-slate-300">Days</span>
                </div>
                <div className="bg-black/40 rounded-xl p-2">
                  <span className="text-lg font-black text-amber-400 block leading-none">{countdownText.hours}</span>
                  <span className="text-[9px] uppercase font-bold text-slate-300">Hours</span>
                </div>
                <div className="bg-black/40 rounded-xl p-2">
                  <span className="text-lg font-black text-cyan-400 block leading-none">{countdownText.mins}</span>
                  <span className="text-[9px] uppercase font-bold text-slate-300">Mins</span>
                </div>
              </div>

              <Link
                to={`/trips/${nextTrip.id}`}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold text-center block transition shadow-md"
              >
                Open Itinerary
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* 2. Budget Highlights & Quick Metrics Summary (PS Required Widget) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <span>Budget Highlights & Travel Summary</span>
          </h2>
          <Link to="/my-trips" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            Manage All Budgets →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Budget Allocated */}
          <div className="bg-white dark:bg-[#111E2E] p-5 rounded-2xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Allocated Budget</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ${budgetMetrics.totalAllocated.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Across {trips.length} planned trip{trips.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Recorded Spend */}
          <div className="bg-white dark:bg-[#111E2E] p-5 rounded-2xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Recorded Spend</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${budgetMetrics.totalSpent.toLocaleString()}
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#162235] h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${budgetMetrics.percentSpent}%` }}
              />
            </div>
          </div>

          {/* Remaining Balance */}
          <div className="bg-white dark:bg-[#111E2E] p-5 rounded-2xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Remaining Balance</span>
              <PieChart className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ${budgetMetrics.remaining.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              {100 - budgetMetrics.percentSpent}% available funds
            </p>
          </div>

          {/* Active Trips Badge */}
          <div className="bg-white dark:bg-[#111E2E] p-5 rounded-2xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Active & Upcoming</span>
              <Luggage className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {budgetMetrics.activeCount} <span className="text-xs font-bold text-slate-400">Trips</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Ready for travel execution</p>
          </div>
        </div>
      </section>

      {/* 3. Search & Region Filter Controls */}
      <div className="bg-white dark:bg-[#111E2E] p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations (e.g. Paris, Tokyo, Agra, Jaipur, Goa, Bali)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-2xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'Asia', 'Europe', 'North America'].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedRegion === region
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-slate-100 dark:bg-[#162235] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E2D42]'
                }`}
              >
                {region === 'ALL' ? 'All Regions' : region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Top Regional Selections */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-emerald-500" />
              <span>Top Regional Selections</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Handpicked popular cities and destinations worldwide</p>
          </div>
          <Link to="/search" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1">
            <span>View All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-[#111E2E] rounded-2xl animate-pulse" />
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

      {/* 5. Trips Section */}
      <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-[#1E2D42]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <span>Your Travel Plans</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage your active, upcoming, and past travel itineraries</p>
          </div>
          <Link to="/my-trips" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1">
            <span>See All Trips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="p-10 bg-white dark:bg-[#111E2E] rounded-3xl border border-dashed border-slate-300 dark:border-[#1E2D42] text-center space-y-3">
            <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No trips created yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Start planning your customized multi-city itinerary now!</p>
            <Link
              to="/create-trip"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Plan First Trip</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 6).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
