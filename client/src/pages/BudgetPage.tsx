import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import {
  PieChart as PieChartIcon,
  BarChart3,
  AlertTriangle,
  Plus,
  Trash2,
  ArrowLeft,
  Receipt,
  Users,
  User,
  Calculator,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const BudgetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [expenseData, setExpenseData] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Traveler Count Selector State (Tarzan Way Feature)
  const [travelerCount, setTravelerCount] = useState<number>(2); // Default Couple (2 travelers)

  // Form states for adding actual expense
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [category, setCategory] = useState('STAY');
  const [amount, setAmount] = useState('5000');
  const [notes, setNotes] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');

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
  const totalBudget = expenseData?.totalBudget || 0;
  const totalSpent = expenseData?.totalSpent || 0;
  const remainingBudget = expenseData?.remainingBudget || 0;

  // Per-Person Calculations (The Tarzan Way Feature)
  const count = Math.max(1, travelerCount);
  const perPersonBudget = Math.round(totalBudget / count);
  const perPersonSpent = Math.round(totalSpent / count);
  const perPersonRemaining = Math.round(remainingBudget / count);

  const pieChartData = [
    { name: 'Stay / Accommodation', value: categoryTotals.STAY || 0, color: '#10B981' },
    { name: 'Transport / Flights', value: categoryTotals.TRANSPORT || 0, color: '#06b6d4' },
    { name: 'Activities / Tickets', value: categoryTotals.ACTIVITIES || 0, color: '#f59e0b' },
    { name: 'Meals & Dining', value: categoryTotals.MEALS || 0, color: '#8b5cf6' },
    { name: 'Other Expenses', value: categoryTotals.OTHER || 0, color: '#64748b' },
  ].filter((item) => item.value > 0);

  const barChartData = [
    { category: 'Stay', amount: categoryTotals.STAY || 0, perPerson: Math.round((categoryTotals.STAY || 0) / count) },
    { category: 'Transport', amount: categoryTotals.TRANSPORT || 0, perPerson: Math.round((categoryTotals.TRANSPORT || 0) / count) },
    { category: 'Activities', amount: categoryTotals.ACTIVITIES || 0, perPerson: Math.round((categoryTotals.ACTIVITIES || 0) / count) },
    { category: 'Meals', amount: categoryTotals.MEALS || 0, perPerson: Math.round((categoryTotals.MEALS || 0) / count) },
    { category: 'Other', amount: categoryTotals.OTHER || 0, perPerson: Math.round((categoryTotals.OTHER || 0) / count) },
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
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Financial View & Budget Breakdown
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Screen 9: Detailed financial analytics for <span className="font-extrabold text-slate-900 dark:text-white">{trip?.title}</span>
          </p>
        </div>

        {/* Currency Switcher Pill */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-[#162235] p-1.5 rounded-2xl border border-slate-200 dark:border-[#1E2D42] text-xs font-bold">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 px-2 uppercase font-extrabold">Currency:</span>
          {(['INR', 'USD', 'EUR'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                selectedCurrency === curr
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E2D42]'
              }`}
            >
              {curr === 'INR' ? '₹ INR' : curr === 'USD' ? '$ USD' : '€ EUR'}
            </button>
          ))}
        </div>
      </div>

      {/* Overbudget Warning Alert */}
      {expenseData?.isOverBudget && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center space-x-3 text-amber-900 dark:text-amber-200 text-xs font-bold">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-black text-amber-950 dark:text-amber-100">Overbudget Alert!</p>
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              Total expenses (₹{expenseData.totalSpent?.toLocaleString('en-IN')}) exceed your allocated budget (₹{expenseData.totalBudget?.toLocaleString('en-IN')}).
            </p>
          </div>
        </div>
      )}

      {/* Tarzan-Style Traveler Count & Per-Person Pricing Split Selector Control */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1E2D42] pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              <span>Per-Person vs. Total Group Pricing Calculator</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select traveler count to automatically calculate individual split costs
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-[#162235] p-1.5 rounded-2xl border border-slate-200 dark:border-[#1E2D42]">
            <Users className="w-4 h-4 text-emerald-500 ml-2" />
            <select
              value={travelerCount}
              onChange={(e) => setTravelerCount(parseInt(e.target.value))}
              className="bg-transparent text-xs font-extrabold text-slate-900 dark:text-white px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value={1}>Solo Traveler (1 Person)</option>
              <option value={2}>Couple (2 Travelers)</option>
              <option value={3}>Group of 3</option>
              <option value={4}>Group of 4 Travelers</option>
              <option value={6}>Group of 6 Travelers</option>
              <option value={8}>Group of 8 Travelers</option>
            </select>
          </div>
        </div>

        {/* Pricing Comparison Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
              Per-Person Split Cost ({count} Traveler{count !== 1 ? 's' : ''})
            </span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{perPersonBudget.toLocaleString('en-IN')} <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">/ person</span>
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
              Per-person recorded spend: ₹{perPersonSpent.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] space-y-1">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              Total Group Package Price ({count} Traveler{count !== 1 ? 's' : ''})
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              ₹{totalBudget.toLocaleString('en-IN')} <span className="text-xs font-bold text-slate-400">total</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              Total group recorded spend: ₹{totalSpent.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Metric Cards with INR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#111E2E] p-6 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Allocated Budget</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">₹{totalBudget?.toLocaleString('en-IN') || 0}</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">₹{perPersonBudget.toLocaleString('en-IN')} / person</span>
        </div>

        <div className="bg-white dark:bg-[#111E2E] p-6 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Recorded Spent</span>
          <div className={`text-3xl font-black ${expenseData?.isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-500'}`}>
            ₹{totalSpent?.toLocaleString('en-IN') || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">₹{perPersonSpent.toLocaleString('en-IN')} / person</span>
        </div>

        <div className="bg-white dark:bg-[#111E2E] p-6 rounded-3xl border border-slate-200 dark:border-[#1E2D42] shadow-sm space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Remaining Balance</span>
          <div className={`text-3xl font-black ${remainingBudget < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-cyan-500'}`}>
            ₹{remainingBudget?.toLocaleString('en-IN') || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">₹{perPersonRemaining.toLocaleString('en-IN')} / person</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

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
                <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Total Spent']} />
                <Bar dataKey="amount" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Logged Expenses Table with INR */}
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
                  <th className="p-3">Total Cost (₹ INR)</th>
                  <th className="p-3">Per Person ({count} pax)</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E2D42]">
                {expenseData.expenses.map((exp: any) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 dark:hover:bg-[#162235]">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{exp.category}</td>
                    <td className="p-3">{exp.notes || '—'}</td>
                    <td className="p-3">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400">₹{exp.amount?.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-bold text-slate-700 dark:text-slate-300">₹{Math.round((exp.amount || 0) / count).toLocaleString('en-IN')}</td>
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

      {/* Add Expense Modal with INR */}
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Total Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white"
                  placeholder="5000"
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
