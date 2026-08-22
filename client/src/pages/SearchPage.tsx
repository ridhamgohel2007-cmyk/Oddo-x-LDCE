import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { CityCard, CityData } from '../components/CityCard';
import { ActivityCard, ActivityData } from '../components/ActivityCard';
import { TripData } from '../components/TripCard';
import { Search, Compass, Plus, MapPin, Ticket, CheckCircle2, X } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'CITIES' | 'ACTIVITIES'>('CITIES');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCost, setSelectedCost] = useState('ALL');

  const [cities, setCities] = useState<CityData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [userTrips, setUserTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  // Add to Trip Modal State
  const [showAddToTripModal, setShowAddToTripModal] = useState(false);
  const [selectedItemToAdd, setSelectedItemToAdd] = useState<{
    type: 'CITY' | 'ACTIVITY';
    data: CityData | ActivityData;
  } | null>(null);

  const [targetTripId, setTargetTripId] = useState('');
  const [targetStopId, setTargetStopId] = useState('');
  const [selectedTripDetails, setSelectedTripDetails] = useState<any>(null);
  const [attachLoading, setAttachLoading] = useState(false);
  const [attachSuccess, setAttachSuccess] = useState('');

  useEffect(() => {
    fetchData();
    fetchUserTrips();
  }, [activeTab, selectedRegion, selectedCategory, selectedCost]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'CITIES') {
        const res = await api.get('/cities');
        setCities(res.data);
      } else {
        const res = await api.get('/activities');
        setActivities(res.data);
      }
    } catch (err) {
      console.error('Error fetching search data:', err);
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

  // Fetch stops when user selects a trip in modal
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
          budget: city.costIndex === 'HIGH' ? '1200' : '600',
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
          cost: act.estimatedCost,
          timeSlot: `${act.durationHours} hrs`,
          type: 'ACTIVITY',
        });
        setAttachSuccess(`"${act.title}" successfully attached to itinerary!`);
      }

      setTimeout(() => {
        setShowAddToTripModal(false);
      }, 1500);
    } catch (err) {
      alert('Failed to attach item to trip.');
    } finally {
      setAttachLoading(false);
    }
  };

  const filteredCities = cities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'ALL' || c.region === selectedRegion;
    const matchesCost = selectedCost === 'ALL' || c.costIndex === selectedCost;
    return matchesSearch && matchesRegion && matchesCost;
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
            Screen 8: Dedicated tabbed search for cities (country, cost index, popularity) vs. activities (duration, category)
          </p>
        </div>

        {/* Tab Toggles (Explore Cities vs Explore Activities) */}
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

      {/* Filter Controls Bar */}
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
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="ALL">Group by: All Regions</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="North America">North America</option>
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
              <option value="ALL">Filter: Any Cost Index</option>
              <option value="LOW">$ Low Cost</option>
              <option value="MEDIUM">$$ Moderate</option>
              <option value="HIGH">$$$ Luxury</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Results Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          {activeTab === 'CITIES' ? 'City Catalog' : 'Activity Experiences'} ({activeTab === 'CITIES' ? filteredCities.length : filteredActivities.length})
        </h2>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-semibold">Searching catalog...</div>
        ) : activeTab === 'CITIES' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <CityCard
                key={city.id}
                city={city}
                onSelect={(c) => handleOpenAddModal('CITY', c)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {filteredActivities.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                onAdd={(a) => handleOpenAddModal('ACTIVITY', a)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Immediate "+ Add to Trip" Modal Trigger (PS Requirement) */}
      {showAddToTripModal && selectedItemToAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111E2E] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E2D42] space-y-4 relative">
            <button
              onClick={() => setShowAddToTripModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              <span>Attach {selectedItemToAdd.type === 'CITY' ? 'City' : 'Activity'} to Itinerary</span>
            </h3>

            {/* Thumbnail Preview */}
            <div className="p-3 bg-slate-50 dark:bg-[#162235] rounded-2xl border border-slate-200 dark:border-[#1E2D42] flex items-center space-x-3">
              <img
                src={selectedItemToAdd.data.imageUrl}
                alt={selectedItemToAdd.type === 'CITY' ? (selectedItemToAdd.data as CityData).name : (selectedItemToAdd.data as ActivityData).title}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {selectedItemToAdd.type === 'CITY'
                    ? (selectedItemToAdd.data as CityData).name
                    : (selectedItemToAdd.data as ActivityData).title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedItemToAdd.type === 'CITY'
                    ? `${(selectedItemToAdd.data as CityData).country} • ${(selectedItemToAdd.data as CityData).region}`
                    : `${(selectedItemToAdd.data as ActivityData).category} • $${(selectedItemToAdd.data as ActivityData).estimatedCost}`}
                </p>
              </div>
            </div>

            {attachSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{attachSuccess}</span>
              </div>
            )}

            <form onSubmit={handleConfirmAttach} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Select Target Trip *
                </label>
                {userTrips.length === 0 ? (
                  <p className="text-xs text-rose-500 font-semibold">No active trips found. Please create a trip first.</p>
                ) : (
                  <select
                    value={targetTripId}
                    onChange={(e) => setTargetTripId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {userTrips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.status})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedItemToAdd.type === 'ACTIVITY' && selectedTripDetails?.stops && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Select City Destination Stop *
                  </label>
                  {selectedTripDetails.stops.length === 0 ? (
                    <p className="text-xs text-amber-500 font-semibold">This trip has no city stops yet. Adding this will create a stop.</p>
                  ) : (
                    <select
                      value={targetStopId}
                      onChange={(e) => setTargetStopId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    >
                      {selectedTripDetails.stops.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.city?.name || 'City'})
                        </option>
                      ))}
                    </select>
                  )}
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
                  disabled={attachLoading || userTrips.length === 0}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {attachLoading ? 'Attaching...' : '+ Attach to Itinerary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
