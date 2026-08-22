import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { CityCard, CityData } from '../components/CityCard';
import { ActivityCard, ActivityData } from '../components/ActivityCard';
import {
  Compass,
  Search,
  MapPin,
  Ticket,
  Plus,
  X,
  CheckCircle2,
  Tag,
  Flame,
  Heart,
  Mountain,
  Landmark,
  Car,
  Globe2,
  Filter,
  Globe,
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'CITIES' | 'ACTIVITIES'>('CITIES');
  const [cities, setCities] = useState<CityData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedContinent, setSelectedContinent] = useState('ALL');
  const [selectedVibe, setSelectedVibe] = useState('ALL');
  const [selectedCost, setSelectedCost] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [loading, setLoading] = useState(true);

  // Immediate "+ Add to Trip" Direct Action Modal State
  const [showAddToTripModal, setShowAddToTripModal] = useState(false);
  const [selectedItemToAdd, setSelectedItemToAdd] = useState<{
    type: 'CITY' | 'ACTIVITY';
    data: CityData | ActivityData;
  } | null>(null);

  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [targetTripId, setTargetTripId] = useState('');
  const [selectedTripDetails, setSelectedTripDetails] = useState<any>(null);
  const [targetStopId, setTargetStopId] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccessMsg, setAddSuccessMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, activitiesRes, tripsRes] = await Promise.all([
          api.get('/cities'),
          api.get('/activities'),
          api.get('/trips'),
        ]);
        setCities(citiesRes.data);
        setActivities(activitiesRes.data);
        setUserTrips(tripsRes.data);
        if (tripsRes.data.length > 0) {
          setTargetTripId(tripsRes.data[0].id);
        }
      } catch (err) {
        console.error('Error loading search data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!targetTripId) return;
    const fetchTripDetails = async () => {
      try {
        const res = await api.get(`/trips/${targetTripId}`);
        setSelectedTripDetails(res.data);
        if (res.data.stops && res.data.stops.length > 0) {
          setTargetStopId(res.data.stops[0].id);
        } else {
          setTargetStopId('');
        }
      } catch (err) {
        console.error('Failed to load trip stops', err);
      }
    };
    fetchTripDetails();
  }, [targetTripId]);

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

  // Travel Vibe / Theme Filtering Logic for Cities
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
      city.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCost = selectedCost === 'ALL' || city.costIndex === selectedCost;
    const matchesContinent = selectedContinent === 'ALL' || getCityContinent(city) === selectedContinent;
    return matchesSearch && matchesCost && matchesContinent && matchesVibe(city, selectedVibe);
  });

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || act.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCat;
  });

  const handleOpenAddToTrip = (item: { type: 'CITY' | 'ACTIVITY'; data: CityData | ActivityData }) => {
    setSelectedItemToAdd(item);
    setShowAddToTripModal(true);
    setAddSuccessMsg('');
  };

  const handleConfirmAddToTrip = async () => {
    if (!targetTripId || !selectedItemToAdd) return;
    setAddLoading(true);
    try {
      if (selectedItemToAdd.type === 'CITY') {
        const city = selectedItemToAdd.data as CityData;
        await api.post('/stops', {
          tripId: targetTripId,
          cityId: city.id,
          title: `Stop: ${city.name}`,
          budget: 15000,
        });
        setAddSuccessMsg(`Successfully added ${city.name} to your trip!`);
      } else {
        const act = selectedItemToAdd.data as ActivityData;
        if (!targetStopId) {
          alert('Please select or add a city stop to add this activity to!');
          setAddLoading(false);
          return;
        }
        await api.post('/itinerary-items', {
          stopId: targetStopId,
          activityId: act.id,
          title: act.title,
          cost: act.estimatedCost,
          type: 'ACTIVITY',
        });
        setAddSuccessMsg(`Successfully added ${act.title} to your itinerary stop!`);
      }
      setTimeout(() => {
        setShowAddToTripModal(false);
        setAddSuccessMsg('');
      }, 1500);
    } catch (err) {
      alert('Failed to add item to trip.');
    } finally {
      setAddLoading(false);
    }
  };

  const continentOptions = [
    { id: 'ALL', label: '🌍 All Continents' },
    { id: 'Asia', label: '🇮🇳 Asia & India' },
    { id: 'Europe', label: '🇪🇺 Europe' },
    { id: 'North America', label: '🇺🇸 North America' },
    { id: 'South America', label: '🇧🇷 South America' },
    { id: 'Africa', label: '🌍 Africa' },
    { id: 'Oceania', label: '🇦🇺 Oceania' },
  ];

  const vibeOptions = [
    { id: 'ALL', label: 'All Vibe Filters', icon: Flame },
    { id: 'ROMANTIC', label: 'Romantic Escapes', icon: Heart },
    { id: 'ADVENTURE', label: 'Adventure & Outdoors', icon: Mountain },
    { id: 'HERITAGE', label: 'Heritage & Culture', icon: Landmark },
    { id: 'ROAD_TRIP', label: 'Road Trips & Drives', icon: Car },
    { id: 'BUDGET', label: 'Budget Escapes', icon: Tag },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner featuring Uploaded 3D Compass Emblem */}
      <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg ring-2 ring-[#7C3AED]/40 bg-black shrink-0 hover:scale-105 transition-transform duration-300">
            <img
              src="/globetrotter-compass-emblem.jpg"
              alt="GlobeTrotter 3D Compass Emblem"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
              <span>Discovery & Catalog Search</span>
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Discover 31+ Indian and Global destinations by Continent & Travel Vibe
            </p>
          </div>
        </div>

        {/* Tab Toggles */}
        <div className="flex bg-slate-100 dark:bg-[#0F172A] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('CITIES')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CITIES'
                ? 'bg-[#714B67] dark:bg-[#7C3AED] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#00A09D]" />
            <span>Explore Cities ({cities.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ACTIVITIES')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ACTIVITIES'
                ? 'bg-[#714B67] dark:bg-[#7C3AED] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4 text-[#00A09D]" />
            <span>Explore Activities ({activities.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar with Continent & Travel Vibe Menu */}
      <div className="bg-white dark:bg-[#1E293B] p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'CITIES'
                  ? 'Search by city name, country, or region (e.g. Manali, Goa, Paris)...'
                  : 'Search activities by title or category (e.g. Taj Mahal, Paragliding, Rafting)...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>

          {/* Continent Dropdown Menu Selector */}
          {activeTab === 'CITIES' && (
            <div className="relative w-full sm:w-56 shrink-0">
              <Globe className="w-4 h-4 text-[#00A09D] absolute left-3 top-3.5 pointer-events-none" />
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                className="w-full h-[42px] pl-9 pr-8 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-extrabold text-slate-900 dark:text-[#E2E8F0] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              >
                {continentOptions.map((c) => (
                  <option key={c.id} value={c.id} className="bg-white dark:bg-[#0F172A]">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {activeTab === 'CITIES' ? (
              <select
                value={selectedCost}
                onChange={(e) => setSelectedCost(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-[#E2E8F0] focus:outline-none"
              >
                <option value="ALL" className="bg-white dark:bg-[#0F172A]">All Cost Levels</option>
                <option value="LOW" className="bg-white dark:bg-[#0F172A]">₹ Low Cost</option>
                <option value="MEDIUM" className="bg-white dark:bg-[#0F172A]">₹₹ Moderate</option>
                <option value="HIGH" className="bg-white dark:bg-[#0F172A]">₹₹₹ Luxury</option>
              </select>
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-[#E2E8F0] focus:outline-none"
              >
                <option value="ALL" className="bg-white dark:bg-[#0F172A]">All Categories</option>
                <option value="Sightseeing" className="bg-white dark:bg-[#0F172A]">Sightseeing</option>
                <option value="Culture" className="bg-white dark:bg-[#0F172A]">Culture & Heritage</option>
                <option value="Adventure" className="bg-white dark:bg-[#0F172A]">Adventure & Outdoors</option>
                <option value="Food" className="bg-white dark:bg-[#0F172A]">Food & Dining</option>
                <option value="Relaxation" className="bg-white dark:bg-[#0F172A]">Relaxation & Wellness</option>
              </select>
            )}
          </div>
        </div>

        {/* Travel Vibe & Continent Selector Buttons */}
        {activeTab === 'CITIES' && (
          <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-2">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5 text-[#00A09D]" />
                <span>Continents:</span>
              </span>
              {continentOptions.map((cont) => {
                const isSelected = selectedContinent === cont.id;
                return (
                  <button
                    key={cont.id}
                    type="button"
                    onClick={() => setSelectedContinent(cont.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                      isSelected
                        ? 'bg-[#00A09D] text-white border-cyan-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#334155]'
                    }`}
                  >
                    <span>{cont.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none pt-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-[#E2A03F]" />
                <span>Travel Vibe:</span>
              </span>
              {vibeOptions.map((vibe) => {
                const Icon = vibe.icon;
                const isSelected = selectedVibe === vibe.id;
                return (
                  <button
                    key={vibe.id}
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-[#714B67] dark:bg-[#7C3AED] text-white border-purple-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#334155]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#7C3AED]'}`} />
                    <span>{vibe.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-[#1E293B] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'CITIES' ? (
        filteredCities.length === 0 ? (
          <div className="p-12 bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-white/10 text-center space-y-2">
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No destinations found matching selected continent / filters</h3>
            <p className="text-xs text-slate-400">Try selecting <strong>🌍 All Continents</strong> or <strong>🇮🇳 Asia & India</strong>...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <CityCard
                key={city.id}
                city={city}
                onSelect={() => handleOpenAddToTrip({ type: 'CITY', data: city })}
              />
            ))}
          </div>
        )
      ) : filteredActivities.length === 0 ? (
        <div className="p-12 bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-white/10 text-center space-y-2">
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No activities found matching search query</h3>
          <p className="text-xs text-slate-400">Try searching for Taj Mahal, Rafting, Food Trail, Paragliding...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              onSelect={() => handleOpenAddToTrip({ type: 'ACTIVITY', data: act })}
            />
          ))}
        </div>
      )}

      {/* Add To Trip Direct Modal */}
      {showAddToTripModal && selectedItemToAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 relative">
            <button
              onClick={() => setShowAddToTripModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-[#7C3AED]">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Add {selectedItemToAdd.type === 'CITY' ? 'Destination Stop' : 'Activity'} to Trip
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  Adding "{(selectedItemToAdd.data as any).name || (selectedItemToAdd.data as any).title}"
                </p>
              </div>
            </div>

            {addSuccessMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>{addSuccessMsg}</span>
              </div>
            )}

            {userTrips.length === 0 ? (
              <div className="space-y-3 pt-2 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">You don't have any active trips yet!</p>
                <button
                  onClick={() => {
                    setShowAddToTripModal(false);
                    navigate('/create-trip');
                  }}
                  className="w-full py-2.5 bg-[#714B67] hover:bg-[#613E57] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Create New Trip First
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
                    {userTrips.map((t) => (
                      <option key={t.id} value={t.id} className="bg-white dark:bg-[#0F172A]">
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedItemToAdd.type === 'ACTIVITY' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Select City Stop within Trip
                    </label>
                    {selectedTripDetails?.stops && selectedTripDetails.stops.length > 0 ? (
                      <select
                        value={targetStopId}
                        onChange={(e) => setTargetStopId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-[#E2E8F0]"
                      >
                        {selectedTripDetails.stops.map((s: any) => (
                          <option key={s.id} value={s.id} className="bg-white dark:bg-[#0F172A]">
                            {s.title} ({s.city?.name || 'City Stop'})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-[11px] text-amber-500 font-bold">
                        This trip has no city stops yet! Add the city stop first.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddToTripModal(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={addLoading}
                    onClick={handleConfirmAddToTrip}
                    className="px-5 py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    {addLoading ? 'Adding...' : 'Confirm & Add'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
