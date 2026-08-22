import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Trash2,
  Eye,
  PieChart,
  Hotel,
  Ticket,
  Utensils,
  Navigation,
  Users,
  MoreVertical,
  Share2,
  Download,
  Copy,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  Clock,
  Plus,
  Receipt,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import api from '../lib/api';

export interface TripData {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  status: string;
  totalBudget: number;
  stops?: any[];
  isPublic?: boolean;
}

interface TripCardProps {
  trip: TripData;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete, onDuplicate }) => {
  const [travelerCount, setTravelerCount] = useState<number>(2); // Default couple (2 people)
  const [showMenu, setShowMenu] = useState(false);

  // Modal Action States
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showQuickExpenseModal, setShowQuickExpenseModal] = useState(false);

  // Quick Expense Form State (Request 2)
  const [expenseCategory, setExpenseCategory] = useState('STAY');
  const [expenseAmount, setExpenseAmount] = useState('2500');
  const [expenseNotes, setExpenseNotes] = useState('');
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [expenseSuccess, setExpenseSuccess] = useState('');

  const [copiedLink, setCopiedLink] = useState(false);
  const [duplicateSuccess, setDuplicateSuccess] = useState('');

  const formattedStart = new Date(trip.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const formattedEnd = new Date(trip.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const destinationCount = trip.stops?.length || 0;

  // Compute Multi-City Route String & Transit Time Estimates
  let routeNames: string[] = [];
  if (trip.stops && trip.stops.length > 0) {
    routeNames = trip.stops.map((s: any) => s.city?.name || s.title.replace('Stop: ', ''));
  }

  // Calculate Tarzan-style Structured Itinerary Breakdown Counts
  let stayCount = 0;
  let transportCount = 0;
  let activityCount = 0;
  let mealCount = 0;
  let totalRecordedSpent = 0;

  if (trip.stops) {
    trip.stops.forEach((stop: any) => {
      if (stop.items) {
        stop.items.forEach((item: any) => {
          const type = item.type?.toUpperCase();
          totalRecordedSpent += item.cost || 0;
          if (type === 'STAY') stayCount++;
          else if (type === 'TRANSPORT') transportCount++;
          else if (type === 'MEAL') mealCount++;
          else activityCount++;
        });
      }
    });
  }

  if (stayCount === 0 && transportCount === 0 && activityCount === 0 && mealCount === 0) {
    stayCount = Math.max(1, destinationCount);
    transportCount = Math.max(1, destinationCount);
    activityCount = Math.max(3, destinationCount * 2);
  }

  // Quick Alert Warning Pill
  const spentRatio = trip.totalBudget > 0 ? totalRecordedSpent / trip.totalBudget : 0;
  const isOverBudget = spentRatio >= 1.0;
  const isNearBudgetLimit = spentRatio >= 0.8 && !isOverBudget;

  // Interactive Pax Multiplier Real-Time Math (Request 1)
  const count = Math.max(1, travelerCount);
  const perPersonCost = Math.round(trip.totalBudget / count);

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.origin + `/trips/${trip.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDuplicateClick = async () => {
    setShowMenu(false);
    try {
      if (onDuplicate) {
        onDuplicate(trip.id);
      } else {
        await api.post(`/trips/${trip.id}/fork`);
        setDuplicateSuccess('Itinerary cloned as new draft template!');
        setTimeout(() => setDuplicateSuccess(''), 2500);
      }
    } catch (err) {
      alert('Failed to clone itinerary template.');
    }
  };

  const handleQuickAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setExpenseLoading(true);
    setExpenseSuccess('');

    try {
      await api.post('/expenses', {
        tripId: trip.id,
        category: expenseCategory,
        amount: expenseAmount,
        notes: expenseNotes || 'Direct dashboard expense entry',
      });
      setExpenseSuccess('Expense logged successfully!');
      setTimeout(() => {
        setShowQuickExpenseModal(false);
        setExpenseSuccess('');
        setExpenseNotes('');
      }, 1500);
    } catch (err) {
      alert('Failed to log expense. Please try again.');
    } finally {
      setExpenseLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111E2E] dark:hover:bg-[#162235] rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-[#1E2D42] overflow-hidden transition-all duration-300 group flex flex-col justify-between relative">
      <div>
        {/* Cover Photo */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#162235]">
          <img
            src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex items-center space-x-1.5">
            <StatusBadge status={trip.status} />

            {/* Quick Alert Warning Pill */}
            {isOverBudget && (
              <span className="px-2 py-0.5 bg-rose-600 text-white rounded-full text-[10px] font-black shadow-md flex items-center space-x-1 animate-pulse">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>Overbudget</span>
              </span>
            )}
            {isNearBudgetLimit && (
              <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black shadow-md flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>80%+ Budget Used</span>
              </span>
            )}
          </div>

          {/* Quick-Action Dropdown Menu (...) & Delete Buttons */}
          <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-20">
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition shadow-md"
                title="More Actions"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111E2E] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1E2D42] py-2 z-30 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowShareModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#162235] flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4 text-emerald-500" />
                    <span>Share & Collaborate</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowExportModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#162235] flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4 text-cyan-500" />
                    <span>Export PDF / Calendar</span>
                  </button>

                  <button
                    onClick={handleDuplicateClick}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#162235] flex items-center space-x-2 border-t border-slate-100 dark:border-[#1E2D42]"
                  >
                    <Copy className="w-4 h-4 text-amber-500" />
                    <span>Duplicate Itinerary</span>
                  </button>
                </div>
              )}
            </div>

            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(trip.id);
                }}
                aria-label={`Delete trip ${trip.title}`}
                className="p-2 bg-black/60 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition"
                title="Delete Trip"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content & Metrics */}
        <div className="p-5 space-y-3">
          {duplicateSuccess && (
            <div className="p-2 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-extrabold rounded-xl flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{duplicateSuccess}</span>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition-colors">
              {trip.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {trip.description || 'Customized multi-city travel itinerary.'}
            </p>
          </div>

          {/* Interactive Multi-City Route Preview Snippet */}
          {routeNames.length > 0 && (
            <div className="p-2 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] font-bold text-emerald-900 dark:text-emerald-300 space-y-1">
              <div className="flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">
                  {routeNames.join(' ➔ ')}
                </span>
              </div>
              {routeNames.length > 1 && (
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Est. Transit: ~3h 45m drive / train between stops</span>
                </div>
              )}
            </div>
          )}

          {/* Tarzan-Style Structured Itinerary Breakdown Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {stayCount > 0 && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold rounded-lg border border-indigo-200 dark:border-indigo-800">
                <Hotel className="w-3 h-3 text-indigo-500" />
                <span>{stayCount} Stay{stayCount !== 1 ? 's' : ''}</span>
              </span>
            )}

            {transportCount > 0 && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold rounded-lg border border-blue-200 dark:border-blue-800">
                <Navigation className="w-3 h-3 text-blue-500" />
                <span>{transportCount} Transfer{transportCount !== 1 ? 's' : ''}</span>
              </span>
            )}

            {activityCount > 0 && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Ticket className="w-3 h-3 text-emerald-500" />
                <span>{activityCount} Activit{activityCount !== 1 ? 'ies' : 'y'}</span>
              </span>
            )}

            {mealCount > 0 && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold rounded-lg border border-amber-200 dark:border-amber-800">
                <Utensils className="w-3 h-3 text-amber-500" />
                <span>{mealCount} Meal{mealCount !== 1 ? 's' : ''}</span>
              </span>
            )}
          </div>

          {/* Card Metrics with Interactive Pax Multiplier & Direct "+ Log Expense" Quick Trigger */}
          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2.5 border-t border-slate-100 dark:border-[#1E2D42]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold">{formattedStart} - {formattedEnd}</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {destinationCount} City Stop{destinationCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Per-Person vs Total Group Pricing Display with Direct "+ Log Expense" Trigger (Request 1 & 2) */}
            {trip.totalBudget > 0 && (
              <div className="bg-slate-100 dark:bg-[#16243A] p-2.5 rounded-xl border border-slate-200 dark:border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  {/* Interactive Pax Multiplier Selector (Request 1) */}
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                    <select
                      value={travelerCount}
                      onChange={(e) => setTravelerCount(parseInt(e.target.value))}
                      className="bg-white dark:bg-[#111C2E] text-slate-900 dark:text-white text-xs font-black px-2.5 py-1 rounded-lg border border-slate-300 dark:border-[#1E293B] shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value={1} className="bg-white dark:bg-[#111C2E] text-slate-900 dark:text-white font-extrabold">Solo (1 Person)</option>
                      <option value={2} className="bg-white dark:bg-[#111C2E] text-slate-900 dark:text-white font-extrabold">Couple (2 People)</option>
                      <option value={4} className="bg-white dark:bg-[#111C2E] text-slate-900 dark:text-white font-extrabold">Group (4 People)</option>
                      <option value={6} className="bg-white dark:bg-[#111C2E] text-slate-900 dark:text-white font-extrabold">Family (6 People)</option>
                    </select>
                  </div>

                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    ₹{perPersonCost.toLocaleString('en-IN')} <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">/ person</span>
                  </span>
                </div>

                {/* Real-time Group Spend & Direct "+ Log Expense" Trigger (Request 2) */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-[#1E293B] pt-1.5">
                  <div className="flex items-center space-x-1">
                    <span>Total Group Budget ({count} pax):</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{trip.totalBudget.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Direct + Log Expense Quick Trigger Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowQuickExpenseModal(true);
                    }}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold shadow-xs transition"
                    title="Log an expense directly for this trip"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Log Expense</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#162235]/60 border-t border-slate-100 dark:border-[#1E2D42] flex items-center justify-between gap-2">
        <Link
          to={`/trips/${trip.id}`}
          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Open Itinerary</span>
        </Link>

        <Link
          to={`/trips/${trip.id}/budget`}
          className="px-3 py-1.5 bg-slate-200 dark:bg-[#1E2D42] hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1"
        >
          <PieChart className="w-3.5 h-3.5 text-emerald-500" />
          <span>Budget</span>
        </Link>
      </div>

      {/* Direct Quick "Add Expense" Modal Trigger (Request 2) */}
      {showQuickExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111E2E] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E2D42] space-y-4 relative">
            <button
              onClick={() => setShowQuickExpenseModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Quick Log Expense</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Log receipt directly for {trip.title}</p>
              </div>
            </div>

            {expenseSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{expenseSuccess}</span>
              </div>
            )}

            <form onSubmit={handleQuickAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Expense Category</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  step="1"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white font-semibold"
                  placeholder="2500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Notes / Description</label>
                <input
                  type="text"
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs text-slate-900 dark:text-white font-semibold"
                  placeholder="e.g. Hotel deposit, train ticket..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickExpenseModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#162235] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={expenseLoading}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {expenseLoading ? 'Saving...' : 'Log Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share & Collaborate Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111E2E] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E2D42] space-y-4 relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Share & Collaborate</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Invite friends or split travel expenses</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Public Share Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={window.location.origin + `/trips/${trip.id}`}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleShareCopy}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-sm whitespace-nowrap"
                  >
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export to PDF / Calendar Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111E2E] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E2D42] space-y-4 relative">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/60 rounded-xl text-cyan-600 dark:text-cyan-400">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Export Itinerary Voucher</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Download PDF or sync to calendar</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setShowExportModal(false);
                }}
                className="w-full p-3 bg-slate-50 dark:bg-[#162235] hover:bg-slate-100 dark:hover:bg-[#1E2D42] rounded-2xl border border-slate-200 dark:border-[#1E2D42] flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Download Offline Travel PDF Voucher</span>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>

              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(trip.title)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowExportModal(false)}
                className="w-full p-3 bg-slate-50 dark:bg-[#162235] hover:bg-slate-100 dark:hover:bg-[#1E2D42] rounded-2xl border border-slate-200 dark:border-[#1E2D42] flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-cyan-500" />
                  <span>Sync to Google Calendar</span>
                </div>
                <Eye className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
