import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { TripCard, TripData } from '../components/TripCard';
import { Search, Plus, Luggage, Compass, CalendarCheck, CheckCircle2, Clock } from 'lucide-react';

export const MyTrips: React.FC = () => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await api.delete(`/trips/${id}`);
      fetchTrips();
    } catch (err) {
      alert('Failed to delete trip.');
    }
  };

  // Filter & Search
  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Categorized trips for Screen 6 Wireframe
  const ongoingTrips = filteredTrips.filter((t) => t.status === 'ONGOING');
  const upcomingTrips = filteredTrips.filter((t) => t.status === 'UPCOMING');
  const completedTrips = filteredTrips.filter((t) => t.status === 'COMPLETED');

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <Luggage className="w-8 h-8 text-emerald-500" />
            <span>My Travel Itineraries</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Screen 6: Categorized trip listing with status tabs and budget metrics</p>
        </div>

        <Link
          to="/create-trip"
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-2 transition hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Plan a New Trip</span>
        </Link>
      </div>

      {/* Wireframe Search & Control Bar */}
      <div className="bg-white dark:bg-[#111E2E] p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1E2D42] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips by title or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Status Filter Tabs */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value="ALL">Group By: All Statuses ({trips.length})</option>
            <option value="ONGOING">Group By: Ongoing ({trips.filter((t) => t.status === 'ONGOING').length})</option>
            <option value="UPCOMING">Group By: Up-coming ({trips.filter((t) => t.status === 'UPCOMING').length})</option>
            <option value="COMPLETED">Group By: Completed ({trips.filter((t) => t.status === 'COMPLETED').length})</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value="date">Sort By: Date (Soonest)</option>
            <option value="title">Sort By: Title A-Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 font-semibold">Loading trips...</div>
      ) : (
        <div className="space-y-10">
          {/* Ongoing Trips Section */}
          {(selectedStatus === 'ALL' || selectedStatus === 'ONGOING') && (
            <section className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-[#1E2D42] pb-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h2 className="text-xl font-black text-emerald-600 dark:text-emerald-400">Ongoing Trips</h2>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">({ongoingTrips.length})</span>
              </div>

              {ongoingTrips.length === 0 ? (
                <div className="p-8 bg-white dark:bg-[#111E2E] rounded-3xl border border-dashed border-slate-300 dark:border-[#1E2D42] text-center space-y-3">
                  <Clock className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No ongoing trips active right now</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">You have no active trips currently in progress.</p>
                  <Link
                    to="/create-trip"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Plan New Trip</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ongoingTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Up-coming Trips Section */}
          {(selectedStatus === 'ALL' || selectedStatus === 'UPCOMING') && (
            <section className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-[#1E2D42] pb-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <h2 className="text-xl font-black text-indigo-600 dark:text-indigo-400">Up-coming Trips</h2>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">({upcomingTrips.length})</span>
              </div>

              {upcomingTrips.length === 0 ? (
                <div className="p-8 bg-white dark:bg-[#111E2E] rounded-3xl border border-dashed border-slate-300 dark:border-[#1E2D42] text-center space-y-3">
                  <CalendarCheck className="w-10 h-10 text-indigo-500 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No upcoming trips scheduled</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Start planning your next multi-city adventure!</p>
                  <Link
                    to="/create-trip"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Start Planning</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Completed Trips Section */}
          {(selectedStatus === 'ALL' || selectedStatus === 'COMPLETED') && (
            <section className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-[#1E2D42] pb-2">
                <span className="w-3 h-3 rounded-full bg-violet-500" />
                <h2 className="text-xl font-black text-violet-600 dark:text-violet-400">Completed Journeys</h2>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">({completedTrips.length})</span>
              </div>

              {completedTrips.length === 0 ? (
                <div className="p-8 bg-white dark:bg-[#111E2E] rounded-3xl border border-dashed border-slate-300 dark:border-[#1E2D42] text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-violet-500 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No past completed trips recorded</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Your finished travel itineraries will appear here after completion.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
};
