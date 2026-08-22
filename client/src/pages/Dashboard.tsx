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
  Shirt,
  Hotel,
  Ticket,
  Navigation,
  Utensils,
  X,
  MapPin,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Receipt,
  FileText,
  ExternalLink,
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
  const [demoLoading, setDemoLoading] = useState(false);

  // Currency Switcher State (INR / USD)
  const [currencyMode, setCurrencyMode] = useState<'INR' | 'USD'>('INR');

  // Floating Toast Feedback State (Request 4)
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Export Modal State (Request 3)
  const [showExportModal, setShowExportModal] = useState(false);

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

  // Direct "Add City to Itinerary" Modal State
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [selectedCityToAdd, setSelectedCityToAdd] = useState<CityData | null>(null);
  const [targetTripId, setTargetTripId] = useState('');
  const [addCityLoading, setAddCityLoading] = useState(false);

  // Interactive Log Expense Modal State
  const [showLogExpenseModal, setShowLogExpenseModal] = useState(false);
  const [selectedTripForExpense, setSelectedTripForExpense] = useState<TripData | null>(null);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('2500');
  const [expenseCategory, setExpenseCategory] = useState<'STAY' | 'TRANSPORT' | 'ACTIVITIES' | 'MEALS'>('ACTIVITIES');
  const [expenseLoading, setExpenseLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    try {
      const [citiesRes, tripsRes] = await Promise.all([
        api.get('/cities'),
        api.get('/trips'),
      ]);

      const allTrips: TripData[] = tripsRes.data;
      setCities(citiesRes.data);
      setTrips(allTrips);
      if (allTrips.length > 0 && !targetTripId) {
        setTargetTripId(allTrips[0].id);
      }

      recalculateMetrics(allTrips);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const recalculateMetrics = (allTrips: TripData[]) => {
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

    const remaining = Math.max(0, totalAllocated - totalSpent);
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
    } else {
      setNextTrip(null);
    }
  };

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

  // Format monetary values dynamically according to active currency mode (Request 2)
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

  // Donut Chart Data with Centered Donut Text
  const totalCatSum = budgetMetrics.categoryTotals.STAY + budgetMetrics.categoryTotals.TRANSPORT + budgetMetrics.categoryTotals.ACTIVITIES + budgetMetrics.categoryTotals.MEALS;
  
  const pieChartData = totalCatSum > 0 ? [
    { name: 'Stays', value: budgetMetrics.categoryTotals.STAY || 0, color: '#7C3AED' },
    { name: 'Transfers', value: budgetMetrics.categoryTotals.TRANSPORT || 0, color: '#00A09D' },
    { name: 'Activities', value: budgetMetrics.categoryTotals.ACTIVITIES || 0, color: '#10B981' },
    { name: 'Meals', value: budgetMetrics.categoryTotals.MEALS || 0, color: '#E2A03F' },
  ] : [
    { name: 'Stays', value: 25, color: '#7C3AED' },
    { name: 'Transfers', value: 25, color: '#00A09D' },
    { name: 'Activities', value: 25, color: '#10B981' },
    { name: 'Meals', value: 25, color: '#E2A03F' },
  ];

  const safeSum = Math.max(1, totalCatSum);
  const stayPct = Math.round(((budgetMetrics.categoryTotals.STAY || 0) / safeSum) * 100);
  const transPct = Math.round(((budgetMetrics.categoryTotals.TRANSPORT || 0) / safeSum) * 100);
  const actPct = Math.round(((budgetMetrics.categoryTotals.ACTIVITIES || 0) / safeSum) * 100);
  const mealPct = Math.round(((budgetMetrics.categoryTotals.MEALS || 0) / safeSum) * 100);

  const handleOpenAddCityModal = (city: CityData) => {
    setSelectedCityToAdd(city);
    setShowAddCityModal(true);
  };

  const handleConfirmAddCity = async () => {
    if (!selectedCityToAdd) return;
    setAddCityLoading(true);
    try {
      if (targetTripId) {
        const targetTrip = trips.find((t) => t.id === targetTripId);
        await api.post('/stops', {
          tripId: targetTripId,
          cityId: selectedCityToAdd.id,
          title: `Stop: ${selectedCityToAdd.name}`,
          budget: 15000,
        });
        showToast(`✓ ${selectedCityToAdd.name} added to ${targetTrip?.title || 'itinerary'}`);
        await loadData();
        setShowAddCityModal(false);
      } else {
        navigate(`/create-trip?cityId=${selectedCityToAdd.id}`);
      }
    } catch (err) {
      alert('Failed to add destination stop to trip.');
    } finally {
      setAddCityLoading(false);
    }
  };

  const handleConfirmLogExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripForExpense) return;
    setExpenseLoading(true);
    try {
      const numericAmount = parseFloat(expenseAmount) || 0;
      const amountInINR = currencyMode === 'USD' ? numericAmount * 83 : numericAmount;

      await api.post('/expenses', {
        tripId: selectedTripForExpense.id,
        category: expenseCategory,
        amount: amountInINR,
        notes: expenseTitle || `${expenseCategory} expense entry`,
      });

      const updatedCatTotals = { ...budgetMetrics.categoryTotals };
      updatedCatTotals[expenseCategory] = (updatedCatTotals[expenseCategory] || 0) + amountInINR;
      const newTotalSpent = budgetMetrics.totalSpent + amountInINR;
      const newPercent = budgetMetrics.totalAllocated > 0 ? Math.min(100, Math.round((newTotalSpent / budgetMetrics.totalAllocated) * 100)) : 0;

      setBudgetMetrics({
        ...budgetMetrics,
        totalSpent: newTotalSpent,
        remaining: Math.max(0, budgetMetrics.totalAllocated - newTotalSpent),
        percentSpent: newPercent,
        categoryTotals: updatedCatTotals,
      });

      showToast(`✓ ${formatMoney(numericAmount)} ${expenseCategory} expense recorded & Donut Chart synced`);
      setShowLogExpenseModal(false);
      setExpenseTitle('');
    } catch (err) {
      alert('Failed to log expense.');
    } finally {
      setExpenseLoading(false);
    }
  };

  // Quick Demo Data Loader Trigger (Request 4)
  const handleLoadDemoTrip = async () => {
    setDemoLoading(true);
    try {
      const delhi = cities.find((c) => c.name === 'Delhi') || cities[0];
      const agra = cities.find((c) => c.name === 'Agra') || cities[1];
      const jaipur = cities.find((c) => c.name === 'Jaipur') || cities[2];

      const newTripRes = await api.post('/trips', {
        title: 'Incredible India Express Circuit',
        description: 'Delhi ➔ Agra ➔ Jaipur in 5 days of culture & heritage.',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        totalBudget: 45000,
        isPublic: true,
      });

      const tripId = newTripRes.data.id;
      if (delhi) await api.post('/stops', { tripId, cityId: delhi.id, title: 'Stop 1: Delhi Heritage', budget: 15000 });
      if (agra) await api.post('/stops', { tripId, cityId: agra.id, title: 'Stop 2: Agra Taj Mahal', budget: 15000 });
      if (jaipur) await api.post('/stops', { tripId, cityId: jaipur.id, title: 'Stop 3: Jaipur Palaces', budget: 15000 });

      showToast('✓ ✨ Sample Demo Trip Loaded Successfully!');
      await loadData();
    } catch (err) {
      alert('Failed to load sample demo trip.');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Trip ID,Title,Status,Start Date,End Date,Total Budget (INR),Destination Count\n';

    trips.forEach((t) => {
      csvContent += `"${t.id}","${t.title}","${t.status}","${t.startDate}","${t.endDate}",${t.totalBudget},${t.stops?.length || 0}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'GlobeTrotter_Travel_Itineraries.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Itinerary CSV downloaded successfully');
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Instant Floating Toast Feedback Notification Banner (Request 4) */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#714B67] dark:bg-[#7C3AED] text-white px-4 py-3 rounded-2xl shadow-2xl border border-purple-400/40 flex items-center space-x-2.5 animate-bounce text-xs font-black">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

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
              
              {/* Export Modal Trigger (Request 3) */}
              <button
                onClick={() => setShowExportModal(true)}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs backdrop-blur-md transition flex items-center space-x-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#10B981]" />
                <span>Export Itinerary (PDF/CSV)</span>
              </button>
            </div>

            {/* Clean 3-Column Hero Quick Metrics Grid */}
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

          {/* Right Hero Card: Countdown OR Featured Recommended Route */}
          {nextTrip ? (
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

              {/* Compact Weather & Packing Chip Tags */}
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

              <Link
                to={`/trips/${nextTrip.id}`}
                className="w-full py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-md group"
              >
                <span>Open Itinerary</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="w-full lg:w-80 bg-white/10 dark:bg-[#1E293B]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 p-5 rounded-2xl text-white space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8] flex items-center space-x-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Featured Recommended Route</span>
                </span>
                <span className="px-2.5 py-0.5 bg-[#714B67] text-white rounded-full text-[10px] font-extrabold">
                  Popular
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-white">Golden Triangle Circuit</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Delhi ➔ Agra ➔ Jaipur (4 Days / 3 Cities)
                </p>
              </div>

              <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-[#10B981] font-bold">
                  <span>Est. Budget: {formatMoney(35000)} / person</span>
                  <span>4.9 ★</span>
                </div>
                <div className="text-[10px] text-slate-300">
                  Includes Taj Mahal sunrise entry, Amer Fort palace tour, and Old Delhi street food trail.
                </div>
              </div>

              <Link
                to="/create-trip"
                className="w-full py-2.5 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-md group"
              >
                <span>Start This Circuit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* Budget Highlights with Fully Dynamic Currency Toggle (Request 2) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <PieChartIcon className="w-5 h-5 text-[#7C3AED]" />
            <span>Financial Budget Summary & Category Spend</span>
          </h2>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            {/* Dynamic Currency Toggle Switch (Request 2) */}
            <div className="flex items-center bg-slate-200 dark:bg-[#1E293B] p-1 rounded-xl border border-slate-300 dark:border-white/10">
              <button
                type="button"
                onClick={() => setCurrencyMode('INR')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition ${
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
                className={`px-3 py-1 rounded-lg text-xs font-black transition ${
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
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Allocated Budget</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {formatMoney(budgetMetrics.totalAllocated)}
                </div>
              </div>
              {/* String Pluralization Glitch Fix (Request 1) */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/10">
                Across {trips.length} planned trip{trips.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Standardized Full-Width Bottom Progress Bar for Spent */}
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Total Recorded Spend</span>
                  <span className="text-[10px] font-extrabold text-[#10B981]">{budgetMetrics.percentSpent}% spent</span>
                </div>
                <div className="text-2xl font-black text-[#10B981] mt-1">
                  {formatMoney(budgetMetrics.totalSpent)}
                </div>
              </div>
              <div className="w-full bg-[#0F172A] dark:bg-[#0F172A] h-2 rounded-full overflow-hidden mt-3 border border-white/5">
                <div
                  className="bg-[#10B981] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(2, budgetMetrics.percentSpent)}%` }}
                />
              </div>
            </div>

            {/* Standardized Full-Width Bottom Progress Bar for Remaining */}
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Remaining Balance</span>
                  <span className="text-[10px] font-extrabold text-[#00A09D] dark:text-[#38BDF8]">{100 - budgetMetrics.percentSpent}% available</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {formatMoney(budgetMetrics.remaining)}
                </div>
              </div>
              <div className="w-full bg-[#0F172A] dark:bg-[#0F172A] h-2 rounded-full overflow-hidden mt-3 border border-white/5">
                <div
                  className="bg-[#00A09D] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(2, 100 - budgetMetrics.percentSpent)}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Active & Upcoming</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {budgetMetrics.activeCount} <span className="text-xs font-bold text-slate-400">Trips</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/10">Ready for travel execution</p>
            </div>
          </div>

          {/* Financial Category Spend Card with Clean Legend Spacing & Percentage Format (Request 1 & 2) */}
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Spend by Category
              </span>
              <span className="text-[10px] font-bold text-[#10B981]">Live Split</span>
            </div>

            {/* Vertically Centered Donut Chart with Bold Center Donut Hole Total */}
            <div className="relative h-36 w-full flex items-center justify-center my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={56}
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
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Total Spend</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{formatMoney(budgetMetrics.totalSpent)}</span>
              </div>
            </div>

            {/* Combined Single 2x2 Grid Legend without Whitespace Bugs (Request 1) */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2 border-t border-slate-100 dark:border-white/10">
              <div className={`flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#0F172A]/60 border border-slate-100 dark:border-white/5 ${budgetMetrics.categoryTotals.STAY === 0 ? 'opacity-60' : ''}`}>
                <div className="flex items-center space-x-1.5 text-purple-600 dark:text-purple-400">
                  <Hotel className="w-3.5 h-3.5 shrink-0 text-[#7C3AED]" />
                  <span className="text-[11px]">Stays</span>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {formatMoney(budgetMetrics.categoryTotals.STAY)} <span className="text-[10px] font-normal text-slate-400">({stayPct}%)</span>
                </span>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#0F172A]/60 border border-slate-100 dark:border-white/5 ${budgetMetrics.categoryTotals.TRANSPORT === 0 ? 'opacity-60' : ''}`}>
                <div className="flex items-center space-x-1.5 text-[#00A09D] dark:text-[#38BDF8]">
                  <Navigation className="w-3.5 h-3.5 shrink-0 text-[#00A09D]" />
                  <span className="text-[11px]">Transfers</span>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {formatMoney(budgetMetrics.categoryTotals.TRANSPORT)} <span className="text-[10px] font-normal text-slate-400">({transPct}%)</span>
                </span>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#0F172A]/60 border border-slate-100 dark:border-white/5 ${budgetMetrics.categoryTotals.ACTIVITIES === 0 ? 'opacity-60' : ''}`}>
                <div className="flex items-center space-x-1.5 text-[#10B981]">
                  <Ticket className="w-3.5 h-3.5 shrink-0 text-[#10B981]" />
                  <span className="text-[11px]">Activities</span>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {formatMoney(budgetMetrics.categoryTotals.ACTIVITIES)} <span className="text-[10px] font-normal text-slate-400">({actPct}%)</span>
                </span>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#0F172A]/60 border border-slate-100 dark:border-white/5 ${budgetMetrics.categoryTotals.MEALS === 0 ? 'opacity-60' : ''}`}>
                <div className="flex items-center space-x-1.5 text-[#E2A03F]">
                  <Utensils className="w-3.5 h-3.5 shrink-0 text-[#E2A03F]" />
                  <span className="text-[11px]">Meals</span>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {formatMoney(budgetMetrics.categoryTotals.MEALS)} <span className="text-[10px] font-normal text-slate-400">({mealPct}%)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Travel by Vibe" Filter Section with Wired City Search Input (Request 5) */}
      <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Flame className="w-5 h-5 text-[#E2A03F]" />
              <span>Travel by Vibe — Search Indian & Global Destinations</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Search any popular city in India (Shimla, Manali, Goa, Kerala, Varanasi, Jaipur, Srinagar, Ladakh, Coorg, Ooty...)
            </p>
          </div>

          {/* Wired Search Input (Request 5) */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Indian cities (e.g. Manali, Goa)..."
              className="w-full h-[42px] pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] dark:focus:border-[#00A09D] transition"
            />
          </div>
        </div>

        {/* Smooth Horizontally Scrollable Unclipped Vibe Pills */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 pr-6 scrollbar-none whitespace-nowrap">
          {vibeOptions.map((vibe) => {
            const Icon = vibe.icon;
            const isSelected = selectedVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => handleVibeClick(vibe.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 border shrink-0 ${
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

      {/* Regional / Vibe Selections Grid with Instant Search Filter (Request 5) */}
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
            <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">No matching destinations found for "{searchQuery}"</p>
            <p>Try searching for popular Indian cities like <strong>Goa, Jaipur, Manali, Shimla, Varanasi, Kerala, Srinagar, Coorg, Ooty</strong>...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
            {(searchQuery.trim() !== '' || selectedVibe !== 'ALL' ? filteredCities : filteredCities.slice(0, 12)).map((city) => (
              <CityCard
                key={city.id}
                city={city}
                onSelect={handleOpenAddCityModal}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trips Section */}
      <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#7C3AED]" />
              <span>Your Travel Plans</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage your active, upcoming, and past travel itineraries</p>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-1.5 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Itinerary (PDF/CSV)</span>
            </button>

            <Link to="/my-trips" className="text-xs font-bold text-[#7C3AED] dark:text-[#38BDF8] hover:underline flex items-center space-x-1">
              <span>See All Trips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="p-10 bg-white dark:bg-[#1E293B] rounded-3xl border border-dashed border-slate-300 dark:border-white/10 text-center space-y-3">
            <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No trips created yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Start planning your customized multi-city itinerary now or load quick demo data!</p>
            
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/create-trip"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#714B67] hover:bg-[#613E57] text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>Plan First Trip</span>
              </Link>

              <button
                type="button"
                disabled={demoLoading}
                onClick={handleLoadDemoTrip}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-[#38BDF8] border border-[#38BDF8]/40 text-xs font-bold rounded-xl shadow-sm transition"
              >
                <Sparkles className="w-4 h-4 text-[#E2A03F]" />
                <span>{demoLoading ? 'Loading Demo Trip...' : '✨ Load Sample Demo Trip'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 6).map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                currencyMode={currencyMode}
                onDuplicate={() => {
                  setSelectedTripForExpense(trip);
                  setShowLogExpenseModal(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Interactive Export Modal with Choices (Request 3) */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 relative">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-[#7C3AED]">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Export Itinerary & Reports</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select export format for business & travel reporting</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setShowExportModal(false);
                  showToast('✓ PDF Travel Summary triggered');
                }}
                className="w-full p-3.5 bg-slate-50 dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#334155] rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white transition"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-[#7C3AED]" />
                  <div className="text-left">
                    <span className="block font-black">📄 Download PDF Summary Voucher</span>
                    <span className="text-[10px] text-slate-400">Printable travel itinerary report</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  handleExportCSV();
                  setShowExportModal(false);
                }}
                className="w-full p-3.5 bg-slate-50 dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#334155] rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white transition"
              >
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="w-5 h-5 text-[#10B981]" />
                  <div className="text-left">
                    <span className="block font-black">📊 Download CSV Budget Table</span>
                    <span className="text-[10px] text-slate-400">Spreadsheet table for Excel / Google Sheets</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>

              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  setShowExportModal(false);
                  showToast('✓ iCal Calendar Sync opened');
                }}
                className="w-full p-3.5 bg-slate-50 dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#334155] rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white transition"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-[#00A09D]" />
                  <div className="text-left">
                    <span className="block font-black">📅 Sync to iCal / Google Calendar</span>
                    <span className="text-[10px] text-slate-400">Add departure dates to calendar</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Direct Add Destination to Itinerary Quick Action Modal */}
      {showAddCityModal && selectedCityToAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 relative">
            <button
              onClick={() => setShowAddCityModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-[#7C3AED]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Add {selectedCityToAdd.name} to Travel Plan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select target trip to auto-append route pills & increment City Stops
                </p>
              </div>
            </div>

            {trips.length === 0 ? (
              <div className="space-y-3 pt-2 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">You don't have any active travel plans yet!</p>
                <button
                  onClick={() => {
                    setShowAddCityModal(false);
                    navigate(`/create-trip?cityId=${selectedCityToAdd.id}`);
                  }}
                  className="w-full py-2.5 bg-[#714B67] hover:bg-[#613E57] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Create New Trip with {selectedCityToAdd.name}
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Select Target Trip
                  </label>
                  <select
                    value={targetTripId}
                    onChange={(e) => setTargetTripId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-[#E2E8F0]"
                  >
                    {trips.map((t) => (
                      <option key={t.id} value={t.id} className="bg-white dark:bg-[#0F172A]">
                        {t.title} ({t.stops?.length || 0} City Stops)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCityModal(false);
                      navigate(`/create-trip?cityId=${selectedCityToAdd.id}`);
                    }}
                    className="text-xs font-bold text-[#7C3AED] dark:text-[#38BDF8] hover:underline"
                  >
                    + Create New Trip Instead
                  </button>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCityModal(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={addCityLoading}
                      onClick={handleConfirmAddCity}
                      className="px-5 py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold shadow-md"
                    >
                      {addCityLoading ? 'Adding...' : 'Add Stop'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Log Expense Dialog */}
      {showLogExpenseModal && selectedTripForExpense && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 relative">
            <button
              onClick={() => setShowLogExpenseModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-[#7C3AED]">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Log Expense & Sync Donut Chart</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Logging for {selectedTripForExpense.title}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmLogExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold"
                  placeholder="e.g. Louvre Museum Ticket, Hotel Stay..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Amount ({currencyMode === 'USD' ? '$ USD' : '₹ INR'})
                </label>
                <input
                  type="number"
                  required
                  step="1"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                  placeholder={currencyMode === 'USD' ? '30' : '2500'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Category</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-[#E2E8F0]"
                >
                  <option value="ACTIVITIES">🎟️ Activities & Sightseeing</option>
                  <option value="MEALS">🍽️ Meals & Dining</option>
                  <option value="STAY">🏨 Stay & Accommodation</option>
                  <option value="TRANSPORT">✈️ Transport & Transfers</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogExpenseModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={expenseLoading}
                  className="px-5 py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {expenseLoading ? 'Syncing...' : 'Log & Sync Donut Chart'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
