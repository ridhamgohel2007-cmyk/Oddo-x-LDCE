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
  ArrowRight,
  Edit,
  ExternalLink,
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
  currencyMode?: 'INR' | 'USD';
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete, onDuplicate, currencyMode = 'INR' }) => {
  const [travelerCount, setTravelerCount] = useState<number>(2); // Default couple (2 people)
  const [showMenu, setShowMenu] = useState(false);

  // Modal Action States
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showQuickExpenseModal, setShowQuickExpenseModal] = useState(false);

  // Quick Expense Form State
  const [expenseCategory, setExpenseCategory] = useState('STAY');
  const [expenseAmount, setExpenseAmount] = useState('2500');
  const [expenseNotes, setExpenseNotes] = useState('');
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [expenseSuccess, setExpenseSuccess] = useState('');

  const [copiedLink, setCopiedLink] = useState(false);
  const [duplicateSuccess, setDuplicateSuccess] = useState('');

  const formatMoney = (val: number) => {
    if (currencyMode === 'USD') {
      const usdVal = Math.round(val / 83);
      return `$${usdVal.toLocaleString('en-US')}`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

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

  // Calculate Days Until Departure Countdown
  const startMs = new Date(trip.startDate).getTime();
  const nowMs = new Date().getTime();
  const diffDays = Math.ceil((startMs - nowMs) / (1000 * 60 * 60 * 24));

  let countdownTextStr = '';
  if (trip.status === 'ONGOING') {
    countdownTextStr = 'Active Journey';
  } else if (trip.status === 'COMPLETED') {
    countdownTextStr = 'Completed';
  } else if (diffDays > 0) {
    countdownTextStr = `Starts in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else if (diffDays === 0) {
    countdownTextStr = 'Starts Today!';
  } else {
    countdownTextStr = 'Upcoming';
  }

  // Compute Multi-City Route String & Transit Time Estimates
  let routeNames: string[] = [];
  if (trip.stops && trip.stops.length > 0) {
    routeNames = trip.stops.map((s: any) => s.city?.name || s.title.replace('Stop: ', ''));
  }

  // Calculate Itinerary Breakdown & Completeness
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

  // Booking Completeness Percentage Calculation
  const completeness = Math.min(100, Math.round(
    (destinationCount > 0 ? 30 : 0) +
    (stayCount > 0 ? 30 : 0) +
    (transportCount > 0 ? 20 : 0) +
    (activityCount > 0 ? 20 : 0)
  ));

  // Quick Alert Warning Pill
  const spentRatio = trip.totalBudget > 0 ? totalRecordedSpent / trip.totalBudget : 0;
  const isOverBudget = spentRatio >= 1.0;
  const isNearBudgetLimit = spentRatio >= 0.8 && !isOverBudget;

  // Interactive Pax Multiplier Real-Time Math
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
      const numericAmount = parseFloat(expenseAmount) || 0;
      const amountInINR = currencyMode === 'USD' ? numericAmount * 83 : numericAmount;

      await api.post('/expenses', {
        tripId: trip.id,
        category: expenseCategory,
        amount: amountInINR,
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
    <div className="bg-white dark:bg-[#1E293B] dark:hover:bg-[#334155] rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden transition-all duration-300 group flex flex-col justify-between relative">
      <div>
        {/* Cover Photo */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#0F172A]">
          <img
            src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            <StatusBadge status={trip.status} />

            {/* Countdown Badge Indicator (Request Item 7) */}
            <span className="px-2.5 py-0.5 bg-black/60 text-[#38BDF8] rounded-full text-[10px] font-extrabold backdrop-blur-md border border-white/10 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#38BDF8] shrink-0" />
              <span>{countdownTextStr}</span>
            </span>

            {/* Quick Alert Warning Pill */}
            {isOverBudget && (
              <span className="px-2 py-0.5 bg-rose-600 text-white rounded-full text-[10px] font-black shadow-md flex items-center space-x-1 animate-pulse">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>Overbudget</span>
              </span>
            )}
            {isNearBudgetLimit && (
              <span className="px-2 py-0.5 bg-[#E2A03F] text-white rounded-full text-[10px] font-black shadow-md flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>80%+ Budget Used</span>
              </span>
            )}
          </div>

          {/* Quick-Action Dropdown Menu (...) & Actions (Request Item 6) */}
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
                title="Quick Actions Menu"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 py-2 z-30 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Link
                    to={`/trips/${trip.id}`}
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#0F172A] flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4 text-[#7C3AED]" />
                    <span>Edit Itinerary</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowShareModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#0F172A] flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4 text-[#00A09D]" />
                    <span>Share & Collaborate</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowExportModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#0F172A] flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4 text-[#06B6D4]" />
                    <span>Export PDF / CSV</span>
                  </button>

                  <button
                    onClick={handleDuplicateClick}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#0F172A] flex items-center space-x-2 border-t border-slate-100 dark:border-white/10"
                  >
                    <Copy className="w-4 h-4 text-[#E2A03F]" />
                    <span>Duplicate Itinerary</span>
                  </button>

                  {onDelete && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(trip.id);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center space-x-2 border-t border-slate-100 dark:border-white/10"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                      <span>Delete Trip</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(trip.id);
                }}
                className="p-2 bg-black/60 hover:bg-rose-600 text-white/80 hover:text-white rounded-full backdrop-blur-md transition shadow-md"
                title="Delete Trip"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-3">
          <div className="space-y-1">
            <Link
              to={`/trips/${trip.id}`}
              className="text-base font-extrabold text-slate-900 dark:text-white hover:text-[#7C3AED] dark:hover:text-[#38BDF8] transition line-clamp-1"
            >
              {trip.title}
            </Link>
            {trip.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {trip.description}
              </p>
            )}
          </div>

          {/* Multi-City Transit Route Pills */}
          {routeNames.length > 0 && (
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none text-[10px] font-bold text-[#00A09D] dark:text-[#38BDF8]">
              {routeNames.map((city, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-2 py-0.5 rounded-md bg-[#00A09D]/10 dark:bg-[#00A09D]/20 border border-[#00A09D]/30 whitespace-nowrap">
                    {city}
                  </span>
                  {idx < routeNames.length - 1 && <span className="text-slate-400 text-xs">➔</span>}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-1">
            <div className="flex items-center space-x-1 text-[11px] bg-slate-100 dark:bg-[#0F172A] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10">
              <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>{formattedStart} - {formattedEnd}</span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] bg-slate-100 dark:bg-[#0F172A] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10">
              <MapPin className="w-3.5 h-3.5 text-[#00A09D]" />
              <span>{destinationCount} {destinationCount === 1 ? 'City Stop' : 'City Stops'}</span>
            </div>
          </div>

          {/* Structured Itinerary Items Grid */}
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold pt-1">
            <div className="bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-300 p-1.5 rounded-lg border border-purple-200 dark:border-purple-800">
              <Hotel className="w-3 h-3 mx-auto mb-0.5 text-[#7C3AED]" />
              <span>{stayCount} {stayCount === 1 ? 'Stay' : 'Stays'}</span>
            </div>
            <div className="bg-cyan-50 dark:bg-cyan-950/40 text-[#00A09D] dark:text-cyan-300 p-1.5 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <Navigation className="w-3 h-3 mx-auto mb-0.5 text-[#00A09D]" />
              <span>{transportCount} {transportCount === 1 ? 'Transfer' : 'Transfers'}</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-300 p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <Ticket className="w-3 h-3 mx-auto mb-0.5 text-[#10B981]" />
              <span>{activityCount} {activityCount === 1 ? 'Activity' : 'Activities'}</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 text-[#E2A03F] dark:text-amber-300 p-1.5 rounded-lg border border-amber-200 dark:border-amber-800">
              <Utensils className="w-3 h-3 mx-auto mb-0.5 text-[#E2A03F]" />
              <span>{mealCount} {mealCount === 1 ? 'Meal' : 'Meals'}</span>
            </div>
          </div>

          {/* Booking Completeness Progress Indicator (Request Item 7) */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
              <span>Booking Completeness</span>
              <span className="text-[#10B981]">{completeness}% Ready</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#0F172A] h-1.5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
              <div
                className="bg-[#10B981] h-full rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          {duplicateSuccess && (
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold rounded-lg flex items-center space-x-1 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span>{duplicateSuccess}</span>
            </div>
          )}

          {/* Budget Summary & Pax Multiplier Controls */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-[#00A09D] shrink-0" />
                <select
                  value={travelerCount}
                  onChange={(e) => setTravelerCount(parseInt(e.target.value))}
                  className="bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#E2E8F0] text-xs font-black px-2 py-1 rounded-lg border border-slate-300 dark:border-white/10 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  <option value={1} className="bg-white dark:bg-[#0F172A]">Solo (1 Pax)</option>
                  <option value={2} className="bg-white dark:bg-[#0F172A]">Couple (2 Pax)</option>
                  <option value={4} className="bg-white dark:bg-[#0F172A]">Group (4 Pax)</option>
                  <option value={6} className="bg-white dark:bg-[#0F172A]">Family (6 Pax)</option>
                </select>
              </div>

              <span className="text-[11px] font-black text-[#10B981] whitespace-nowrap">
                {formatMoney(perPersonCost)} <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">/ person</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/10 pt-1.5">
              <div className="flex items-center space-x-1">
                <span>Total Group Budget ({count} pax):</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatMoney(trip.totalBudget)}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickExpenseModal(true);
                }}
                className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#714B67] hover:bg-[#613E57] text-white rounded-lg text-[10px] font-bold shadow-xs transition"
                title="Log an expense directly for this trip"
              >
                <Plus className="w-3 h-3" />
                <span>Log Expense</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-[#0F172A]/80 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
          Multi-City Plan
        </span>

        <Link
          to={`/trips/${trip.id}`}
          className="px-3.5 py-1.5 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1.5 group/btn"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-[#7C3AED]">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Share Itinerary</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Collaborate with fellow travelers</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-mono truncate mr-2">
                  {window.location.origin}/trips/{trip.id}
                </span>
                <button
                  type="button"
                  onClick={handleShareCopy}
                  className="px-3 py-1.5 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold shadow-xs transition shrink-0 flex items-center space-x-1"
                >
                  {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 relative">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-[#7C3AED]">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Export Travel Options</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Offline vouchers & budget summaries</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setShowExportModal(false);
                }}
                className="w-full p-3 bg-slate-50 dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#334155] rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white transition"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#7C3AED]" />
                  <span>Download Print / PDF Travel Voucher</span>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Log Expense Dialog */}
      {showQuickExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 relative">
            <button
              onClick={() => setShowQuickExpenseModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-[#7C3AED]">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Quick Log Expense</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Log expense for {trip.title}</p>
              </div>
            </div>

            {expenseSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>{expenseSuccess}</span>
              </div>
            )}

            <form onSubmit={handleQuickAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Amount ({currencyMode === 'USD' ? '$ USD' : '₹ INR'})
                </label>
                <input
                  type="number"
                  required
                  step="1"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                  placeholder={currencyMode === 'USD' ? '30' : '2500'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Category</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-[#E2E8F0]"
                >
                  <option value="STAY">🏨 Stay & Accommodation</option>
                  <option value="TRANSPORT">✈️ Transport & Transfers</option>
                  <option value="ACTIVITIES">🎟️ Activities & Sightseeing</option>
                  <option value="MEALS">🍽️ Meals & Dining</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold"
                  placeholder="e.g. Hotel deposit, Train ticket..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickExpenseModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={expenseLoading}
                  className="px-5 py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {expenseLoading ? 'Saving...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
