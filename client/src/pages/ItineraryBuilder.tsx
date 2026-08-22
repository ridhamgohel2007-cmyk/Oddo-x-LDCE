import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  Calendar,
  MapPin,
  DollarSign,
  Plus,
  Trash2,
  Share2,
  ArrowDown,
  Clock,
  CheckCircle,
  Tag,
  Eye,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const ItineraryBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [trip, setTrip] = useState<any>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals / Form States
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [newStopTitle, setNewStopTitle] = useState('');
  const [newStopCityId, setNewStopCityId] = useState('');
  const [newStopBudget, setNewStopBudget] = useState('500');

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [activeStopId, setActiveStopId] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemTime, setNewItemTime] = useState('10:00 AM - 12:00 PM');
  const [newItemCost, setNewItemCost] = useState('45');
  const [newItemType, setNewItemType] = useState('ACTIVITY');
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

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-semibold">Loading itinerary...</div>;
  }

  if (!trip) {
    return <div className="p-12 text-center text-rose-500 font-semibold">Trip not found.</div>;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <StatusBadge status={trip.status} />
            {trip.isPublic && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Publicly Shared
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">{trip.title}</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">{trip.description || 'Customized multi-city travel itinerary.'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleShareTrip}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Trip</span>
          </button>
          <Link
            to={`/trips/${trip.id}/budget`}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
          >
            <DollarSign className="w-4 h-4" />
            <span>View Budget Breakdown</span>
          </Link>
        </div>
      </div>

      {/* Screen 5 Wireframe: Section 1, Section 2, Section 3 Layout */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Itinerary Sections & Destination Stops</span>
            </h2>
            <p className="text-xs text-gray-500">Day-wise section breakdown with allocated budgets</p>
          </div>

          <button
            onClick={() => setShowAddStopModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Another Section</span>
          </button>
        </div>

        {trip.stops?.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-dashed border-gray-300 text-center space-y-3">
            <p className="text-xs text-gray-500">No destination sections added yet.</p>
            <button
              onClick={() => setShowAddStopModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              Add Section 1
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {trip.stops.map((stop: any, index: number) => {
              const stopStart = new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const stopEnd = new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <div key={stop.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
                  {/* Section Header (Screen 5 wireframe) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Section {index + 1}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <span>{stop.title}</span>
                        {stop.city && (
                          <span className="text-xs font-normal px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                            {stop.city.name}, {stop.city.country}
                          </span>
                        )}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700">
                        <span className="text-gray-400">Date Range: </span>
                        <span className="font-bold">{stopStart} to {stopEnd}</span>
                      </div>

                      <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl font-medium text-emerald-800">
                        <span className="text-emerald-600">Budget: </span>
                        <span className="font-bold">${stop.budget}</span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveStopId(stop.id);
                          setShowAddItemModal(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Activity</span>
                      </button>
                    </div>
                  </div>

                  {/* Wireframe Screen 9: Physical Activity Sequence Flowchart / Daily Timeline */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Physical Activity & Expense Sequence Flow
                    </h4>

                    {stop.items?.length === 0 ? (
                      <p className="text-xs text-gray-400 italic py-2">No activities added to this section yet.</p>
                    ) : (
                      <div className="space-y-4 relative pl-4 border-l-2 border-emerald-200">
                        {stop.items.map((item: any, i: number) => (
                          <div key={item.id} className="relative group">
                            {/* Timeline Node Dot */}
                            <div className="absolute -left-[25px] top-3.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-200" />

                            <div className="bg-gray-50 hover:bg-white p-4 rounded-2xl border border-gray-200 shadow-2xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                                    Day {item.dayNumber}
                                  </span>
                                  <span className="text-xs font-semibold text-blue-600 flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{item.timeSlot || 'Scheduled'}</span>
                                  </span>
                                </div>

                                <h5 className="text-sm font-bold text-gray-900">{item.title}</h5>
                                {item.activity && (
                                  <p className="text-xs text-gray-500">{item.activity.description}</p>
                                )}
                              </div>

                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Expense</span>
                                  <span className="text-sm font-extrabold text-emerald-700">${item.cost}</span>
                                </div>

                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Arrow Indicator for Flowchart Effect */}
                            {i < stop.items.length - 1 && (
                              <div className="flex justify-center my-1 text-emerald-400">
                                <ArrowDown className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Another Section Button (Screen 5 wireframe) */}
        <div className="text-center pt-4">
          <button
            onClick={() => setShowAddStopModal(true)}
            className="px-6 py-3 bg-white hover:bg-gray-50 text-emerald-700 border-2 border-dashed border-emerald-300 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add another Section</span>
          </button>
        </div>
      </div>

      {/* Add Stop Modal */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Add Itinerary Section / Destination Stop</h3>
            <form onSubmit={handleAddStop} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Section Title</label>
                <input
                  type="text"
                  required
                  value={newStopTitle}
                  onChange={(e) => setNewStopTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  placeholder="e.g. Stop 2: Rome Sightseeing"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City / Region</label>
                <select
                  value={newStopCityId}
                  onChange={(e) => setNewStopCityId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="">Select Destination City</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}, {c.country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Budget Allocation ($)</label>
                <input
                  type="number"
                  value={newStopBudget}
                  onChange={(e) => setNewStopBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStopModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Add Activity / Expense Item</h3>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  placeholder="e.g. Louvre Museum Guided Tour"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Day Number</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemDay}
                    onChange={(e) => setNewItemDay(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cost ($)</label>
                  <input
                    type="number"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Time Slot</label>
                <input
                  type="text"
                  value={newItemTime}
                  onChange={(e) => setNewItemTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  placeholder="10:00 AM - 01:00 PM"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
