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
  Clock,
  Tag,
  Flame,
  Heart,
  Mountain,
  Landmark,
  Car,
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'CITIES' | 'ACTIVITIES'>('CITIES');
  const [cities, setCities] = useState<CityData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
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

  const [attachLoading, setAttachLoading] = useState(false);
  const [attachSuccess, setAttachSuccess] = useState('');

  useEffect(() => {
    fetchCatalog();
    fetchUserTrips();
  }, []);

  const fetchCatalog = async () => {
    try {
      const [citiesRes, actRes] = await Promise.all([
        api.get('/cities'),
        api.get('/activities'),
      ]);
      setCities(citiesRes.data);
      setActivities(actRes.data);
    } catch (err) {
      console.error('Error loading search catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTrips = async () => {
    try {
      const res = await api.get('/trips');
      setUserTrips(res.data);
      if (res.data.length > 0) {
        setTargetTripId(res.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching user trips:', err);
    }
  };

  useEffect(() => {
    if (!targetTripId) return;
    const fetchSingleTrip = async () => {
      try {
        const res = await api.get(`/trips/${targetTripId}`);
        setSelectedTripDetails(res.data);
        if (res.data.stops && res.data.stops.length > 0) {
          setTargetStopId(res.data.stops[0].id);
        } else {
          setTargetStopId('');
        }
      } catch (err) {
        console.error('Failed to fetch trip details for modal:', err);
      }
    };
    fetchSingleTrip();
  }, [targetTripId]);

  const handleOpenAddModal = (type: 'CITY' | 'ACTIVITY', data: CityData | ActivityData) => {
    setSelectedItemToAdd({ type, data });
    setAttachSuccess('');
    setShowAddToTripModal(true);
  };

  const handleConfirmAttach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTripId || !selectedItemToAdd) return;

    setAttachLoading(true);
    setAttachSuccess('');

    try {
      if (selectedItemToAdd.type === 'CITY') {
        const city = selectedItemToAdd.data as CityData;
        await api.post(`/trips/${targetTripId}/stops`, {
          cityId: city.id,
          title: `Stop: ${city.name}`,
          budget: city.costIndex === 'HIGH' ? '60000' : '30000',
        });
        setAttachSuccess(`"${city.name}" successfully added to your trip!`);
      } else {
        const act = selectedItemToAdd.data as ActivityData;
        if (!targetStopId) {
          alert('Please create a city stop inside your trip first or select a valid stop.');
          setAttachLoading(false);
          return;
        }
        await api.post(`/trips/stops/${targetStopId}/items`, {
          title: act.title,
          activityId: act.id,
          cost: act.estimatedCost.toString(),
          type: 'ACTIVITY',
          timeSlot: `${act.durationHours} hrs duration`,
        });
        setAttachSuccess(`Activity "${act.title}" attached to itinerary!`);
      }

      setTimeout(() => {
        setShowAddToTripModal(false);
        setAttachSuccess('');
      }, 1500);
    } catch (err) {
      alert('Failed to attach item to trip.');
    } finally {
      setAttachLoading(false);
    }
  };

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

  const filteredCities = cities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCost = selectedCost === 'ALL' || c.costIndex === selectedCost;
    return matchesSearch && matchesVibe(c, selectedVibe) && matchesCost;
  });

  const filteredActivities = activities.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <Compass className="w-8 h-8 text-emerald-500" />
            <span>Discovery & Catalog Search</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Screen 8: Discover destinations by Travel Vibe (Honeymoon, Adventure, Heritage, Road Trips) or search activities
          </p>
        </div>

        {/* Tab Toggles */}
        <div className="flex bg-slate-100 dark:bg-[#162235] p-1.5 rounded-2xl border border-slate-200 dark:border-[#1E2D42]">
          <button
            onClick={() => setActiveTab('CITIES')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CITIES'
                ? 'bg-white dark:bg-[#111E2E] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-[#1E2D42]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>Explore Cities ({cities.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ACTIVITIES')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ACTIVITIES'
                ? 'bg-white dark:bg-[#111E2E] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-[#1E2D42]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4 text-emerald-500" />
            <span>Explore Activities ({activities.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar with Travel Vibe */}
      <div className="bg-white dark:bg-[#111E2E] p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'CITIES'
                  ? 'Search by city name, country, or region (e.g. Paris, Agra, Jaipur, Japan)...'
                  : 'Search activities by title or category (e.g. Taj Mahal, Paragliding, Louvre)...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {activeTab === 'CITIES' ? (
              <select
                value={selectedVibe}
                onChange={(e) => setSelectedVibe(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="ALL">Vibe: All Travel Moods</option>
                <option value="ROMANTIC">Romantic & Honeymoon</option>
                <option value="ADVENTURE">Adventure & Outdoors</option>
                <option value="HERITAGE">Heritage & Culture</option>
                <option value="ROAD_TRIP">Road Trips & Drives</option>
                <option value="BUDGET">Budget Escapes</option>
              </select>
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="ALL">Category: All</option>
                <option value="Sightseeing">Sightseeing</option>
                <option value="Culture">Culture</option>
                <option value="Food">Food</option>
                <option value="Adventure">Adventure</option>
              </select>
            )}

            <select
              value={selectedCost}
              onChange={(e) => setSelectedCost(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="ALL">Filter: Any Cost</option>
              <option value="LOW">₹ Low Cost</option>
              <option value="MEDIUM">₹₹ Moderate</option>
              <option value="HIGH">₹₹₹ Luxury</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips & Reset */}
        {(selectedVibe !== 'ALL' || selectedCost !== 'ALL' || selectedCategory !== 'ALL' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5 text-xs font-bold">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-extrabold uppercase">Active Filters:</span>
            {searchQuery && (
              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                <span>Query: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 hover:text-rose-500" /></button>
              </span>
            )}
            {selectedVibe !== 'ALL' && (
              <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-lg border border-purple-200 dark:border-purple-800 flex items-center space-x-1">
                <span>Vibe: {selectedVibe}</span>
                <button onClick={() => setSelectedVibe('ALL')}><X className="w-3 h-3 hover:text-rose-500" /></button>
              </span>
            )}
            {selectedCost !== 'ALL' && (
              <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center space-x-1">
                <span>Cost: {selectedCost}</span>
                <button onClick={() => setSelectedCost('ALL')}><X className="w-3 h-3 hover:text-rose-500" /></button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedVibe('ALL');
                setSelectedCost('ALL');
                setSelectedCategory('ALL');
              }}
              className="text-[11px] font-black text-rose-600 dark:text-rose-400 hover:underline ml-auto"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Catalog Results Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          {activeTab === 'CITIES' ? 'City Catalog' : 'Activity Experiences'} ({activeTab === 'CITIES' ? filteredCities.length : filteredActivities.length})
        </h2>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-semibold">Loading search catalog...</div>
        ) : activeTab === 'CITIES' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <div key={city.id} className="relative group">
                <CityCard city={city} />
                <button
                  onClick={() => handleOpenAddModal('CITY', city)}
                  className="absolute bottom-3.5 right-3.5 z-10 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add to Trip</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                onAdd={(selectedActivity) => handleOpenAddModal('ACTIVITY', selectedActivity)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Direct Add to Trip Modal */}
      {showAddToTripModal && selectedItemToAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111E2E] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E2D42] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2D42] pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                <span>Add Item Directly to Itinerary</span>
              </h3>
              <button
                onClick={() => setShowAddToTripModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {attachSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{attachSuccess}</span>
              </div>
            )}

            <div className="p-4 bg-slate-50 dark:bg-[#162235] rounded-2xl border border-slate-200 dark:border-[#1E2D42] space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">
                Selected Item
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {(selectedItemToAdd.data as any).title || (selectedItemToAdd.data as any).name}
              </h4>
            </div>

            <form onSubmit={handleConfirmAttach} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Select Target Trip *
                </label>
                <select
                  value={targetTripId}
                  onChange={(e) => setTargetTripId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  {userTrips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({new Date(t.startDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              {selectedItemToAdd.type === 'ACTIVITY' && selectedTripDetails?.stops?.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Select Target City Stop *
                  </label>
                  <select
                    value={targetStopId}
                    onChange={(e) => setTargetStopId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {selectedTripDetails.stops.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.city ? s.city.name : 'Destination Stop'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddToTripModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#162235] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={attachLoading}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {attachLoading ? 'Attaching...' : 'Attach to Itinerary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
