import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import {
  DollarSign,
  PieChart as PieChartIcon,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  ArrowLeft,
  Receipt,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

export const BudgetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [expenseData, setExpenseData] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states for adding actual expense
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [category, setCategory] = useState('STAY');
  const [amount, setAmount] = useState('150');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, [id]);

  const fetchExpenses = async () => {
    try {
      const [expenseRes, tripRes] = await Promise.all([
        api.get(`/expenses/trip/${id}`),
        api.get(`/trips/${id}`),
      ]);
      setExpenseData(expenseRes.data);
      setTrip(tripRes.data);
    } catch (err) {
      console.error('Error fetching budget:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/expenses', {
        tripId: id,
        category,
        amount,
        notes,
      });
      setShowAddExpenseModal(false);
      setNotes('');
      fetchExpenses();
    } catch (err) {
      console.error('Failed to log expense:', err);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await api.delete(`/expenses/${expenseId}`);
      fetchExpenses();
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-semibold">Calculating trip budget...</div>;
  }

  const categoryTotals = expenseData?.categoryTotals || {};
  const pieChartData = [
    { name: 'Stay / Accommodation', value: categoryTotals.STAY || 0, color: '#3b82f6' },
    { name: 'Transport / Flights', value: categoryTotals.TRANSPORT || 0, color: '#10b981' },
    { name: 'Activities / Sightseeing', value: categoryTotals.ACTIVITIES || 0, color: '#f59e0b' },
    { name: 'Meals & Dining', value: categoryTotals.MEALS || 0, color: '#8b5cf6' },
    { name: 'Other Expenses', value: categoryTotals.OTHER || 0, color: '#64748b' },
  ].filter((item) => item.value > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/trips/${id}`}
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Itinerary Builder</span>
        </Link>
        <button
          onClick={() => setShowAddExpenseModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Log Actual Expense</span>
        </button>
      </div>

      {/* Screen 9 Wireframe: Trip Budget & Cost Breakdown Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Financial View & Cost Breakdown
        </h1>
        <p className="text-xs font-medium text-gray-600 dark:text-slate-400">
          Screen 9: Summarized financial analytics for <span className="font-extrabold text-gray-900 dark:text-white">{trip?.title}</span>
        </p>
      </div>

      {/* Overbudget Warning Alert (Wireframe Screen 9) */}
      {expenseData?.isOverBudget && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 rounded-2xl flex items-center space-x-3 text-amber-900 dark:text-amber-200 text-xs font-bold">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-black text-amber-950 dark:text-amber-100">Overbudget Alert!</p>
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              Total expenses (${expenseData.totalSpent.toLocaleString()}) exceed your allocated budget (${expenseData.totalBudget.toLocaleString()}).
            </p>
          </div>
        </div>
      )}

      {/* Financial Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Allocated Budget</span>
          <div className="text-3xl font-black text-gray-900 dark:text-white">${expenseData?.totalBudget?.toLocaleString() || 0}</div>
          <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400">Set during trip initiation</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Total Recorded Spent</span>
          <div className={`text-3xl font-black ${expenseData?.isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            ${expenseData?.totalSpent?.toLocaleString() || 0}
          </div>
          <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400">Sum of logged expenses</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Remaining Balance</span>
          <div className={`text-3xl font-black ${expenseData?.remainingBudget < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}>
            ${expenseData?.remainingBudget?.toLocaleString() || 0}
          </div>
          <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400">Available funds</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-6">
        <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
          <h2 className="text-lg font-black bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 dark:from-emerald-400 dark:to-white bg-clip-text text-transparent flex items-center space-x-2">
            <PieChartIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Category Cost Distribution Chart</span>
          </h2>
          <p className="text-xs font-medium text-gray-600 dark:text-slate-400">Breakdown of transport, accommodation, meals, and activity costs</p>
        </div>

        {pieChartData.length === 0 ? (
          <div className="p-8 text-center text-xs font-semibold text-gray-500 dark:text-slate-400">No expense receipts logged yet.</div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value}`, 'Amount']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Logged Expenses Receipts Table */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
          <h2 className="text-lg font-black bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 dark:from-blue-400 dark:to-white bg-clip-text text-transparent flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Logged Expenses</span>
          </h2>
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            + Add Expense Record
          </button>
        </div>

        {expenseData?.expenses?.length === 0 ? (
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 italic py-4 text-center">No individual expenses logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-slate-200">
              <thead className="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 uppercase font-extrabold text-[11px]">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Notes / Description</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount ($)</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {expenseData.expenses.map((exp: any) => (
                  <tr key={exp.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="p-3 font-bold text-gray-900 dark:text-white">{exp.category}</td>
                    <td className="p-3 font-semibold text-gray-800 dark:text-slate-300">{exp.notes || '—'}</td>
                    <td className="p-3 font-medium text-gray-700 dark:text-slate-400">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="p-3 font-black text-emerald-700 dark:text-emerald-400">${exp.amount}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4 border border-gray-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Log Actual Expense Receipt</h3>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-900 dark:text-slate-200 uppercase mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="STAY" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Stay / Accommodation</option>
                  <option value="TRANSPORT" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Transport / Flights / Train</option>
                  <option value="ACTIVITIES" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Activities & Tickets</option>
                  <option value="MEALS" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Meals & Dining</option>
                  <option value="OTHER" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Other Expenses</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 dark:text-slate-200 uppercase mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 dark:text-slate-200 uppercase mb-1">Notes / Receipt Info</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Hotel Le Meurice deposit"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
