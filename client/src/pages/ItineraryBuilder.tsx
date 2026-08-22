import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Share2,
  ArrowDown,
  Clock,
  CheckCircle,
  Tag,
  Layers,
  ArrowUp,
  Car,
  Hotel,
  Ticket,
  Utensils,
  ListFilter,
  CalendarDays,
  PieChart,
  Printer,
} from 'lucide-react';

export const ItineraryBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [trip, setTrip] = useState<any>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // View Switcher: TIMELINE vs DAY_BY_DAY
  const [viewMode, setViewMode] = useState<'TIMELINE' | 'DAY_BY_DAY'>('TIMELINE');

  // Modals & Forms
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [newStopTitle, setNewStopTitle] = useState('');
  const [newStopCityId, setNewStopCityId] = useState('');
  const [newStopBudget, setNewStopBudget] = useState('25000');

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [activeStopId, setActiveStopId] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemTime, setNewItemTime] = useState('09:00 AM - 11:30 AM');
  const [newItemCost, setNewItemCost] = useState('2500');
  const [newItemType, setNewItemType] = useState<'TRANSPORT' | 'STAY' | 'ACTIVITY' | 'MEAL'>('ACTIVITY');
  const [newItemDay, setNewItemDay] = useState('1');

  useEffect(() => {
    fetchTripDetails();
    fetchCities();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data);
    } catch (err) {
      console.error('Error fetching trip:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await api.get('/cities');
      setCities(res.data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const handleReorderStop = async (stopId: string, direction: 'up' | 'down') => {
    try {
      await api.put(`/trips/stops/${stopId}/reorder`, { direction });
      fetchTripDetails();
    } catch (err) {
      console.error('Error reordering stop:', err);
    }
  };

  const handleReorderItem = async (itemId: string, direction: 'up' | 'down') => {
    try {
      await api.put(`/trips/items/${itemId}/reorder`, { direction });
      fetchTripDetails();
    } catch (err) {
      console.error('Error reordering item:', err);
    }
  };

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/trips/${id}/stops`, {
        cityId: newStopCityId || undefined,
        title: newStopTitle || 'New Stop',
        budget: newStopBudget,
        startDate: trip.startDate,
        endDate: trip.endDate,
      });
      setShowAddStopModal(false);
      setNewStopTitle('');
      fetchTripDetails();
    } catch (err) {
      console.error('Error adding stop:', err);
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    try {
      await api.delete(`/trips/stops/${stopId}`);
      fetchTripDetails();
    } catch (err) {
      console.error('Error deleting stop:', err);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/trips/stops/${activeStopId}/items`, {
        title: newItemTitle,
        timeSlot: newItemTime,
        cost: newItemCost,
        type: newItemType,
        dayNumber: parseInt(newItemDay),
      });
      setShowAddItemModal(false);
      setNewItemTitle('');
      fetchTripDetails();
    } catch (err) {
      console.error('Error adding itinerary item:', err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await api.delete(`/trips/items/${itemId}`);
      fetchTripDetails();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleShareTrip = async () => {
    try {
      await api.post(`/community/share/${id}`, {
        title: trip.title,
        description: trip.description,
      });
      alert('Trip successfully shared to Community Hub!');
      fetchTripDetails();
    } catch (err) {
      alert('Failed to share trip.');
    }
  };

  const getCategoryBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'TRANSPORT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Car className="w-3 h-3" />
            <span>Transport</span>
          </span>
        );
      case 'STAY':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Hotel className="w-3 h-3" />
            <span>Stay / Hotel</span>
          </span>
        );
      case 'MEAL':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Utensils className="w-3 h-3" />
            <span>Meal</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Ticket className="w-3 h-3" />
            <span>Activity</span>
          </span>
        );
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-bold">Loading itinerary builder...</div>;
  }

  if (!trip) {
    return <div className="p-12 text-center text-rose-500 font-bold">Trip not found.</div>;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <StatusBadge status={trip.status} />
            {trip.isPublic && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Publicly Shared
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{trip.title}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">{trip.description || 'Customized multi-city travel itinerary.'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-100 dark:bg-[#162235] hover:bg-slate-200 dark:hover:bg-[#1E2D42] text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4 text-blue-500" />
            <span>Print / Export Guide</span>
          </button>
          <button
            onClick={handleShareTrip}
            className="px-4 py-2.5 bg-slate-100 dark:bg-[#162235] hover:bg-slate-200 dark:hover:bg-[#1E2D42] text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Share2 className="w-4 h-4 text-emerald-500" />
            <span>Share Trip</span>
          </button>
          <Link
            to={`/trips/${trip.id}/budget`}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
          >
            <PieChart className="w-4 h-4" />
            <span>View Financial Breakdown (Screen 9)</span>
          </Link>
        </div>
      </div>

      {/* View Switcher */}
      <div className="bg-white dark:bg-[#111E2E] p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1E2D42] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">Itinerary Layout View Switcher:</span>
        </div>

        <div className="flex bg-slate-100 dark:bg-[#162235] p-1.5 rounded-2xl border border-slate-200 dark:border-[#1E2D42]">
          <button
            onClick={() => setViewMode('TIMELINE')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'TIMELINE'
                ? 'bg-white dark:bg-[#111E2E] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-[#1E2D42]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListFilter className="w-4 h-4 text-emerald-500" />
            <span>Timeline / Flowchart View</span>
          </button>

          <button
            onClick={() => setViewMode('DAY_BY_DAY')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'DAY_BY_DAY'
                ? 'bg-white dark:bg-[#111E2E] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-[#1E2D42]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-emerald-500" />
            <span>Day-by-Day View</span>
          </button>
        </div>
      </div>

      {/* Sections & Stops List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              <span>Multi-City Destination Stops & Line Items</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage reorderable sections, day slots, and categorized items</p>
          </div>

          <button
            onClick={() => setShowAddStopModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add City Stop</span>
          </button>
        </div>

        {trip.stops?.length === 0 ? (
          <div className="p-8 bg-white dark:bg-[#111E2E] rounded-3xl border border-dashed border-slate-300 dark:border-[#1E2D42] text-center space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">No destination sections added yet.</p>
            <button
              onClick={() => setShowAddStopModal(true)}
              className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl"
            >
              Add First City Stop
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {trip.stops.map((stop: any, index: number) => {
              const stopStart = new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const stopEnd = new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <div key={stop.id} className="bg-white dark:bg-[#111E2E] rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-5">
                  {/* Stop Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-[#1E2D42] gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleReorderStop(stop.id, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded bg-slate-100 dark:bg-[#162235] hover:bg-slate-200 dark:hover:bg-[#1E2D42] text-slate-600 dark:text-slate-300 disabled:opacity-30"
                          title="Move Stop Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReorderStop(stop.id, 'down')}
                          disabled={index === trip.stops.length - 1}
                          className="p-1 rounded bg-slate-100 dark:bg-[#162235] hover:bg-slate-200 dark:hover:bg-[#1E2D42] text-slate-600 dark:text-slate-300 disabled:opacity-30"
                          title="Move Stop Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Stop #{index + 1}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                          <span>{stop.title}</span>
                          {stop.city && (
                            <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                              {stop.city.name}, {stop.city.country}
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <div className="px-3 py-1.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl font-medium text-slate-700 dark:text-slate-300">
                        <span className="text-slate-400">Date Range: </span>
                        <span className="font-bold">{stopStart} - {stopEnd}</span>
                      </div>

                      <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl font-medium text-emerald-800 dark:text-emerald-300">
                        <span className="text-emerald-600 dark:text-emerald-400">Budget: </span>
                        <span className="font-bold">₹{stop.budget?.toLocaleString('en-IN')}</span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveStopId(stop.id);
                          setShowAddItemModal(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Line Item</span>
                      </button>

                      <button
                        onClick={() => handleDeleteStop(stop.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition"
                        title="Delete Stop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Render based on View Mode */}
                  {viewMode === 'TIMELINE' ? (
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Flowchart Physical Sequence
                      </h4>

                      {stop.items?.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-2">No line items added yet.</p>
                      ) : (
                        <div className="space-y-3 relative pl-4 border-l-2 border-emerald-500/30">
                          {stop.items.map((item: any, i: number) => (
                            <div key={item.id} className="relative group">
                              <div className="absolute -left-[25px] top-4 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111E2E]" />

                              <div className="bg-slate-50 dark:bg-[#162235] hover:bg-white dark:hover:bg-[#1C2C42] p-4 rounded-2xl border border-slate-200 dark:border-[#1E2D42] shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center space-x-3">
                                  <div className="flex flex-col space-y-0.5">
                                    <button
                                      onClick={() => handleReorderItem(item.id, 'up')}
                                      disabled={i === 0}
                                      className="p-1 text-slate-400 hover:text-emerald-500 disabled:opacity-20"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleReorderItem(item.id, 'down')}
                                      disabled={i === stop.items.length - 1}
                                      className="p-1 text-slate-400 hover:text-emerald-500 disabled:opacity-20"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded">
                                        Day {item.dayNumber}
                                      </span>
                                      {getCategoryBadge(item.type)}
                                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                                        <Clock className="w-3 h-3 text-emerald-500" />
                                        <span>{item.timeSlot || 'Scheduled'}</span>
                                      </span>
                                    </div>

                                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h5>
                                    {item.activity && (
                                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.activity.description}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Cost</span>
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">₹{item.cost?.toLocaleString('en-IN')}</span>
                                  </div>

                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* DAY-BY-DAY VIEW */
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Day-by-Day Categorized Schedule
                      </h4>

                      {[1, 2, 3, 4, 5].map((dayNum) => {
                        const dayItems = stop.items?.filter((i: any) => i.dayNumber === dayNum) || [];
                        if (dayItems.length === 0 && dayNum > 2) return null;

                        return (
                          <div key={dayNum} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2D42] pb-2">
                              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                                Day {dayNum} Schedule
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">{dayItems.length} Planned Items</span>
                            </div>

                            {dayItems.length === 0 ? (
                              <p className="text-xs text-slate-400 italic">No items scheduled for Day {dayNum}.</p>
                            ) : (
                              <div className="space-y-2">
                                {dayItems.map((item: any) => (
                                  <div key={item.id} className="p-3 bg-white dark:bg-[#111E2E] rounded-xl border border-slate-200 dark:border-[#1E2D42] flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <div className="flex items-center space-x-2">
                                        {getCategoryBadge(item.type)}
                                        <span className="text-[11px] text-slate-500 font-semibold">{item.timeSlot}</span>
                                      </div>
                                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h5>
                                    </div>
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">₹{item.cost?.toLocaleString('en-IN')}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Stop Modal */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111E2E] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E2D42] space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add City Destination Stop</h3>
            <form onSubmit={handleAddStop} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Section / Stop Title</label>
                <input
                  type="text"
                  required
                  value={newStopTitle}
                  onChange={(e) => setNewStopTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                  placeholder="e.g. Stop 2: Rome Sightseeing"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">City / Region</label>
                <select
                  value={newStopCityId}
                  onChange={(e) => setNewStopCityId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="">Select Destination City</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}, {c.country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Allocated Budget (₹ INR)</label>
                <input
                  type="number"
                  value={newStopBudget}
                  onChange={(e) => setNewStopBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStopModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#162235] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111E2E] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E2D42] space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Categorized Line Item</h3>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                  placeholder="e.g. Flight to Rome / Louvre Museum Ticket / Dinner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Category *</label>
                <select
                  value={newItemType}
                  onChange={(e: any) => setNewItemType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="ACTIVITY">Activity / Sightseeing</option>
                  <option value="TRANSPORT">Transport / Flight / Train / Cab</option>
                  <option value="STAY">Stay / Hotel / Resort</option>
                  <option value="MEAL">Meal / Dining / Breakfast</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Day Number</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemDay}
                    onChange={(e) => setNewItemDay(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Est. Cost (₹ INR)</label>
                  <input
                    type="number"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Time Slot / Duration</label>
                <input
                  type="text"
                  value={newItemTime}
                  onChange={(e) => setNewItemTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white"
                  placeholder="e.g. 09:00 AM - 11:30 AM (2.5 hrs)"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#162235] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
