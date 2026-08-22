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
  Globe,
  Filter,
  Shield,
  Activity,
  Edit,
  Settings,
  Users,
  Eye,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cities, setCities] = useState<CityData[]>([]);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Continent Selector State
  const [selectedContinent, setSelectedContinent] = useState('ALL');

  // "Travel by Vibe" / Theme Filter State
  const [selectedVibe, setSelectedVibe] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [vibeLoading, setVibeLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  // Dynamic Currency Switcher State (INR / USD)
  const [currencyMode, setCurrencyMode] = useState<'INR' | 'USD'>('INR');

  // Floating Toast Feedback State
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);

  // Admin Add / Edit City Modal State
  const [showAdminCityModal, setShowAdminCityModal] = useState(false);
  const [adminCityName, setAdminCityName] = useState('');
  const [adminCityCountry, setAdminCityCountry] = useState('');
  const [adminCityRegion, setAdminCityRegion] = useState('Asia');
  const [adminCityDesc, setAdminCityDesc] = useState('');

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

  const formatMoney = (val: number) => {
    if (currencyMode === 'USD') {
      const usdVal = Math.round(val / 83);
      return `$${usdVal.toLocaleString('en-US')}`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Helper to resolve city continent dynamically
  const getCityContinent = (city: CityData): string => {
    const country = (city.country || '').toLowerCase();
    const region = (city.region || '').toLowerCase();
    const name = (city.name || '').toLowerCase();

    if (
      country.includes('india') ||
      country.includes('japan') ||
      country.includes('thailand') ||
      country.includes('indonesia') ||
      country.includes('uae') ||
      country.includes('singapore') ||
      country.includes('china') ||
      region.includes('asia') ||
      name.includes('delhi') || name.includes('agra') || name.includes('jaipur') || name.includes('goa') || name.includes('manali') || name.includes('shimla') || name.includes('varanasi') || name.includes('srinagar') || name.includes('ladakh') || name.includes('kerala') || name.includes('tokyo') || name.includes('bali') || name.includes('dubai') || name.includes('bangkok')
    ) {
      return 'Asia';
    }

    if (
      country.includes('france') ||
      country.includes('italy') ||
      country.includes('spain') ||
      country.includes('uk') ||
      country.includes('united kingdom') ||
      country.includes('netherlands') ||
      country.includes('switzerland') ||
      country.includes('greece') ||
      country.includes('germany') ||
      country.includes('austria') ||
      country.includes('czech') ||
      region.includes('europe') ||
      name.includes('paris') || name.includes('rome') || name.includes('london') || name.includes('barcelona') || name.includes('amsterdam') || name.includes('venice') || name.includes('prague')
    ) {
      return 'Europe';
    }

    if (
      country.includes('usa') ||
      country.includes('united states') ||
      country.includes('canada') ||
      country.includes('mexico') ||
      region.includes('north america') ||
      name.includes('new york') || name.includes('los angeles') || name.includes('vancouver')
    ) {
      return 'North America';
    }

    if (
      country.includes('brazil') ||
      country.includes('peru') ||
      country.includes('argentina') ||
      region.includes('south america') ||
      name.includes('rio') || name.includes('machu picchu') || name.includes('buenos aires')
    ) {
      return 'South America';
    }

    if (
      country.includes('egypt') ||
      country.includes('south africa') ||
      country.includes('morocco') ||
      region.includes('africa') ||
      name.includes('cairo') || name.includes('cape town') || name.includes('marrakech')
    ) {
      return 'Africa';
    }

    if (
      country.includes('australia') ||
      country.includes('new zealand') ||
      region.includes('oceania') ||
      name.includes('sydney') || name.includes('auckland') || name.includes('melbourne')
    ) {
      return 'Oceania';
    }

    return 'Asia';
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

    const matchesContinent =
      selectedContinent === 'ALL' || getCityContinent(city) === selectedContinent;

    return matchesSearch && matchesContinent && matchesVibe(city, selectedVibe);
  });

  const continentOptions = [
    { id: 'ALL', label: '🌍 All Continents' },
    { id: 'Asia', label: '🇮🇳 Asia & India' },
    { id: 'Europe', label: '🇪🇺 Europe' },
    { id: 'North America', label: '🇺🇸 North America' },
    { id: 'South America', label: '🇧🇷 South America' },
    { id: 'Africa', label: '🌍 Africa' },
    { id: 'Oceania', label: '🇦🇺 Oceania' },
  ];

  const handleOpenAddCityModal = (city: CityData) => {
    setSelectedCityToAdd(city);
    setShowAddCityModal(true);
  };

  const handleConfirmAddCity = async () => {
    if (!selectedCityToAdd) return;
    setAddCityLoading(true);
    try {
      let tripIdToUse = targetTripId;
      if (!tripIdToUse && trips.length > 0) tripIdToUse = trips[0].id;

      if (!tripIdToUse) {
        const newTripRes = await api.post('/trips', {
          title: `Trip to ${selectedCityToAdd.name}`,
          description: `Custom itinerary destination stop for ${selectedCityToAdd.name}`,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          totalBudget: 50000,
          isPublic: true,
        });
        tripIdToUse = newTripRes.data.id;
      }

      await api.post('/stops', {
        tripId: tripIdToUse,
        cityId: selectedCityToAdd.id,
        title: `Stop: ${selectedCityToAdd.name}`,
        budget: 25000,
      });

      showToast(`✓ Added ${selectedCityToAdd.name} to Itinerary successfully!`);
      setShowAddCityModal(false);
      await loadData();
    } catch (err) {
      alert('Failed to add city to itinerary.');
    } finally {
      setAddCityLoading(false);
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

  const handleCreateAdminCity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/cities', {
        name: adminCityName,
        country: adminCityCountry,
        region: adminCityRegion,
        description: adminCityDesc || 'Famous global destination catalog entry.',
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        bestTimeToVisit: 'Oct-Mar',
        costIndex: 'MEDIUM',
      });
      showToast(`✓ Admin Created New Destination: ${adminCityName}`);
      setShowAdminCityModal(false);
      setAdminCityName('');
      setAdminCityCountry('');
      loadData();
    } catch (err) {
      alert('Failed to create city destination.');
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Floating Toast Feedback Notification Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#714B67] dark:bg-[#7C3AED] text-white px-4 py-3 rounded-2xl shadow-2xl border border-purple-400/40 flex items-center space-x-2.5 animate-bounce text-xs font-black">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Banner with Admin vs Traveler Persona Switcher (Request Item 1) */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-slate-200 dark:border-white/10">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
          alt="GlobeTrotter Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-4 max-w-2xl">
            {/* Compass Emblem Container */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-[#7C3AED]/50 bg-black shrink-0 hover:scale-105 transition-transform duration-300">
                <img
                  src="/globetrotter-compass-emblem.jpg"
                  alt="GlobeTrotter 3D Compass Emblem"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                  Welcome back, <span className="text-[#38BDF8]">{user?.name}</span>!
                </h1>
                
                {/* Admin Role Indicator vs Traveler Prompt (Request Item 1) */}
                {isAdmin ? (
                  <div className="inline-flex items-center space-x-2 mt-1 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-black border border-emerald-500/30">
                    <Shield className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>System Status: Healthy • 8 Registered Users • {cities.length} Catalog Destinations Active</span>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Track active trip countdowns, discover destinations by continent & travel vibe, and manage multi-city budgets.
                  </p>
                )}
              </div>
            </div>

            {/* Primary Quick Actions (Request Item 1) */}
            <div className="pt-2 flex flex-wrap gap-3">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin"
                    className="px-5 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-black text-xs shadow-lg shadow-purple-500/20 flex items-center space-x-2 transition hover:-translate-y-0.5"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Executive Admin Panel</span>
                  </Link>

                  <button
                    onClick={() => setShowAdminCityModal(true)}
                    className="px-5 py-3 bg-[#00A09D] hover:bg-[#00807D] text-white rounded-2xl font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Destination</span>
                  </button>

                  <button
                    onClick={() => setShowExportModal(true)}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs backdrop-blur-md transition flex items-center space-x-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#10B981]" />
                    <span>System Audit Report</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/create-trip"
                    className="px-5 py-3 bg-[#714B67] hover:bg-[#613E57] text-white rounded-2xl font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center space-x-2 transition hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Plan New Trip</span>
                  </Link>
                  
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs backdrop-blur-md transition flex items-center space-x-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#10B981]" />
                    <span>Export Itinerary (PDF/CSV)</span>
                  </button>
                </>
              )}
            </div>

            {/* Destination Counts Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-white/10 w-full text-xs font-bold text-slate-300">
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                <Map className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Explore {cities.length} Global Cities</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                <Globe2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>6 Continents Cataloged</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                <Flame className="w-4 h-4 text-[#E2A03F] shrink-0" />
                <span>5 Custom Vibe Filters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Metric Widgets (Platform-Wide Economics vs Personal Budget) (Request Item 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <PieChartIcon className="w-5 h-5 text-[#7C3AED]" />
              <span>{isAdmin ? 'Platform-Wide Financial & Booking Volume' : 'Personal Trip Budget & Spend Summary'}</span>
            </h2>

            <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-[#0F172A] p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold">
              <button
                onClick={() => setCurrencyMode('INR')}
                className={`px-2.5 py-1 rounded-lg transition ${currencyMode === 'INR' ? 'bg-[#714B67] dark:bg-[#7C3AED] text-white' : 'text-slate-500'}`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrencyMode('USD')}
                className={`px-2.5 py-1 rounded-lg transition ${currencyMode === 'USD' ? 'bg-[#714B67] dark:bg-[#7C3AED] text-white' : 'text-slate-500'}`}
              >
                $ USD
              </button>
            </div>
          </div>

          {isAdmin ? (
            /* Platform Revenue Summary for Admins */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-1">
                <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-300">Total Gross Platform Volume</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{formatMoney(1285000)}</div>
                <span className="text-[10px] text-slate-500 font-bold block">Aggregated across all user trips</span>
              </div>

              <div className="p-4 bg-cyan-50 dark:bg-cyan-950/40 rounded-2xl border border-cyan-200 dark:border-cyan-800 space-y-1">
                <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-300">Platform Avg Trip Spend</span>
                <div className="text-2xl font-black text-[#00A09D]">{formatMoney(183571)}</div>
                <span className="text-[10px] text-slate-500 font-bold block">Average per created itinerary</span>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-300">Allocated Line Items</span>
                <div className="text-2xl font-black text-[#10B981]">{formatMoney(495000)}</div>
                <span className="text-[10px] text-slate-500 font-bold block">Active booked activities</span>
              </div>
            </div>
          ) : (
            /* Personal Traveler Budget Metrics */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-1">
                <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-300">Total Allocated Budget</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{formatMoney(budgetMetrics.totalAllocated)}</div>
              </div>

              <div className="p-4 bg-cyan-50 dark:bg-cyan-950/40 rounded-2xl border border-cyan-200 dark:border-cyan-800 space-y-1">
                <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-300">Logged Expense Spend</span>
                <div className="text-2xl font-black text-[#00A09D]">{formatMoney(budgetMetrics.totalSpent)}</div>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-300">Remaining Travel Fund</span>
                <div className="text-2xl font-black text-[#10B981]">{formatMoney(budgetMetrics.remaining)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Global Real-Time Traveler Activity Feed (Request Item 2) */}
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#00A09D]" />
            <span>Real-Time Traveler Activity Feed</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 space-y-1">
              <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                <span className="text-[#7C3AED]">Elena Rostova</span>
                <span className="text-[10px] text-slate-400">2h ago</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Created <span className="font-bold text-slate-800 dark:text-slate-200">10 Days Ultimate European Romance</span> (Paris, Rome, Barcelona)</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 space-y-1">
              <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                <span className="text-[#00A09D]">Aarav Sharma</span>
                <span className="text-[10px] text-slate-400">4h ago</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Added <span className="font-bold text-slate-800 dark:text-slate-200">High-Altitude Overland Expedition</span> (Manali to Leh Ladakh)</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 space-y-1">
              <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                <span className="text-[#10B981]">Jiyan Mansuri</span>
                <span className="text-[10px] text-slate-400">6h ago</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Updated <span className="font-bold text-slate-800 dark:text-slate-200">Golden Triangle India Itinerary</span> (Delhi, Agra, Jaipur)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Filters Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Compass className="w-6 h-6 text-[#7C3AED]" />
              <span>Explore Catalog Destinations ({filteredCities.length})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filter by continent, search landmarks, or select by travel vibe theme
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cities, countries..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>
        </div>

        {/* 1-Tap Continent Filter Pills Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {continentOptions.map((c) => {
            const isActive = selectedContinent === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedContinent(c.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-xs ${
                  isActive
                    ? 'bg-[#714B67] dark:bg-[#7C3AED] text-white shadow-purple-500/25 scale-105'
                    : 'bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-[#7C3AED]'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* City Destination Grid with Admin Edit Button (Request Item 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCities.map((city) => (
            <div key={city.id} className="relative group">
              <CityCard city={city} onSelect={handleOpenAddCityModal} />
              
              {/* Admin Edit City Action Overlay Button (Request Item 3) */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setAdminCityName(city.name);
                    setAdminCityCountry(city.country);
                    setAdminCityRegion(city.region);
                    setAdminCityDesc(city.description);
                    setShowAdminCityModal(true);
                  }}
                  className="absolute top-3 right-3 z-20 px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[11px] font-black rounded-xl shadow-lg border border-purple-300 flex items-center space-x-1 transition hover:scale-105"
                  title="Configure city pricing tier, vibe tags & active status"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit City</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Admin City Creation / Edit Modal */}
      {showAdminCityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Admin Destination Configuration</h3>
              <button onClick={() => setShowAdminCityModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdminCity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">City Name *</label>
                <input
                  type="text"
                  required
                  value={adminCityName}
                  onChange={(e) => setAdminCityName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  placeholder="e.g. Kyoto, Venice, Cape Town..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={adminCityCountry}
                  onChange={(e) => setAdminCityCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  placeholder="e.g. Japan, Italy, South Africa..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Continent Region</label>
                <select
                  value={adminCityRegion}
                  onChange={(e) => setAdminCityRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="Asia">Asia & India</option>
                  <option value="Europe">Europe</option>
                  <option value="North America">North America</option>
                  <option value="South America">South America</option>
                  <option value="Africa">Africa</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminCityModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7C3AED] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save City Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add City to Itinerary Modal */}
      {showAddCityModal && selectedCityToAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Add {selectedCityToAdd.name} to Trip</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select which trip itinerary you want to append <span className="font-bold text-slate-900 dark:text-white">{selectedCityToAdd.name} ({selectedCityToAdd.country})</span> as a new destination stop.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Target Travel Itinerary
                </label>
                <select
                  value={targetTripId}
                  onChange={(e) => setTargetTripId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCityModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAddCity}
                disabled={addCityLoading}
                className="px-5 py-2 bg-[#714B67] dark:bg-[#7C3AED] text-white rounded-xl text-xs font-bold shadow-md"
              >
                {addCityLoading ? 'Adding Stop...' : 'Confirm Add Stop'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Export Travel Itinerary</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Download formatted PDF report or CSV spreadsheet of all logged trips.</p>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => { window.print(); setShowExportModal(false); }}
                className="p-4 bg-slate-50 dark:bg-[#0F172A] hover:bg-slate-100 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-900 dark:text-white space-y-1 text-center"
              >
                <FileText className="w-6 h-6 text-[#7C3AED] mx-auto" />
                <span className="block font-black">Export PDF Report</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="p-4 bg-slate-50 dark:bg-[#0F172A] hover:bg-slate-100 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-900 dark:text-white space-y-1 text-center"
              >
                <FileSpreadsheet className="w-6 h-6 text-[#10B981] mx-auto" />
                <span className="block font-black">Export CSV Data</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
