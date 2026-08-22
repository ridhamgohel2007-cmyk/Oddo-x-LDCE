import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { CityData } from '../components/CityCard';
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
  ArrowUp,
  ArrowDown,
  PieChart,
  Search,
  Check,
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
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
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

  // Per-stop city search input state for combobox
  const [citySearchQueries, setCitySearchQueries] = useState<Record<number, string>>({});

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

  // Preset Cover Photo Thumbnails Gallery (Request Item 3)
  const coverPresetOptions = [
    { label: 'Taj Mahal', url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Paris Eiffel', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Bali Palms', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Rome Colosseum', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80' },
    { label: 'NYC Skyline', url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Himalayan Pass', url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Dynamic Budget Progress Calculation (Request Item 6)
  const numericTotalBudget = parseFloat(totalBudget) || 1;
  const allocatedBudget = stops.reduce((acc, s) => acc + (parseFloat(s.budget) || 0), 0);
  const allocatedPct = Math.min(100, Math.round((allocatedBudget / numericTotalBudget) * 100));
  const remainingBudget = Math.max(0, numericTotalBudget - allocatedBudget);

  const handleAddStopField = () => {
    const nextStopNum = stops.length + 1;
    setStops([
      ...stops,
      {
        cityId: cities.length > 0 ? cities[Math.min(nextStopNum - 1, cities.length - 1)].id : '',
        title: `Stop ${nextStopNum}: Destination ${nextStopNum}`,
        startDate: endDate > startDate ? startDate : new Date().toISOString().split('T')[0],
        endDate: endDate,
        budget: '50000',
      },
    ]);
  };

  const handleRemoveStopField = (index: number) => {
    if (stops.length <= 1) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  // Reorder Stops Up / Down (Request Item 7)
  const handleMoveStop = (index: number, direction: 'UP' | 'DOWN') => {
    if (direction === 'UP' && index === 0) return;
    if (direction === 'DOWN' && index === stops.length - 1) return;

    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setStops(updated);
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
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      {/* Production Header Banner (Request Item 1 - No dev screen labels) */}
      <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-purple-50 dark:bg-purple-950/60 text-[#7C3AED] dark:text-purple-300 rounded-full text-xs font-extrabold border border-purple-200 dark:border-purple-800">
          <Sparkles className="w-4 h-4 text-[#E2A03F]" />
          <span>Multi-City Itinerary Builder</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Plan a New Multi-City Trip</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Plan your next multi-city journey, select destination stops, set dates, and allocate budgets
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Trip Overview */}
        <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
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
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
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
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  placeholder="150000"
                />
              </div>
            </div>

            {/* Cover Photo Picker with Unsplash Gallery & Live Preview (Request Item 3) */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Cover Photo Image *
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {coverPresetOptions.map((preset, idx) => {
                  const isSelected = coverImage === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all group ${
                        isSelected
                          ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/50 scale-105 shadow-md'
                          : 'border-slate-200 dark:border-white/10 hover:border-slate-400'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/30 flex items-end p-1">
                        <span className="text-[9px] font-extrabold text-white line-clamp-1">{preset.label}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 p-0.5 bg-[#7C3AED] text-white rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="relative pt-1">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  placeholder="Or paste custom Unsplash Image URL..."
                />
              </div>

              {coverImage && (
                <div className="mt-2.5 h-32 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 relative group">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white rounded-lg text-[10px] font-bold">
                    ✓ Cover Photo Preview
                  </div>
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
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="Outline your travel objectives, preferred flight schedules, or sightseeing preferences..."
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-[#7C3AED] rounded focus:ring-[#7C3AED]"
              />
              <label htmlFor="isPublic" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Share publicly in Community Hub so other travelers can view and copy your itinerary
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Budget Tracker Bar (Request Item 6) */}
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-extrabold text-slate-900 dark:text-white gap-1">
            <span className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-[#7C3AED]" />
              <span>Dynamic Stop Budget Allocation Tracker</span>
            </span>
            <span className="text-[#10B981]">
              ₹{allocatedBudget.toLocaleString('en-IN')} / ₹{numericTotalBudget.toLocaleString('en-IN')} Allocated ({100 - allocatedPct}% Remaining)
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-[#0F172A] h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                allocatedPct > 100 ? 'bg-rose-500' : 'bg-[#10B981]'
              }`}
              style={{ width: `${Math.min(100, allocatedPct)}%` }}
            />
          </div>
        </div>

        {/* Section 2: Multi-City Stops Builder with Reordering & Combobox Search */}
        <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-[#7C3AED]" />
                <span>Multi-City Destination Stops Builder</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add multiple cities with constrained arrival and departure dates</p>
            </div>
            <button
              type="button"
              onClick={handleAddStopField}
              className="px-3.5 py-2 bg-[#714B67] hover:bg-[#613E57] dark:bg-[#7C3AED] dark:hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add City Stop</span>
            </button>
          </div>

          <div className="space-y-4">
            {stops.map((stop, idx) => {
              const query = citySearchQueries[idx] || '';
              const filteredCityList = cities.filter(
                (c) =>
                  c.name.toLowerCase().includes(query.toLowerCase()) ||
                  c.country.toLowerCase().includes(query.toLowerCase()) ||
                  c.region.toLowerCase().includes(query.toLowerCase())
              );

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 space-y-4 relative"
                >
                  {/* Card Header with Reordering Up/Down & Removal (Request Item 7) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7C3AED]">
                        City Stop #{idx + 1}
                      </span>
                      
                      {/* Stop Reorder Buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveStop(idx, 'UP')}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30"
                          title="Move Stop Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === stops.length - 1}
                          onClick={() => handleMoveStop(idx, 'DOWN')}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30"
                          title="Move Stop Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

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
                        className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                        placeholder={`Stop ${idx + 1}: Destination`}
                      />
                    </div>

                    {/* Searchable Destination Combobox (Request Item 4) */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                        Searchable City Destination *
                      </label>
                      <div className="space-y-1.5">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                          <input
                            type="text"
                            value={query}
                            onChange={(e) =>
                              setCitySearchQueries({ ...citySearchQueries, [idx]: e.target.value })
                            }
                            placeholder="Type to search cities (e.g. Manali, Paris, Agra)..."
                            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>

                        <select
                          value={stop.cityId}
                          onChange={(e) => handleStopChange(idx, 'cityId', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                        >
                          <option value="">Select Destination ({filteredCityList.length} cities matching)</option>
                          {filteredCityList.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}, {c.country} ({c.region})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Date Range Auto-Constraint (Request Item 5) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Arrival Date</label>
                      <input
                        type="date"
                        min={startDate}
                        max={endDate}
                        value={stop.startDate}
                        onChange={(e) => handleStopChange(idx, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Departure Date</label>
                      <input
                        type="date"
                        min={stop.startDate || startDate}
                        max={endDate}
                        value={stop.endDate}
                        onChange={(e) => handleStopChange(idx, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stop Budget (₹ INR)</label>
                      <input
                        type="number"
                        value={stop.budget}
                        onChange={(e) => handleStopChange(idx, 'budget', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAddStopField}
            className="w-full py-3 bg-slate-50 dark:bg-[#0F172A] hover:bg-slate-100 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl text-xs font-bold text-[#7C3AED] flex items-center justify-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Another City Destination Stop</span>
          </button>
        </div>

        {/* Sticky Bottom Action Footer Bar (Request Item 8) */}
        <div className="sticky bottom-0 z-30 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
            <span className="text-[#7C3AED] font-black">{stops.length} City Stops</span> • ₹{allocatedBudget.toLocaleString('en-IN')} / ₹{numericTotalBudget.toLocaleString('en-IN')} Allocated
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#714B67] hover:bg-[#613E57] dark:bg-[#7C3AED] dark:hover:bg-[#6D28D9] text-white rounded-2xl font-black text-xs shadow-xl shadow-purple-500/30 flex items-center justify-center space-x-2 transition hover:scale-105 shrink-0"
          >
            <span>{loading ? 'Initiating Multi-City Trip...' : 'Create Multi-City Trip & Build Itinerary'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
