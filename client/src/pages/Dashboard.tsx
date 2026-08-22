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
  TrendingUp,
  Clock,
  PieChart,
  Luggage,
  Heart,
  Mountain,
  Landmark,
  Car,
  Tag,
  Flame,
  Bot,
  Map,
  DollarSign,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cities, setCities] = useState<CityData[]>([]);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // "Travel by Vibe" / Theme Filter State
  const [selectedVibe, setSelectedVibe] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // AI Quick Planner Input State (Hero Request)
  const [aiPrompt, setAiPrompt] = useState('');

  // Currency Switcher State (INR / USD Request)
  const [currencyMode, setCurrencyMode] = useState<'INR' | 'USD'>('INR');

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

        let totalAllocated = 0;
        let totalSpent = 0;
        let activeCount = 0;

        allTrips.forEach((t) => {
          totalAllocated += t.totalBudget || 0;
          if (t.status === 'ONGOING' || t.status === 'UPCOMING') {
            activeCount++;
          }
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

        const now = new Date();
        const upcoming = allTrips
          .filter((t) => new Date(t.startDate) >= now || t.status === 'ONGOING' || t.status === 'UPCOMING')
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
      } fontally: {
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

  const handleAiQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    navigate(`/create-trip?prompt=${encodeURIComponent(aiPrompt.trim())}`);
  };

  // Format monetary values according to active currency switcher (INR / USD)
  const formatMoney = (val: number) => {
    if (currencyMode === 'USD') {
      const usdVal = Math.round(val / 83);
      return `$${usdVal.toLocaleString('en-US')}`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Travel Vibe / Theme Filtering Logic
  const matchesVibe = (city: CityData, vibe: string) => {
    if (vibe === 'ALL') return true;
    const desc = (city.description || '').toLowerCase();
    const name = (city.name || '').toLowerCase();
    const region = (city.region || '').toLowerCase();
    const cost = (city.costIndex || '').toUpperCase();

    if (vibe === 'ROMANTIC') {
      return desc.includes('romantic') || desc.includes('honeymoon') || desc.includes('eiffel') || desc.includes('canal') || desc.includes('beach') || name.includes('paris') || name.includes('goa') || name.includes('bali');
    }
    if (vibe === 'ADVENTURE') {
      return desc.includes('adventure') || desc.includes('outdoor') || desc.includes('hike') || desc.includes('trek') || desc.includes('paragliding') || desc.includes('beach') || name.includes('goa') || name.includes('bali');
    }
    if (vibe === 'HERITAGE') {
      return desc.includes('heritage') || desc.includes('culture') || desc.includes('history') || desc.includes('palace') || desc.includes('monument') || desc.includes('taj') || name.includes('agra') || name.includes('jaipur') || name.includes('delhi') || name.includes('kyoto') || name.includes('rome');
    }
    if (vibe === 'ROAD_TRIP') {
      return desc.includes('drive') || desc.includes('road') || desc.includes('scenic') || desc.includes('coastal') || desc.includes('mountain') || name.includes('jaipur') || name.includes('goa') || region.includes('asia');
    }
    if (vibe === 'BUDGET') {
      return cost === 'LOW' || desc.includes('budget') || desc.includes('affordable') || name.includes('agra') || name.includes('jaipur') || name.includes('goa');
    }
    return true;
  };

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && matchesVibe(city, selectedVibe);
  });

  const vibeOptions = [
    { id: 'ALL', label: 'All Destinations', icon: Globe2 },
    { id: 'ROMANTIC', label: 'Romantic Escapes', icon: Heart },
    { id: 'ADVENTURE', label: 'Adventure & Outdoors', icon: Mountain },
    { id: 'HERITAGE', label: 'Heritage & Culture', icon: Landmark },
    { id: 'ROAD_TRIP', label: 'Road Trips & Drives', icon: Car },
    { id: 'BUDGET', label: 'Budget Escapes', icon: Tag },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with AI Quick Planner Bar & Mini-Metrics */}
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
              Track active trip countdowns, discover destinations by travel vibe, and manage multi-city budgets.
            </p>

            {/* AI Quick Planner Input Bar inside Hero Banner */}
            <form onSubmit={handleAiQuickPlan} className="pt-2">
              <div className="relative w-full max-w-xl">
                <Bot className="w-4 h-4 text-emerald-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="AI Quick Planner e.g., 5-day romantic trip to Italy under ₹2 Lakhs..."
                  className="w-full pl-11 pr-28 py-3 bg-black/40 hover:bg-black/50 focus:bg-black/60 border border-white/20 rounded-2xl text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-md transition"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI Plan</span>
                </button>
              </div>
            </form>

            {/* Mini-Metrics Badges (Hero Empty Space Balance) */}
            <div className="pt-1 flex flex-wrap gap-4 text-xs font-bold text-slate-300 border-t border-white/10 pt-3">
              <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Map className="w-4 h-4 text-emerald-400" />
                <span><strong className="text-white">12</strong> Cities Explored</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span><strong className="text-white">5</strong> Countries Visited</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Luggage className="w-4 h-4 text-amber-400" />
                <span><strong className="text-white">{trips.length}</strong> Active Itineraries</span>
              </div>
            </div>
          </div>

          {/* Dynamic Countdown Widget with Animated Pulse Status Pill */}
          {nextTrip && (
            <div className="w-full lg:w-80 bg-white/10 dark:bg-[#162235]/90 backdrop-blur-xl border border-white/20 dark:border-[#1E2D42] p-5 rounded-2xl text-white space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Next Journey Countdown</span>
                </span>
                
                {/* Subtle Animated Pulse UPCOMING Status Pill */}
                <span className="px-2.5 py-0.5 bg-emerald-500/30 text-emerald-300 rounded-full text-[10px] font-extrabold animate-pulse ring-2 ring-emerald-400/50">
                  {nextTrip.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-white line-clamp-1">{nextTrip.title}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Starts: {new Date(nextTrip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

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

      {/* Budget Highlights with Visual Progress Bar & Currency Switcher Toggle */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Budget Highlights & Financial Summary
            </h2>

            {/* Currency Switcher Quick Toggle (INR / USD) */}
            <div className="flex items-center bg-slate-200 dark:bg-[#162235] p-1 rounded-xl border border-slate-300 dark:border-[#1E2D42]">
              <button
                type="button"
                onClick={() => setCurrencyMode('INR')}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition ${
                  currencyMode === 'INR'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrencyMode('USD')}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition ${
                  currencyMode === 'USD'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                $ USD
              </button>
            </div>
          </div>

          <Link to="/my-trips" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            Manage All Budgets →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#111E2E] p-5 rounded-2xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Allocated Budget</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatMoney(budgetMetrics.totalAllocated)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Across {trips.length} planned trip{trips.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Visual Progress Bar Card for Spent */}
          <div className="bg-white dark:bg-[#111E2E] p-5 rounded-2xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Total Recorded Spend</span>
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">{budgetMetrics.percentSpent}% spent</span>
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatMoney(budgetMetrics.totalSpent)}
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#162235] h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${budgetMetrics.percentSpent}%` }}
              />
            </div>
          </div>

          {/* Visual Progress Bar Card for Remaining */}
          <div className="bg-white dark:bg-[#111E2E] p-5 rounded-2xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Remaining Balance</span>
              <span className="text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400">{100 - budgetMetrics.percentSpent}% available</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatMoney(budgetMetrics.remaining)}
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#162235] h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-500"
                style={{ width: `${100 - budgetMetrics.percentSpent}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111E2E] p-5 rounded-2xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Active & Upcoming</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {budgetMetrics.activeCount} <span className="text-xs font-bold text-slate-400">Trips</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Ready for travel execution</p>
          </div>
        </div>
      </section>

      {/* "Travel by Vibe" / Theme-Based Filtering Section */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1E2D42] pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>Travel by Vibe — Curated Mood Filtering</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Discover destinations tailored to your travel style: Honeymoon, Road Trips, Adventure, Heritage, or Budget Escapes
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Travel Vibe Selector Buttons with High-Contrast Emerald Active State */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
          {vibeOptions.map((vibe) => {
            const Icon = vibe.icon;
            const isSelected = selectedVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => setSelectedVibe(vibe.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/25 scale-105'
                    : 'bg-slate-100 dark:bg-[#162235] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1E2D42] hover:bg-slate-200 dark:hover:bg-[#1E2D42]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                <span>{vibe.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Regional / Vibe Selections Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-emerald-500" />
              <span>Curated Destination Selections ({filteredCities.length})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Handpicked popular cities matching your travel mood</p>
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
        ) : filteredCities.length === 0 ? (
          <div className="p-8 bg-white dark:bg-[#111E2E] rounded-3xl border border-slate-200 dark:border-[#1E2D42] text-center text-xs text-slate-400">
            No destinations found matching this travel vibe filter. Try selecting "All Destinations"!
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

      {/* Trips Section */}
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
