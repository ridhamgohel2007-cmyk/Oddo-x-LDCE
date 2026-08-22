import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { TripCard, TripData } from '../components/TripCard';
import { Search, Plus, Luggage, Filter, ArrowUpDown } from 'lucide-react';

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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center space-x-3">
            <Luggage className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span>User Trip Listing</span>
          </h1>
          <p className="text-xs font-medium text-gray-600 dark:text-slate-400 mt-1">Screen 6: Easily access, categorize, and manage all your travel plans</p>
        </div>

        <Link
          to="/create-trip"
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Plan a New Trip</span>
        </Link>
      </div>

      {/* Wireframe Search & Control Bar: Search bar, Group by, Filter, Sort by */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bar......"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Status Filter / Group by */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-extrabold text-gray-900 dark:text-slate-100"
          >
            <option value="ALL" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Group By: All Statuses</option>
            <option value="ONGOING" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Group By: Ongoing</option>
            <option value="UPCOMING" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Group By: Up-coming</option>
            <option value="COMPLETED" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Group By: Completed</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-extrabold text-gray-900 dark:text-slate-100"
          >
            <option value="date" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Sort By: Date (Soonest)</option>
            <option value="title" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Sort By: Title A-Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-slate-400 font-semibold">Loading trips...</div>
      ) : (
        <div className="space-y-10">
          {/* Ongoing Section */}
          {(selectedStatus === 'ALL' || selectedStatus === 'ONGOING') && (
            <section className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-slate-800 pb-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h2 className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Ongoing</h2>
                <span className="text-xs text-gray-700 dark:text-slate-300 font-extrabold">({ongoingTrips.length})</span>
              </div>

              {ongoingTrips.length === 0 ? (
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 text-xs font-semibold text-gray-600 dark:text-slate-400 text-center">
                  No ongoing trips at the moment.
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

          {/* Up-coming Section */}
          {(selectedStatus === 'ALL' || selectedStatus === 'UPCOMING') && (
            <section className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-slate-800 pb-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <h2 className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Up-coming</h2>
                <span className="text-xs text-gray-700 dark:text-slate-300 font-extrabold">({upcomingTrips.length})</span>
              </div>

              {upcomingTrips.length === 0 ? (
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 text-xs font-semibold text-gray-600 dark:text-slate-400 text-center">
                  No upcoming trips planned.
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

          {/* Completed Section */}
          {(selectedStatus === 'ALL' || selectedStatus === 'COMPLETED') && (
            <section className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-slate-800 pb-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <h2 className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Completed</h2>
                <span className="text-xs text-gray-700 dark:text-slate-300 font-extrabold">({completedTrips.length})</span>
              </div>

              {completedTrips.length === 0 ? (
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 text-xs font-semibold text-gray-600 dark:text-slate-400 text-center">
                  No past completed trips recorded.
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
