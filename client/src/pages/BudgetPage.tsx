import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import {
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  AlertTriangle,
  Plus,
  Trash2,
  ArrowLeft,
  Receipt,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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
    return <div className="p-12 text-center text-slate-500 font-semibold">Calculating trip budget...</div>;
  }

  const categoryTotals = expenseData?.categoryTotals || {};

  const pieChartData = [
    { name: 'Stay / Accommodation', value: categoryTotals.STAY || 0, color: '#10B981' },
    { name: 'Transport / Flights', value: categoryTotals.TRANSPORT || 0, color: '#06b6d4' },
    { name: 'Activities / Tickets', value: categoryTotals.ACTIVITIES || 0, color: '#f59e0b' },
    { name: 'Meals & Dining', value: categoryTotals.MEALS || 0, color: '#8b5cf6' },
    { name: 'Other Expenses', value: categoryTotals.OTHER || 0, color: '#64748b' },
  ].filter((item) => item.value > 0);

  const barChartData = [
    { category: 'Stay', amount: categoryTotals.STAY || 0 },
    { category: 'Transport', amount: categoryTotals.TRANSPORT || 0 },
    { category: 'Activities', amount: categoryTotals.ACTIVITIES || 0 },
    { category: 'Meals', amount: categoryTotals.MEALS || 0 },
    { category: 'Other', amount: categoryTotals.OTHER || 0 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/trips/${id}`}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Itinerary Builder</span>
        </Link>
        <button
          onClick={() => setShowAddExpenseModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Log Actual Expense</span>
        </button>
      </div>

      {/* Screen 9 Header */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Itinerary View & Financial Budget Breakdown
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Screen 9: Detailed financial analytics for <span className="font-extrabold text-slate-900 dark:text-white">{trip?.title}</span>
        </p>
      </div>

      {/* Overbudget Warning Alert */}
      {expenseData?.isOverBudget && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center space-x-3 text-amber-900 dark:text-amber-200 text-xs font-bold">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-black text-amber-950 dark:text-amber-100">Overbudget Alert!</p>
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              Total expenses (${expenseData.totalSpent.toLocaleString()}) exceed your allocated budget (${expenseData.totalBudget.toLocaleString()}).
            </p>
          </div>
        </div>
      )}

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#111E2E] p-6 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Allocated Budget</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">${expenseData?.totalBudget?.toLocaleString() || 0}</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Set during trip initiation</span>
        </div>

        <div className="bg-white dark:bg-[#111E2E] p-6 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Recorded Spent</span>
          <div className={`text-3xl font-black ${expenseData?.isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-500'}`}>
            ${expenseData?.totalSpent?.toLocaleString() || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Sum of logged expenses</span>
        </div>

        <div className="bg-white dark:bg-[#111E2E] p-6 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Remaining Balance</span>
          <div className={`text-3xl font-black ${expenseData?.remainingBudget < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-cyan-500'}`}>
            ${expenseData?.remainingBudget?.toLocaleString() || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Available funds</span>
        </div>
      </div>

      {/* Detailed Financial Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-[#111E2E] p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-4">
          <div className="border-b border-slate-100 dark:border-[#1E2D42] pb-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <PieChartIcon className="w-5 h-5 text-emerald-500" />
              <span>Cost Distribution Pie Chart</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Proportional breakdown by category</p>
          </div>

          {pieChartData.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No expense receipts logged yet.</div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
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

        {/* Bar Chart */}
        <div className="bg-white dark:bg-[#111E2E] p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-4">
          <div className="border-b border-slate-100 dark:border-[#1E2D42] pb-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              <span>Category Expense Bar Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Exact monetary totals per category</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="category" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip formatter={(val: any) => [`$${val}`, 'Spent']} />
                <Bar dataKey="amount" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Logged Expenses Receipts Table */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2D42] pb-3">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-emerald-500" />
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
          <p className="text-xs text-slate-400 italic py-4 text-center">No individual expenses logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-[#162235] text-slate-700 dark:text-slate-200 uppercase font-extrabold text-[10px]">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Notes / Description</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount ($)</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E2D42]">
                {expenseData.expenses.map((exp: any) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 dark:hover:bg-[#162235]">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{exp.category}</td>
                    <td className="p-3">{exp.notes || '—'}</td>
                    <td className="p-3">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400">${exp.amount}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
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

      {/* Add Expense Modal without Emojis */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111E2E] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E2D42] space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Log Actual Expense Receipt</h3>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="STAY">Stay / Accommodation</option>
                  <option value="TRANSPORT">Transport / Flights / Train</option>
                  <option value="ACTIVITIES">Activities & Tickets</option>
                  <option value="MEALS">Meals & Dining</option>
                  <option value="OTHER">Other Expenses</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Notes / Receipt Info</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white"
                  placeholder="e.g. Hotel Le Meurice deposit"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#162235] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold"
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
