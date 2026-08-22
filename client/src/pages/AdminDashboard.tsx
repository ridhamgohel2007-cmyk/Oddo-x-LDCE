import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import {
  Shield,
  Users,
  Compass,
  MapPin,
  TrendingUp,
  BarChart2,
  Trash2,
  PieChart as PieIcon,
  Search,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'USERS'>('ANALYTICS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchAnalytics();
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-semibold">Loading admin analytics...</div>;
  }

  const summary = data?.summary || {};
  const popularCities = data?.popularCities || [];
  const popularActivities = data?.popularActivities || [];
  const users = data?.users || [];
  const tripTrends = data?.tripTrends || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Screen 12 Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center space-x-4 whitespace-nowrap">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm shrink-0">
              <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="whitespace-nowrap">Admin Panel / Analytics Dashboard</span>
          </h1>
          <p className="text-xs font-medium text-gray-600 dark:text-slate-400 mt-1">Screen 12: Admin-only interface to track user trends, trip adoption, and platform usage</p>
        </div>

        {/* Tab Selector Buttons matching Screen 12 Wireframe */}
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'ANALYTICS' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-700 dark:text-slate-300'
            }`}
          >
            User Trends & Analytics
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'USERS' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-700 dark:text-slate-300'
            }`}
          >
            Manage Users ({users.length})
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-gray-600 dark:text-slate-400 uppercase">Total Users</span>
          <div className="text-3xl font-black text-gray-900 dark:text-white">{summary.totalUsers}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-gray-600 dark:text-slate-400 uppercase">Total Trips Created</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{summary.totalTrips}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-gray-600 dark:text-slate-400 uppercase">Destinations</span>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{summary.totalCities}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-gray-600 dark:text-slate-400 uppercase">Community Shares</span>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{summary.totalCommunityPosts}</div>
        </div>
      </div>

      {activeTab === 'ANALYTICS' ? (
        <div className="space-y-8">
          {/* Wireframe Screen 12 Chart Grid: Trip Trends Line/Area Chart & Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Monthly Trip Creation Growth Trend</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tripTrends}>
                    <defs>
                      <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorTrips)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Cities Pie Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center space-x-2">
                <PieIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Top Destination Share</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={popularCities}
                      dataKey="popularityScore"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {popularCities.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Popular Cities & Activities List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-base font-black bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">Popular Cities Ranking</h3>
              <div className="space-y-2">
                {popularCities.map((c: any, i: number) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/60 rounded-2xl text-xs font-semibold">
                    <span className="text-gray-900 dark:text-slate-100 font-bold">#{i + 1} {c.name}, {c.country}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{c.popularityScore} Score</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-base font-black bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">Popular Activities Ranking</h3>
              <div className="space-y-2">
                {popularActivities.map((a: any, i: number) => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/60 rounded-2xl text-xs font-semibold">
                    <span className="text-gray-900 dark:text-slate-100 font-bold">#{i + 1} {a.title} ({a.city?.name})</span>
                    <span className="text-blue-700 dark:text-blue-400 font-extrabold">${a.estimatedCost}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Wireframe Screen 12: Manage Users Section */
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4">
          <h2 className="text-xl font-black bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 dark:from-emerald-400 dark:to-white bg-clip-text text-transparent">Manage Registered Users</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-slate-200">
              <thead className="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 uppercase font-extrabold text-[11px]">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Trips Created</th>
                  <th className="p-3">Registered On</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="p-3 font-extrabold text-gray-900 dark:text-white">{u.name}</td>
                    <td className="p-3 font-semibold text-gray-800 dark:text-slate-300">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${u.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300' : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 font-black text-emerald-700 dark:text-emerald-400">{u._count?.trips || 0}</td>
                    <td className="p-3 font-semibold text-gray-700 dark:text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
