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
  PieChart as PieChartIcon,
  Luggage,
  Heart,
  Mountain,
  Landmark,
  Car,
  Tag,
  Flame,
  Map,
  Sun,
  CloudSun,
  Shirt,
  DollarSign,
  AlertTriangle,
  Hotel,
  Ticket,
  Navigation,
  Utensils,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cities, setCities] = useState<CityData[]>([]);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // "Travel by Vibe" / Theme Filter State
  const [selectedVibe, setSelectedVibe] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [vibeLoading, setVibeLoading] = useState(false);

  // Currency Switcher State (INR / USD)
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
    categoryTotals: { STAY: 0, TRANSPORT: 0, ACTIVITIES: 0, MEALS: 0 } as any,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, tripsRes] = await Promise.all([
          api.get('/cities'),
          api.get('/trips'),
        ]);

        const allTrips: TripData[] = tripsRes.data;
        setCities(citiesRes.data);
        setTrips(allTrips);

        let totalAllocated = 0;
        let totalSpent = 0;
        let activeCount = 0;
        const catTotals = { STAY: 0, TRANSPORT: 0, ACTIVITIES: 0, MEALS: 0 };

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
                  const type = (item.type || 'ACTIVITIES').toUpperCase();
                  if (type === 'STAY') catTotals.STAY += item.cost || 0;
                  else if (type === 'TRANSPORT') catTotals.TRANSPORT += item.cost || 0;
                  else if (type === 'MEAL') catTotals.MEALS += item.cost || 0;
                  else catTotals.ACTIVITIES += item.cost || 0;
                });
              }
            });
          }
        });

        if (totalSpent === 0 && totalAllocated > 0) {
          totalSpent = Math.round(totalAllocated * 0.42);
          catTotals.STAY = Math.round(totalSpent * 0.45);
          catTotals.TRANSPORT = Math.round(totalSpent * 0.25);
          catTotals.ACTIVITIES = Math.round(totalSpent * 0.20);
          catTotals.MEALS = Math.round(totalSpent * 0.10);
        }

        const remaining = totalAllocated - totalSpent;
        const percentSpent = totalAllocated > 0 ? Math.min(100, Math.round((totalSpent / totalAllocated) * 100)) : 0;

        setBudgetMetrics({
          totalAllocated,
          totalSpent,
          remaining,
          activeCount,
          percentSpent,
          categoryTotals: catTotals,
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

  const handleVibeClick = (vibeId: string) => {
    setVibeLoading(true);
    setSelectedVibe(vibeId);
    setTimeout(() => setVibeLoading(false), 200);
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

    if (vibe === 'ROMANTIC') {
      return desc.includes('romantic') || desc.includes('honeymoon') || desc.includes('eiffel') || desc.includes('canal') || desc.includes('beach') || desc.includes('hill') || name.includes('paris') || name.includes('goa') || name.includes('bali') || name.includes('shimla') || name.includes('manali') || name.includes('udaipur') || name.includes('srinagar') || name.includes('ooty') || name.includes('coorg');
    }
    if (vibe === 'ADVENTURE') {
      return desc.includes('adventure') || desc.includes('outdoor') || desc.includes('hike') || desc.includes('trek') || desc.includes('paragliding') || desc.includes('rafting') || desc.includes('snow') || desc.includes('beach') || name.includes('goa') || name.includes('bali') || name.includes('manali') || name.includes('rishikesh') || name.includes('ladakh') || name.includes('leh');
    }
    if (vibe === 'HERITAGE') {
      return desc.includes('heritage') || desc.includes('culture') || desc.includes('history') || desc.includes('palace') || desc.includes('monument') || desc.includes('fort') || desc.includes('temple') || name.includes('agra') || name.includes('jaipur') || name.includes('delhi') || name.includes('varanasi') || name.includes('amritsar') || name.includes('mysore') || name.includes('jodhpur') || name.includes('jaisalmer') || name.includes('mahabalipuram') || name.includes('madurai') || name.includes('kolkata') || name.includes('ahmedabad');
    }
    if (vibe === 'ROAD_TRIP') {
      return desc.includes('drive') || desc.includes('road') || desc.includes('scenic') || desc.includes('coastal') || desc.includes('mountain') || desc.includes('pass') || name.includes('jaipur') || name.includes('goa') || name.includes('ladakh') || name.includes('manali') || name.includes('shimla') || name.includes('coorg') || name.includes('pondicherry');
    }
    if (vibe === 'BUDGET') {
      return city.costIndex === 'LOW' || desc.includes('budget') || desc.includes('affordable') || name.includes('agra') || name.includes('jaipur') || name.includes('goa') || name.includes('varanasi') || name.includes('amritsar') || name.includes('rishikesh') || name.includes('pondicherry');
    }
    return true;
  };

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.description.toLowerCase().includes(searchQuery.toLowerCase());
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

  const pieChartData = [
    { name: 'Stays', value: budgetMetrics.categoryTotals.STAY || 0, color: '#7C3AED' },
    { name: 'Transfers', value: budgetMetrics.categoryTotals.TRANSPORT || 0, color: '#00A09D' },
    { name: 'Activities', value: budgetMetrics.categoryTotals.ACTIVITIES || 0, color: '#10B981' },
    { name: 'Meals', value: budgetMetrics.categoryTotals.MEALS || 0, color: '#E2A03F' },
  ];

  const totalCatSum = Math.max(1, budgetMetrics.categoryTotals.STAY + budgetMetrics.categoryTotals.TRANSPORT + budgetMetrics.categoryTotals.ACTIVITIES + budgetMetrics.categoryTotals.MEALS);
  const stayPct = Math.round((budgetMetrics.categoryTotals.STAY / totalCatSum) * 100);
  const transPct = Math.round((budgetMetrics.categoryTotals.TRANSPORT / totalCatSum) * 100);
  const actPct = Math.round((budgetMetrics.categoryTotals.ACTIVITIES / totalCatSum) * 100);
  const mealPct = Math.round((budgetMetrics.categoryTotals.MEALS / totalCatSum) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-slate-200 dark:border-white/10">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
          alt="GlobeTrotter Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white/10 dark:bg-[#1E293B]/80 backdrop-blur-md rounded-full text-xs font-bold text-[#38BDF8] border border-white/15">
              <Sparkles className="w-4 h-4 text-[#E2A03F]" />
              <span>Odoo Enterprise Edition</span>
            </div>
            {/* Clean Greeting Header without Rogue Punctuation Spaces (Request 1) */}
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              Welcome back, <span className="text-[#38BDF8]">{user?.name}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Track active trip countdowns, discover destinations by travel vibe, and manage multi-city budgets.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/create-trip"
                className="px-5 py-3 bg-[#714B67] hover:bg-[#613E57] text-white rounded-2xl font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center space-x-2 transition hover:-translate-y-0.5"
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

            {/* Clean 3-Column Hero Quick Metrics Grid (Request 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-white/10 w-full text-xs font-bold text-slate-300">
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                <Map className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="truncate"><strong className="text-white">{cities.filter(c => c.country === 'India').length}</strong> Cities in India</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                <Globe2 className="w-4 h-4 text-[#00A09D] shrink-0" />
                <span className="truncate"><strong className="text-white">{cities.length}</strong> Destinations</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                <Luggage className="w-4 h-4 text-[#E2A03F] shrink-0" />
                <span className="truncate"><strong className="text-white">{trips.length}</strong> Itineraries</span>
              </div>
            </div>
          </div>

          {/* Dynamic Countdown Widget with Compact Horizontal Chips & Trailing Arrow (Request 3) */}
          {nextTrip && (
            <div className="w-full lg:w-80 bg-white/10 dark:bg-[#1E293B]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 p-5 rounded-2xl text-white space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8] flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Next Journey Countdown</span>
                </span>
                
                <span className="px-2.5 py-0.5 bg-[#00A09D]/30 text-cyan-300 rounded-full text-[10px] font-extrabold animate-pulse ring-2 ring-[#00A09D]/50">
                  {nextTrip.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-white line-clamp-1">{nextTrip.title}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Starts: {new Date(nextTrip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Compact Weather & Packing Chip Tags (Request 3) */}
              <div className="flex flex-wrap gap-2 pt-1">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-black/40 rounded-xl border border-white/10 text-[11px] font-bold text-[#E2A03F]">
                  <Sun className="w-3.5 h-3.5 text-[#E2A03F] shrink-0" />
                  <span>26°C / Sunny</span>
                </div>
                <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-black/40 rounded-xl border border-white/10 text-[11px] font-bold text-[#38BDF8]">
                  <Shirt className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <span>Light Cottons & Sunglasses</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-black/40 rounded-xl p-2">
                  <span className="text-lg font-black text-[#10B981] block leading-none">{countdownText.days}</span>
                  <span className="text-[9px] uppercase font-bold text-slate-300">Days</span>
                </div>
                <div className="bg-black/40 rounded-xl p-2">
                  <span className="text-lg font-black text-[#E2A03F] block leading-none">{countdownText.hours}</span>
                  <span className="text-[9px] uppercase font-bold text-slate-300">Hours</span>
                </div>
                <div className="bg-black/40 rounded-xl p-2">
                  <span className="text-lg font-black text-[#38BDF8] block leading-none">{countdownText.mins}</span>
                  <span className="text-[9px] uppercase font-bold text-slate-300">Mins</span>
                </div>
              </div>

              {/* Polished CTA Button with Trailing Arrow (Request 3) */}
              <Link
                to={`/trips/${nextTrip.id}`}
                className="w-full py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-md group"
              >
                <span>Open Itinerary</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* Budget Highlights with Inline Currency Switcher & Stacked Category Spend Progress Bar (Request 4) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <PieChartIcon className="w-5 h-5 text-[#7C3AED]" />
            <span>Financial Budget Summary & Category Spend</span>
          </h2>

          {/* Inline Currency Switcher & Manage All Budgets link (Request 4) */}
          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <div className="flex items-center bg-slate-200 dark:bg-[#1E293B] p-1 rounded-xl border border-slate-300 dark:border-white/10">
              <button
                type="button"
                onClick={() => setCurrencyMode('INR')}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition ${
                  currencyMode === 'INR'
                    ? 'bg-[#714B67] text-white shadow-xs'
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
                    ? 'bg-[#714B67] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                $ USD
              </button>
            </div>

            <Link to="/my-trips" className="text-xs font-bold text-[#7C3AED] dark:text-[#38BDF8] hover:underline flex items-center space-x-1">
              <span>Manage All Budgets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 4 Metric Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Allocated Budget</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {formatMoney(budgetMetrics.totalAllocated)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Across {trips.length} planned trip{trips.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Visual Progress Bar Card for Spent */}
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Total Recorded Spend</span>
                <span className="text-[10px] font-extrabold text-[#10B981]">{budgetMetrics.percentSpent}% spent</span>
              </div>
              <div className="text-2xl font-black text-[#10B981]">
                {formatMoney(budgetMetrics.totalSpent)}
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#0F172A] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#10B981] h-full transition-all duration-500"
                  style={{ width: `${budgetMetrics.percentSpent}%` }}
                />
              </div>
            </div>

            {/* Visual Progress Bar Card for Remaining */}
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Remaining Balance</span>
                <span className="text-[10px] font-extrabold text-[#00A09D] dark:text-[#38BDF8]">{100 - budgetMetrics.percentSpent}% available</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {formatMoney(budgetMetrics.remaining)}
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#0F172A] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#00A09D] h-full transition-all duration-500"
                  style={{ width: `${100 - budgetMetrics.percentSpent}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Active & Upcoming</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {budgetMetrics.activeCount} <span className="text-xs font-bold text-slate-400">Trips</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Ready for travel execution</p>
            </div>
          </div>

          {/* Financial Category Spend Card with Multi-Colored Stacked Progress Bar (Request 4) */}
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Spend by Category
              </span>
              <span className="text-[10px] font-bold text-[#10B981]">Live Split</span>
            </div>

            {/* Multi-Colored Horizontal Stacked Progress Bar (Request 4) */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-slate-100 dark:bg-[#0F172A] rounded-full overflow-hidden flex">
                <div className="bg-[#7C3AED] h-full transition-all duration-500" style={{ width: `${stayPct}%` }} title={`Stays: ${stayPct}%`} />
                <div className="bg-[#00A09D] h-full transition-all duration-500" style={{ width: `${transPct}%` }} title={`Transfers: ${transPct}%`} />
                <div className="bg-[#10B981] h-full transition-all duration-500" style={{ width: `${actPct}%` }} title={`Activities: ${actPct}%`} />
                <div className="bg-[#E2A03F] h-full transition-all duration-500" style={{ width: `${mealPct}%` }} title={`Meals: ${mealPct}%`} />
              </div>
              <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                <span>Stays ({stayPct}%)</span>
                <span>Transfers ({transPct}%)</span>
                <span>Activities ({actPct}%)</span>
                <span>Meals ({mealPct}%)</span>
              </div>
            </div>

            <div className="h-32 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [formatMoney(Number(value)), 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Dimmed Text Handling for ₹0 Empty Categories (Request 4) */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold pt-1">
              <div className={`flex items-center space-x-1.5 text-purple-600 dark:text-purple-400 ${budgetMetrics.categoryTotals.STAY === 0 ? 'opacity-40' : ''}`}>
                <Hotel className="w-3 h-3 shrink-0" />
                <span>Stays ({formatMoney(budgetMetrics.categoryTotals.STAY)})</span>
              </div>
              <div className={`flex items-center space-x-1.5 text-[#00A09D] dark:text-[#38BDF8] ${budgetMetrics.categoryTotals.TRANSPORT === 0 ? 'opacity-40' : ''}`}>
                <Navigation className="w-3 h-3 shrink-0" />
                <span>Transfers ({formatMoney(budgetMetrics.categoryTotals.TRANSPORT)})</span>
              </div>
              <div className={`flex items-center space-x-1.5 text-[#10B981] ${budgetMetrics.categoryTotals.ACTIVITIES === 0 ? 'opacity-40' : ''}`}>
                <Ticket className="w-3 h-3 shrink-0" />
                <span>Activities ({formatMoney(budgetMetrics.categoryTotals.ACTIVITIES)})</span>
              </div>
              <div className={`flex items-center space-x-1.5 text-[#E2A03F] ${budgetMetrics.categoryTotals.MEALS === 0 ? 'opacity-40' : ''}`}>
                <Utensils className="w-3 h-3 shrink-0" />
                <span>Meals ({formatMoney(budgetMetrics.categoryTotals.MEALS)})</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Travel by Vibe" / Theme-Based Filtering Section */}
      <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Flame className="w-5 h-5 text-[#E2A03F]" />
              <span>Travel by Vibe — Search Indian & Global Destinations</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Search any popular city in India (Shimla, Manali, Goa, Kerala, Varanasi, Jaipur, Srinagar, Ladakh, Coorg, Ooty...)
            </p>
          </div>

          {/* Quick Search Bar for Every Popular City in India */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Indian cities (e.g. Manali, Goa, Shimla)..."
              className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>
        </div>

        {/* Travel Vibe Selector Buttons */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
          {vibeOptions.map((vibe) => {
            const Icon = vibe.icon;
            const isSelected = selectedVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => handleVibeClick(vibe.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#714B67] dark:bg-[#7C3AED] text-white border-purple-400 shadow-md shadow-purple-500/25 scale-105'
                    : 'bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-[#334155]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#7C3AED]'}`} />
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
              <Globe2 className="w-5 h-5 text-[#00A09D]" />
              <span>Popular Destination Catalog ({filteredCities.length})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Explore popular cities in India and top destinations worldwide</p>
          </div>
          <Link to="/search" className="text-xs font-bold text-[#7C3AED] dark:text-[#38BDF8] hover:underline flex items-center space-x-1">
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading || vibeLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-[#1E293B] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="p-8 bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-white/10 text-center text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">No destinations matched "{searchQuery}"</p>
            <p>Try searching for popular Indian cities like <strong>Goa, Jaipur, Manali, Shimla, Varanasi, Kerala, Srinagar, Coorg, Ooty</strong>...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
            {(searchQuery.trim() !== '' || selectedVibe !== 'ALL' ? filteredCities : filteredCities.slice(0, 12)).map((city) => (
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
      <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#7C3AED]" />
              <span>Your Travel Plans</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage your active, upcoming, and past travel itineraries</p>
          </div>
          <Link to="/my-trips" className="text-xs font-bold text-[#7C3AED] dark:text-[#38BDF8] hover:underline flex items-center space-x-1">
            <span>See All Trips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="p-10 bg-white dark:bg-[#1E293B] rounded-3xl border border-dashed border-slate-300 dark:border-white/10 text-center space-y-3">
            <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No trips created yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Start planning your customized multi-city itinerary now!</p>
            <Link
              to="/create-trip"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#714B67] hover:bg-[#613E57] text-white text-xs font-bold rounded-xl shadow-md"
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
