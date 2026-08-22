import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { TripCard, TripData } from '../components/TripCard';
import { Search, Plus, Luggage, CalendarCheck, CheckCircle2, Clock, Filter, ArrowUpDown } from 'lucide-react';

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
  const filteredTrips = trips
    .filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'budget') return (b.totalBudget || 0) - (a.totalBudget || 0);
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

  // Categorized trips with standard English labels (Upcoming)
  const ongoingTrips = filteredTrips.filter((t) => t.status === 'ONGOING');
  const upcomingTrips = filteredTrips.filter((t) => t.status === 'UPCOMING');
  const completedTrips = filteredTrips.filter((t) => t.status === 'COMPLETED');

  return (
    <div className="space-y-8 pb-16">
      {/* Production Header Banner */}
      <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <Luggage className="w-8 h-8 text-[#7C3AED]" />
            <span>My Travel Itineraries</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage, edit, and organize all your upcoming and past multi-city travel plans
          </p>
        </div>

        <Link
          to="/create-trip"
          className="px-5 py-3 bg-[#714B67] hover:bg-[#613E57] text-white rounded-2xl font-bold text-xs shadow-md shadow-purple-500/20 flex items-center space-x-2 transition hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Single Unified Control Toolbar */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search itineraries by title or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
          {/* Status Filter Tabs */}
          <div className="relative w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#00A09D] absolute left-3 top-3 pointer-events-none" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full md:w-auto pl-8 pr-4 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="ALL">All Statuses ({trips.length})</option>
              <option value="UPCOMING">Upcoming ({trips.filter((t) => t.status === 'UPCOMING').length})</option>
              <option value="ONGOING">Ongoing ({trips.filter((t) => t.status === 'ONGOING').length})</option>
              <option value="COMPLETED">Completed ({trips.filter((t) => t.status === 'COMPLETED').length})</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative w-full md:w-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#7C3AED] absolute left-3 top-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto pl-8 pr-4 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="date">Sort By: Departure Date</option>
              <option value="budget">Sort By: Highest Budget</option>
              <option value="title">Sort By: Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 font-semibold">Loading your itineraries...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Upcoming Trips Section (Placed Higher & Prominently) */}
          {(selectedStatus === 'ALL' || selectedStatus === 'UPCOMING') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Upcoming Trips</h2>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">({upcomingTrips.length})</span>
                </div>
              </div>

              {upcomingTrips.length === 0 ? (
                <div className="p-8 bg-white dark:bg-[#1E293B] rounded-3xl border border-dashed border-slate-300 dark:border-white/10 text-center space-y-3">
                  <CalendarCheck className="w-10 h-10 text-[#7C3AED] mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No upcoming trips scheduled</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Start planning your next multi-city adventure!</p>
                  <Link
                    to="/create-trip"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#714B67] text-white rounded-xl text-xs font-bold shadow-md"
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

          {/* Ongoing Trips Section (Collapsed Compact Row when 0) */}
          {(selectedStatus === 'ALL' || selectedStatus === 'ONGOING') && (
            <section className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-white/10 pb-2">
                <span className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Ongoing Trips</h2>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">({ongoingTrips.length})</span>
              </div>

              {ongoingTrips.length === 0 ? (
                /* Compact Row when 0 Ongoing Trips to maintain clean visual hierarchy */
                <div className="p-4 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#00A09D] shrink-0" />
                    <span>No active trips currently in progress. Your next upcoming trip is ready below!</span>
                  </div>
                  <Link to="/create-trip" className="text-xs font-extrabold text-[#7C3AED] dark:text-[#38BDF8] hover:underline shrink-0 ml-2">
                    + Plan Trip
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

          {/* Completed Trips Section */}
          {(selectedStatus === 'ALL' || selectedStatus === 'COMPLETED') && (
            <section className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-white/10 pb-2">
                <span className="w-3 h-3 rounded-full bg-[#E2A03F]" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Completed Journeys</h2>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">({completedTrips.length})</span>
              </div>

              {completedTrips.length === 0 ? (
                <div className="p-6 bg-white dark:bg-[#1E293B] rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-center text-xs text-slate-400">
                  <span>No past completed trips recorded yet.</span>
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
