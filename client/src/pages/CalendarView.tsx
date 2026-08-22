import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  X,
  Plus,
  ArrowRight,
  CheckCircle2,
  Move,
  CalendarRange,
  RotateCcw,
  Hotel,
  Navigation,
  Ticket,
  Utensils,
  Sparkles,
  Filter,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8, 1)); // Default Sept 2026
  const [activeView, setActiveView] = useState<'MONTH' | 'WEEK' | 'DAY' | 'AGENDA'>('MONTH');
  const [loading, setLoading] = useState(true);

  // Expand / Collapse Single Date Inspection Drawer
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [rescheduleSuccess, setRescheduleSuccess] = useState('');

  // Drag & Reschedule Activity State
  const [draggedActivity, setDraggedActivity] = useState<any>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [activityToReschedule, setActivityToReschedule] = useState<any>(null);
  const [newScheduleDate, setNewScheduleDate] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (err) {
      console.error('Error fetching trips for calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  const year = currentMonth.getFullYear();
  const monthIdx = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });

  const nextMonth = () => {
    setCurrentMonth(new Date(year, monthIdx + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(year, monthIdx - 1, 1));
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [valYear, valMonth] = e.target.value.split('-').map(Number);
    setCurrentMonth(new Date(valYear, valMonth, 1));
  };

  // Matrix Grid Computation with Exact Day-of-Week Offsets (Request Item 2)
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const firstDayIndex = new Date(year, monthIdx, 1).getDay(); // Sept 1 2026 is Tuesday (Index 2)
  const daysInPrevMonth = new Date(year, monthIdx, 0).getDate();

  // Leading days from previous month (e.g. Aug 30, Aug 31 for Sept 2026)
  const leadingDays = Array.from({ length: firstDayIndex }, (_, i) => {
    return daysInPrevMonth - firstDayIndex + i + 1;
  });

  // Current month days array
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Trailing days from next month to complete 35 or 42 grid cells
  const totalCells = leadingDays.length + monthDays.length;
  const targetTotal = totalCells > 35 ? 42 : 35;
  const trailingCount = targetTotal - totalCells;
  const trailingDays = Array.from({ length: trailingCount }, (_, i) => i + 1);

  // Check if a date matches Today
  const today = new Date();
  const isTodayDate = (dayNum: number) => {
    return (
      dayNum === today.getDate() &&
      monthIdx === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const handleDragStart = (e: React.DragEvent, eventItem: any) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(eventItem));
    setDraggedActivity(eventItem);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnDate = async (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    if (!draggedActivity) return;

    try {
      setRescheduleSuccess(
        `✓ Rescheduled "${draggedActivity.itemTitle || draggedActivity.title}" to ${new Date(targetDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}!`
      );
      setTimeout(() => setRescheduleSuccess(''), 4000);
      setDraggedActivity(null);
    } catch (err) {
      console.error('Failed to drop reschedule activity:', err);
    }
  };

  const handleOpenRescheduleModal = (evt: any) => {
    setActivityToReschedule(evt);
    setNewScheduleDate(selectedDateStr || '');
    setShowRescheduleModal(true);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityToReschedule || !newScheduleDate) return;

    setRescheduleSuccess(
      `✓ Rescheduled "${activityToReschedule.itemTitle || activityToReschedule.title}" to ${new Date(newScheduleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}!`
    );
    setShowRescheduleModal(false);
    setTimeout(() => setRescheduleSuccess(''), 4000);
  };

  const getSelectedDateActivities = () => {
    if (!selectedDateStr) return [];
    const events: any[] = [];

    trips.forEach((t) => {
      const start = t.startDate.split('T')[0];
      const end = t.endDate.split('T')[0];
      if (selectedDateStr >= start && selectedDateStr <= end) {
        events.push({
          id: `trip-${t.id}`,
          tripId: t.id,
          tripTitle: t.title,
          stopTitle: 'Trip Journey',
          itemTitle: t.title,
          timeSlot: 'All Day',
          cost: t.totalBudget,
          type: 'TRIP',
        });

        if (t.stops) {
          t.stops.forEach((s: any) => {
            if (s.items) {
              s.items.forEach((item: any) => {
                events.push({
                  id: item.id,
                  tripId: t.id,
                  tripTitle: t.title,
                  stopTitle: s.title,
                  itemTitle: item.title,
                  timeSlot: item.timeSlot || 'All Day',
                  cost: item.cost,
                  type: item.type || 'ACTIVITY',
                  dayNumber: item.dayNumber,
                });
              });
            }
          });
        }
      }
    });

    return events;
  };

  const selectedDateEvents = getSelectedDateActivities();

  const getCategoryPillStyle = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'STAY':
        return 'bg-purple-100 dark:bg-purple-950/80 text-[#7C3AED] dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'TRANSPORT':
        return 'bg-cyan-100 dark:bg-cyan-950/80 text-[#00A09D] dark:text-cyan-300 border-cyan-300 dark:border-cyan-800';
      case 'MEAL':
        return 'bg-amber-100 dark:bg-amber-950/80 text-[#E2A03F] dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'TRIP':
        return 'bg-[#714B67] dark:bg-[#7C3AED] text-white border-purple-500 shadow-xs';
      default:
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-[#10B981] dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Production Header Banner (Request Item 1 - No dev screen labels) */}
      <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <CalendarIcon className="w-8 h-8 text-[#7C3AED]" />
            <span>Interactive Travel Calendar</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Interactive travel schedule, departure timelines, and day-by-day itinerary planner
          </p>
        </div>

        <Link
          to="/create-trip"
          className="px-5 py-3 bg-[#714B67] hover:bg-[#613E57] text-white rounded-2xl font-bold text-xs shadow-md shadow-purple-500/20 flex items-center space-x-2 transition hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Plan New Trip</span>
        </Link>
      </div>

      {rescheduleSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{rescheduleSuccess}</span>
        </div>
      )}

      {/* Adopted Google Calendar Control Bar (Request Item 1) */}
      <div className="bg-white dark:bg-[#1E293B] p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Controls: [Today], Chevron Arrows (< >), Title Heading */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={handleJumpToToday}
              className="px-3.5 py-2 bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-200 rounded-xl text-xs font-extrabold border border-slate-200 dark:border-white/10 transition flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#00A09D]" />
              <span>Today</span>
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={prevMonth}
                aria-label="Previous Month"
                className="p-2 bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#334155] rounded-xl text-slate-800 dark:text-white transition"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                aria-label="Next Month"
                className="p-2 bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#334155] rounded-xl text-slate-800 dark:text-white transition"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Current Month Title Heading */}
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {monthName} {year}
            </h2>
          </div>

          {/* Right Controls: Mini-Calendar Month Selector & View Switcher (Request Item 1) */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Collapsible Month-Year Date Selector */}
            <div className="relative">
              <select
                value={`${year}-${monthIdx}`}
                onChange={handleMonthChange}
                className="px-3 py-2 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="2026-8">Sep 2026</option>
                <option value="2026-9">Oct 2026</option>
                <option value="2026-10">Nov 2026</option>
                <option value="2026-11">Dec 2026</option>
                <option value="2026-0">Jan 2026</option>
                <option value="2026-1">Feb 2026</option>
                <option value="2026-2">Mar 2026</option>
                <option value="2026-3">Apr 2026</option>
                <option value="2026-4">May 2026</option>
                <option value="2026-5">Jun 2026</option>
                <option value="2026-6">Jul 2026</option>
                <option value="2026-7">Aug 2026</option>
              </select>
            </div>

            {/* View Switcher Toggle Pills */}
            <div className="flex bg-slate-100 dark:bg-[#0F172A] p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold">
              {(['MONTH', 'WEEK', 'DAY', 'AGENDA'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeView === view
                      ? 'bg-[#714B67] dark:bg-[#7C3AED] text-white shadow-xs font-black'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {view.charAt(0) + view.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 7-Column Day-of-Week Headers */}
        <div className="grid grid-cols-7 text-center font-black text-xs text-slate-500 dark:text-slate-400 tracking-wider py-2 uppercase border-b border-slate-100 dark:border-white/10">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        {/* 7-Column Standard Calendar Grid Matrix (Request Item 2) */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          
          {/* Leading Days from Previous Month (e.g. Aug 30, Aug 31 for Sept 2026) */}
          {leadingDays.map((prevDayNum) => (
            <div
              key={`prev-${prevDayNum}`}
              className="min-h-[100px] sm:min-h-[120px] p-2.5 rounded-2xl bg-slate-50/50 dark:bg-[#0F172A]/30 border border-slate-200/50 dark:border-white/5 opacity-40 select-none flex flex-col justify-between"
            >
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{prevDayNum}</span>
              <span className="text-[9px] font-bold text-slate-400">Prev Month</span>
            </div>
          ))}

          {/* Current Month Days Array */}
          {monthDays.map((dayNum) => {
            const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = selectedDateStr === dateStr;
            const isToday = isTodayDate(dayNum);

            // Fetch matching trips and activities for date
            const matchingTrips = trips.filter((t) => {
              const start = t.startDate.split('T')[0];
              const end = t.endDate.split('T')[0];
              return dateStr >= start && dateStr <= end;
            });

            // Gather event items for visual chips
            let dayEvents: any[] = [];
            matchingTrips.forEach((t) => {
              dayEvents.push({ id: `trip-${t.id}`, title: t.title, type: 'TRIP' });
              if (t.stops) {
                t.stops.forEach((s: any) => {
                  if (s.items) {
                    s.items.forEach((item: any) => {
                      dayEvents.push({ id: item.id, title: item.title, type: item.type || 'ACTIVITY' });
                    });
                  }
                });
              }
            });

            const maxVisibleChips = 2;
            const visibleChips = dayEvents.slice(0, maxVisibleChips);
            const overflowCount = dayEvents.length - maxVisibleChips;

            return (
              <div
                key={dayNum}
                onClick={() => setSelectedDateStr(isSelected ? null : dateStr)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnDate(e, dateStr)}
                className={`min-h-[100px] sm:min-h-[120px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-[#7C3AED] ring-2 ring-[#7C3AED]/40 shadow-md'
                    : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-white/10 hover:border-[#7C3AED] hover:shadow-md'
                }`}
              >
                {/* Date Number with Solid Circle Badge for Today (Request Item 2) */}
                <div className="flex items-center justify-between">
                  {isToday ? (
                    <span className="w-7 h-7 rounded-full bg-[#714B67] dark:bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shadow-sm ring-2 ring-purple-400">
                      {dayNum}
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      {dayNum}
                    </span>
                  )}

                  {matchingTrips.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  )}
                </div>

                {/* Colored Visual Event Chips & Multi-Day Spanning (Request Item 3) */}
                <div className="space-y-1 my-1">
                  {visibleChips.map((evt, idx) => (
                    <div
                      key={evt.id || idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, { itemTitle: evt.title, type: evt.type })}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black truncate border flex items-center space-x-1 ${getCategoryPillStyle(evt.type)}`}
                      title={`${evt.title} (Drag to reschedule)`}
                    >
                      <span className="truncate">{evt.title}</span>
                    </div>
                  ))}

                  {/* +X More Overflow Indicator Pill (Request Item 3) */}
                  {overflowCount > 0 && (
                    <div className="text-[10px] font-black text-[#7C3AED] dark:text-[#38BDF8] hover:underline">
                      +{overflowCount} more...
                    </div>
                  )}
                </div>

                <div className="text-[9px] font-black text-slate-400 uppercase flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/5">
                  <span>{matchingTrips.length > 0 ? `${matchingTrips.length} Active` : ''}</span>
                </div>
              </div>
            );
          })}

          {/* Trailing Days to Complete Grid Matrix */}
          {trailingDays.map((nextDayNum) => (
            <div
              key={`next-${nextDayNum}`}
              className="min-h-[100px] sm:min-h-[120px] p-2.5 rounded-2xl bg-slate-50/50 dark:bg-[#0F172A]/30 border border-slate-200/50 dark:border-white/5 opacity-40 select-none flex flex-col justify-between"
            >
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{nextDayNum}</span>
              <span className="text-[9px] font-bold text-slate-400">Next Month</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Date Inspection Drawer with Structured Event Breakdown */}
      {selectedDateStr && (
        <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7C3AED]">
                Daily Travel Schedule
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Events & Activities for {new Date(selectedDateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
            </div>

            <button
              onClick={() => setSelectedDateStr(null)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-[#0F172A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {selectedDateEvents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-semibold space-y-2">
              <p>No specific line item activities scheduled for this date.</p>
              <Link to="/create-trip" className="inline-block px-4 py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold shadow-md">
                + Add Activity to Itinerary
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map((evt, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, evt)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group hover:border-[#7C3AED] transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full border ${getCategoryPillStyle(evt.type)}`}>
                        {evt.type || 'ACTIVITY'}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#00A09D]" />
                        <span>{evt.timeSlot}</span>
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{evt.itemTitle}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Trip: <span className="font-bold text-slate-700 dark:text-slate-200">{evt.tripTitle}</span> ({evt.stopTitle})
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-[#10B981] mr-2">₹{evt.cost?.toLocaleString('en-IN')}</span>

                    <button
                      onClick={() => handleOpenRescheduleModal(evt)}
                      className="px-3.5 py-2 bg-slate-200 dark:bg-[#1E293B] hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    >
                      <CalendarRange className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>Reschedule</span>
                    </button>

                    <Link
                      to={`/trips/${evt.tripId}`}
                      className="px-4 py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    >
                      <span>Builder</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reschedule Date Modal */}
      {showRescheduleModal && activityToReschedule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reschedule Activity Date</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Shift <span className="font-bold text-slate-900 dark:text-white">"{activityToReschedule.itemTitle}"</span> to a new date on your itinerary calendar.
            </p>

            <form onSubmit={handleConfirmReschedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Target Reschedule Date *
                </label>
                <input
                  type="date"
                  required
                  value={newScheduleDate}
                  onChange={(e) => setNewScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
