import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { CityData } from '../components/CityCard';
import { ActivityData, ActivityCard } from '../components/ActivityCard';
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  Plus,
  Trash2,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface MultiCityStopInput {
  cityId: string;
  title: string;
  startDate: string;
  endDate: string;
  budget: string;
}

export const CreateTrip: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedCityId = searchParams.get('cityId') || '';

  const navigate = useNavigate();

  // Primary Trip Required Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
  );
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [totalBudget, setTotalBudget] = useState('150000');
  const [isPublic, setIsPublic] = useState(true);

  // Multi-City Stops Builder State
  const [stops, setStops] = useState<MultiCityStopInput[]>([
    {
      cityId: preselectedCityId,
      title: 'Stop 1: Primary Destination',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: '75000',
    },
  ]);

  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get('/cities');
        setCities(res.data);
        if (preselectedCityId && res.data.length > 0) {
          const preCity = res.data.find((c: any) => c.id === preselectedCityId);
          if (preCity) {
            setStops([
              {
                cityId: preselectedCityId,
                title: `Stop 1: ${preCity.name}`,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                budget: '75000',
              },
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load cities:', err);
      }
    };

    fetchCities();
  }, [preselectedCityId]);

  const handleAddStopField = () => {
    const nextStopNum = stops.length + 1;
    setStops([
      ...stops,
      {
        cityId: cities.length > 0 ? cities[Math.min(nextStopNum - 1, cities.length - 1)].id : '',
        title: `Stop ${nextStopNum}: Destination ${nextStopNum}`,
        startDate: endDate,
        endDate: new Date(new Date(endDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget: '50000',
      },
    ]);
  };

  const handleRemoveStopField = (index: number) => {
    if (stops.length <= 1) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleStopChange = (index: number, field: keyof MultiCityStopInput, value: string) => {
    const updated = [...stops];
    updated[index][field] = value;
    setStops(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/trips', {
        title,
        description,
        coverImage,
        startDate,
        endDate,
        totalBudget,
        isPublic,
        stops,
      });

      navigate(`/trips/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Screen 4 Header */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Screen 4: Initiate Multi-City Trip</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Plan a New Multi-City Trip</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Specify trip details and add multiple city stops with arrival/departure dates to build your itinerary
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Trip Metadata */}
        <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-[#1E2D42] pb-3 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>General Trip Overview</span>
          </h2>

          <div className="space-y-4">
            {/* Trip Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Trip Name / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="e.g. Incredible India: Golden Triangle (Delhi, Agra, Jaipur)"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Overall Start Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Overall End Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Estimated Total Budget in INR */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Estimated Total Trip Budget (₹ INR) *
              </label>
              <div className="relative">
                <span className="w-4 h-4 text-slate-400 font-black absolute left-3.5 top-2.5">₹</span>
                <input
                  type="number"
                  required
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="150000"
                />
              </div>
            </div>

            {/* Cover Photo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Cover Photo URL
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {coverImage && (
                <div className="mt-2.5 h-28 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42]">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Trip Description & Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Outline your travel objectives, preferred flight schedules, or sightseeing preferences..."
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
              />
              <label htmlFor="isPublic" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Share publicly in Community Hub so other travelers can view and copy your itinerary
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Multi-City Stops Builder with INR Budget */}
        <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2D42] pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                <span>Multi-City Destination Stops Builder</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add multiple cities with individual arrival and departure dates</p>
            </div>
            <button
              type="button"
              onClick={handleAddStopField}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add City Stop</span>
            </button>
          </div>

          <div className="space-y-4">
            {stops.map((stop, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    City Stop #{idx + 1}
                  </span>
                  {stops.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStopField(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                      title="Remove Stop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                      Stop Title / Section Label
                    </label>
                    <input
                      type="text"
                      required
                      value={stop.title}
                      onChange={(e) => handleStopChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#111E2E] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                      placeholder={`Stop ${idx + 1}: Destination`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                      Select Destination City
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={stop.cityId}
                        onChange={(e) => handleStopChange(idx, 'cityId', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#111E2E] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                      >
                        <option value="">Select City Destination</option>
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}, {c.country} ({c.region})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Arrival Date</label>
                    <input
                      type="date"
                      value={stop.startDate}
                      onChange={(e) => handleStopChange(idx, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#111E2E] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Departure Date</label>
                    <input
                      type="date"
                      value={stop.endDate}
                      onChange={(e) => handleStopChange(idx, 'endDate', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#111E2E] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stop Budget (₹ INR)</label>
                    <input
                      type="number"
                      value={stop.budget}
                      onChange={(e) => handleStopChange(idx, 'budget', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#111E2E] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddStopField}
            className="w-full py-3 bg-slate-50 dark:bg-[#162235] hover:bg-slate-100 border-2 border-dashed border-slate-300 dark:border-[#1E2D42] rounded-2xl text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Another City Destination Stop</span>
          </button>
        </div>

        {/* Submit CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-xl shadow-emerald-500/30 flex items-center space-x-2 transition hover:-translate-y-0.5"
          >
            <span>{loading ? 'Initiating Multi-City Trip...' : 'Create Multi-City Trip & Build Itinerary'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
