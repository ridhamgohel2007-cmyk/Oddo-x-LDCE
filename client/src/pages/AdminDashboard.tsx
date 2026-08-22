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
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  UserCheck,
  UserX,
  FileText,
  User,
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

  // User Management Table States
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [userList, setUserList] = useState<any[]>([]);
  const [actionSuccess, setActionSuccess] = useState('');

  // Analytics Deep Dive Time Horizon Filter
  const [timeHorizon, setTimeHorizon] = useState('MONTH');

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUserList(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setActionSuccess(`User role updated to ${newRole}!`);
      fetchUsers();
      fetchAnalytics();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('CAUTION: Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setActionSuccess('User deleted successfully.');
      fetchUsers();
      fetchAnalytics();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const handleExportCSV = () => {
    if (!data) return;
    const summary = data.summary;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      `GlobeTrotter Admin Analytics Summary Report\n` +
      `Metric,Value\n` +
      `Total Registered Users,${summary.totalUsers}\n` +
      `Total Trips Created,${summary.totalTrips}\n` +
      `Total Catalog Destinations,${summary.totalCities}\n` +
      `Total Community Shares,${summary.totalCommunityPosts}\n\n` +
      `Registered Users Data:\n` +
      `Name,Email,Role,Trips Created,Registration Date\n` +
      userList
        .map((u) => `"${u.name}","${u.email}",${u.role},${u._count?.trips || 0},${new Date(u.createdAt).toLocaleDateString()}`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GlobeTrotter_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-semibold">Loading admin analytics...</div>;
  }

  const summary = data?.summary || {};
  const popularCities = data?.popularCities || [];
  const popularActivities = data?.popularActivities || [];
  const tripTrends = data?.tripTrends || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 shrink-0">
              <Shield className="w-7 h-7 text-emerald-500" />
            </div>
            <span>Admin Panel & Analytics Panel</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Screen 12: Administrative portal to manage registered users, analyze trip trends, and export CSV/PDF reports
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex bg-slate-100 dark:bg-[#162235] p-1.5 rounded-2xl border border-slate-200 dark:border-[#1E2D42]">
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'ANALYTICS'
                ? 'bg-white dark:bg-[#111E2E] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-[#1E2D42]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Analytics Deep Dive
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'USERS'
                ? 'bg-white dark:bg-[#111E2E] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-[#1E2D42]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Manage Users ({userList.length})
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111E2E] p-5 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase">Total Users</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{summary.totalUsers}</div>
        </div>

        <div className="bg-white dark:bg-[#111E2E] p-5 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase">Total Trips Created</span>
          <div className="text-3xl font-black text-emerald-500">{summary.totalTrips}</div>
        </div>

        <div className="bg-white dark:bg-[#111E2E] p-5 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase">Destinations</span>
          <div className="text-3xl font-black text-cyan-500">{summary.totalCities}</div>
        </div>

        <div className="bg-white dark:bg-[#111E2E] p-5 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase">Community Shares</span>
          <div className="text-3xl font-black text-purple-500">{summary.totalCommunityPosts}</div>
        </div>
      </div>

      {activeTab === 'ANALYTICS' ? (
        <div className="space-y-8">
          {/* Analytics Control Bar */}
          <div className="bg-white dark:bg-[#111E2E] p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Time Horizon:</span>
              <select
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="WEEK">This Week</option>
                <option value="MONTH">This Month</option>
                <option value="YEAR">This Year</option>
                <option value="ALL">All Time</option>
              </select>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV Data</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-slate-100 dark:bg-[#162235] hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Export PDF Report</span>
              </button>
            </div>
          </div>

          {/* Chart Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#111E2E] p-6 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span>Trip Creation Growth Trend</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tripTrends}>
                    <defs>
                      <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#10B981" fillOpacity={1} fill="url(#colorTrips)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Cities Pie Chart */}
            <div className="bg-white dark:bg-[#111E2E] p-6 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <PieIcon className="w-5 h-5 text-cyan-500" />
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
                        <Cell key={`cell-${index}`} fill={['#10B981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Rankings Lists with INR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#111E2E] p-6 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Popular Cities Ranking</h3>
              <div className="space-y-2">
                {popularCities.map((c: any, i: number) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#162235] rounded-2xl text-xs font-semibold">
                    <span className="text-slate-900 dark:text-white font-bold">#{i + 1} {c.name}, {c.country}</span>
                    <span className="text-emerald-500 font-extrabold">{c.popularityScore} Score</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#111E2E] p-6 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Popular Activities Ranking</h3>
              <div className="space-y-2">
                {popularActivities.map((a: any, i: number) => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#162235] rounded-2xl text-xs font-semibold">
                    <span className="text-slate-900 dark:text-white font-bold">#{i + 1} {a.title} ({a.city?.name})</span>
                    <span className="text-cyan-500 font-extrabold">₹{a.estimatedCost?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Actionable User Management Data Table */
        <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1E2D42] pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Registered User Directory</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Search users, modify roles (Admin vs Traveler), and view trip activity</p>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin Only</option>
                <option value="USER">Travelers Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-[#162235] text-slate-700 dark:text-slate-200 uppercase font-extrabold text-[10px]">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role Status</th>
                  <th className="p-3">Trips Created</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E2D42]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400 italic">
                      No matching users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-[#162235]">
                      <td className="p-3 font-extrabold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{u.email}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition flex items-center space-x-1.5 ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                          }`}
                          title="Click to toggle role"
                        >
                          <User className="w-3 h-3" />
                          <span>{u.role === 'ADMIN' ? 'Administrator' : 'Traveler'}</span>
                        </button>
                      </td>
                      <td className="p-3 font-black text-emerald-500">{u._count?.trips || 0} Trips</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Active Account
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
