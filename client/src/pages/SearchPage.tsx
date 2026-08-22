import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { CityCard, CityData } from '../components/CityCard';
import { ActivityCard, ActivityData } from '../components/ActivityCard';
import { Search, Filter, ArrowUpDown, Compass, Plus, MapPin } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'CITIES' | 'ACTIVITIES'>('CITIES');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCost, setSelectedCost] = useState('ALL');
  const [sortBy, setSortBy] = useState('popularity');

  const [cities, setCities] = useState<CityData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedRegion, selectedCategory, selectedCost, sortBy]);

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
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-3">
            <Compass className="w-8 h-8 text-emerald-600" />
            <span>Explore Destinations & Activities</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Screen 8: Search cities and categorized activities with cost filters</p>
        </div>

        {/* Tab Toggle (Cities vs Activities) */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('CITIES')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'CITIES'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            City Catalog
          </button>
          <button
            onClick={() => setActiveTab('ACTIVITIES')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'ACTIVITIES'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Activity Experiences
          </button>
        </div>
      </div>

      {/* Screen 8 Wireframe Search Bar with Group By, Filter, Sort By */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'CITIES'
                  ? 'Search city name or country (e.g. Paris, Japan)...'
                  : 'Search activities (e.g. Paragliding, Museum, Eiffel Tower)...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {activeTab === 'CITIES' ? (
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
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
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
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
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
            >
              <option value="ALL">Filter: Any Cost</option>
              <option value="LOW">$ Low Cost</option>
              <option value="MEDIUM">$$ Moderate</option>
              <option value="HIGH">$$$ Luxury</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wireframe Screen 8 Results List */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-gray-900">Results ({activeTab === 'CITIES' ? filteredCities.length : filteredActivities.length})</h2>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-semibold">Searching catalog...</div>
        ) : activeTab === 'CITIES' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <CityCard
                key={city.id}
                city={city}
                onSelect={(c) => navigate(`/create-trip?cityId=${c.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {filteredActivities.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                onAdd={(selectedAct) => {
                  alert(`Selected "${selectedAct.title}"! Open any trip itinerary builder to assign it.`);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
