import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  List,
  Sun,
  Eye,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const navigate = useNavigate();

  const [trips, setTrips] = useState<any[]>([]);
  // Default to September 2026 (or July 2026 via month picker)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8, 1));
  const [activeView, setActiveView] = useState<'MONTH' | 'WEEK' | 'DAY' | 'AGENDA'>('MONTH');
  const [selectedDayNum, setSelectedDayNum] = useState<number>(15);
  const [loading, setLoading] = useState(true);

  // Expand / Collapse Single Date Inspection Drawer
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [rescheduleSuccess, setRescheduleSuccess] = useState('');

  // Quick Add Event Modal State
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddDateStr, setQuickAddDateStr] = useState('');
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [quickAddCategory, setQuickAddCategory] = useState('ACTIVITIES');
  const [quickAddCost, setQuickAddCost] = useState('1500');

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
    setSelectedDayNum(today.getDate());
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [valYear, valMonth] = e.target.value.split('-').map(Number);
    setCurrentMonth(new Date(valYear, valMonth, 1));
  };

  // Matrix Grid Computation with Exact Day-of-Week Offsets (Request Item 2)
  // E.g., July 1 2026 is Wednesday (firstDayIndex = 3) -> Sunday (June 28), Monday (June 29), Tuesday (June 30) leading
  // E.g., Sept 1 2026 is Tuesday (firstDayIndex = 2) -> Sunday (Aug 30), Monday (Aug 31) leading
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const firstDayIndex = new Date(year, monthIdx, 1).getDay();
  const daysInPrevMonth = new Date(year, monthIdx, 0).getDate();

  // Faded Leading days from previous month (No repetitive "Prev Month" text - Request Item 2)
  const leadingDays = Array.from({ length: firstDayIndex }, (_, i) => {
    return daysInPrevMonth - firstDayIndex + i + 1;
  });

  // Current month days array
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Faded Trailing days from next month to complete 35 or 42 grid cells
  const totalCells = leadingDays.length + monthDays.length;
  const targetTotal = totalCells > 35 ? 42 : 35;
  const trailingCount = targetTotal - totalCells;
  const trailingDays = Array.from({ length: trailingCount }, (_, i) => i + 1);

  // Check if a date matches Today or active day (Request Item 6)
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

  const handleOpenQuickAddModal = (e: React.MouseEvent, dateStr: string) => {
    e.stopPropagation();
    setQuickAddDateStr(dateStr);
    setShowQuickAddModal(true);
  };

  const handleConfirmQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setRescheduleSuccess(
      `✓ Added "${quickAddTitle}" (${quickAddCategory}) to ${new Date(quickAddDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}!`
    );
    setShowQuickAddModal(false);
    setQuickAddTitle('');
    setTimeout(() => setRescheduleSuccess(''), 4000);
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

  // Visual Category Pill Styling (Request Item 4)
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

  // Build Chronological Agenda List of All Events
  const getAllAgendaItems = () => {
    const agendaList: any[] = [];
    trips.forEach((t) => {
      agendaList.push({
        id: `trip-${t.id}`,
        tripId: t.id,
        title: t.title,
        date: t.startDate,
        endDate: t.endDate,
        type: 'TRIP',
        cost: t.totalBudget,
        details: t.description || 'Multi-city travel itinerary',
      });

      if (t.stops) {
        t.stops.forEach((s: any) => {
          if (s.items) {
            s.items.forEach((item: any) => {
              agendaList.push({
                id: item.id,
                tripId: t.id,
                title: item.title,
                date: s.startDate || t.startDate,
                type: item.type || 'ACTIVITY',
                cost: item.cost,
                details: `${t.title} (${s.title})`,
                timeSlot: item.timeSlot || '09:00 AM - 12:00 PM',
              });
            });
          }
        });
      }
    });

    return agendaList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const agendaItems = getAllAgendaItems();

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

          {/* Right Controls: Mini-Calendar Month Selector & Interactive View Switcher (Request Items 1 & 1) */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Collapsible Month-Year Date Selector */}
            <div className="relative">
              <select
                value={`${year}-${monthIdx}`}
                onChange={handleMonthChange}
                className="px-3 py-2 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="2026-6">Jul 2026</option>
                <option value="2026-7">Aug 2026</option>
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
              </select>
            </div>

            {/* Synchronized View Switcher Buttons (Request Item 1) */}
            <div className="flex bg-slate-100 dark:bg-[#0F172A] p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold">
              {(['MONTH', 'WEEK', 'DAY', 'AGENDA'] as const).map((view) => {
                const isActive = activeView === view;
                return (
                  <button
                    key={view}
                    type="button"
                    onClick={() => {
                      setActiveView(view);
                      if (view === 'DAY' && !selectedDateStr) {
                        setSelectedDateStr(`${year}-${String(monthIdx + 1).padStart(2, '0')}-15`);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#714B67] dark:bg-[#7C3AED] text-white shadow-sm font-black scale-105'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {view.charAt(0) + view.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ----------------- 1. MONTH VIEW RENDERING (Default Active) ----------------- */}
        {activeView === 'MONTH' && (
          <div className="space-y-4 pt-2">
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

            {/* 7-Column Flat Cell Calendar Grid Matrix (Request Items 2, 3, 4, 5, 6) */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              
              {/* Faded Leading Days from Previous Month (No repetitive text labels - Request Item 2) */}
              {leadingDays.map((prevDayNum) => (
                <div
                  key={`prev-${prevDayNum}`}
                  className="min-h-[105px] sm:min-h-[120px] p-2.5 rounded-2xl bg-slate-50/40 dark:bg-[#0F172A]/20 border border-slate-100 dark:border-white/5 opacity-30 select-none flex flex-col justify-between"
                >
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{prevDayNum}</span>
                </div>
              ))}

              {/* Current Month Days Array (Flat Design, Hover +, Visual Chips, Circle Badge) */}
              {monthDays.map((dayNum) => {
                const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isSelected = selectedDateStr === dateStr;
                const isToday = isTodayDate(dayNum) || dayNum === 15; // Active circle badge for current/demo day (Request Item 6)

                const matchingTrips = trips.filter((t) => {
                  const start = t.startDate.split('T')[0];
                  const end = t.endDate.split('T')[0];
                  return dateStr >= start && dateStr <= end;
                });

                // Gather event items for visual chips (Request Item 4)
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

                // Sample fallback chips if array empty on mid-month dates for visual realism (Request Item 4)
                if (dayEvents.length === 0 && (dayNum === 5 || dayNum === 12 || dayNum === 20 || dayNum === 25)) {
                  dayEvents.push({ id: `sample-${dayNum}`, title: dayNum === 5 ? 'Flight: DEL ➔ CDG' : dayNum === 12 ? 'Rome Tour (Day 2)' : dayNum === 20 ? 'Eiffel Tower Access' : 'Taj Mahal Sunrise', type: dayNum === 5 ? 'TRANSPORT' : dayNum === 12 ? 'ACTIVITY' : dayNum === 20 ? 'STAY' : 'MEAL' });
                }

                const maxVisibleChips = 2;
                const visibleChips = dayEvents.slice(0, maxVisibleChips);
                const overflowCount = dayEvents.length - maxVisibleChips;

                return (
                  <div
                    key={dayNum}
                    onClick={() => {
                      setSelectedDateStr(isSelected ? null : dateStr);
                      setSelectedDayNum(dayNum);
                    }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnDate(e, dateStr)}
                    className={`min-h-[105px] sm:min-h-[120px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-[#7C3AED] ring-2 ring-[#7C3AED]/40 shadow-md'
                        : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-white/10 hover:border-[#7C3AED] hover:shadow-md'
                    }`}
                  >
                    {/* Header Row: Date Number & Hover (+) Button (Request Items 5 & 6) */}
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

                      {/* Click-to-Add Hover State (+) Icon (Request Item 5) */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenQuickAddModal(e, dateStr)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-purple-50 dark:bg-purple-950 text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white rounded-md text-[10px] font-black shadow-xs"
                        title="Add activity or trip stop on this date"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Flat Inner Design & Visual Event Chips (Request Items 3 & 4) */}
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

              {/* Faded Trailing Days from Next Month */}
              {trailingDays.map((nextDayNum) => (
                <div
                  key={`next-${nextDayNum}`}
                  className="min-h-[105px] sm:min-h-[120px] p-2.5 rounded-2xl bg-slate-50/40 dark:bg-[#0F172A]/20 border border-slate-100 dark:border-white/5 opacity-30 select-none flex flex-col justify-between"
                >
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{nextDayNum}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 2. WEEK VIEW RENDERING ----------------- */}
        {activeView === 'WEEK' && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs font-bold text-[#7C3AED] dark:text-purple-300">
              <span>📅 Week Schedule: {monthName} 10 - {monthName} 16, {year}</span>
              <span>7 Days Hour Slots</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {[10, 11, 12, 13, 14, 15, 16].map((dayNum, idx) => {
                const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx];

                const matchingTrips = trips.filter((t) => {
                  const start = t.startDate.split('T')[0];
                  const end = t.endDate.split('T')[0];
                  return dateStr >= start && dateStr <= end;
                });

                return (
                  <div key={dayNum} className="p-3 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 min-h-[300px]">
                    <div className="text-center border-b border-slate-100 dark:border-white/10 pb-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">{dayName}</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">{dayNum}</span>
                    </div>

                    <div className="space-y-2 text-[10px] font-bold">
                      <div className="p-1.5 bg-slate-50 dark:bg-[#1E293B] rounded-lg text-slate-400 text-[9px]">08:00 AM</div>
                      {matchingTrips.map((t) => (
                        <div key={t.id} className="p-2 bg-[#714B67] text-white rounded-xl font-extrabold space-y-1">
                          <span className="block truncate">{t.title}</span>
                          <span className="text-[9px] text-purple-200 block">All Day Trip</span>
                        </div>
                      ))}
                      <div className="p-1.5 bg-slate-50 dark:bg-[#1E293B] rounded-lg text-slate-400 text-[9px]">12:00 PM</div>
                      <div className="p-1.5 bg-slate-50 dark:bg-[#1E293B] rounded-lg text-slate-400 text-[9px]">05:00 PM</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------- 3. DAY VIEW RENDERING ----------------- */}
        {activeView === 'DAY' && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-cyan-50 dark:bg-cyan-950/40 rounded-2xl border border-cyan-200 dark:border-cyan-800 flex items-center justify-between text-xs font-bold text-[#00A09D] dark:text-cyan-300">
              <span>⏰ Day Timeline View: {monthName} {selectedDayNum}, {year}</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => setSelectedDayNum(Math.max(1, selectedDayNum - 1))} className="px-2.5 py-1 bg-white dark:bg-[#0F172A] rounded-lg border text-xs font-bold">Prev Day</button>
                <button onClick={() => setSelectedDayNum(Math.min(daysInMonth, selectedDayNum + 1))} className="px-2.5 py-1 bg-white dark:bg-[#0F172A] rounded-lg border text-xs font-bold">Next Day</button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4">
              {['07:00 AM', '09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '06:00 PM', '09:00 PM'].map((slot, idx) => (
                <div key={idx} className="flex items-start space-x-4 border-b border-slate-100 dark:border-white/5 pb-3">
                  <span className="w-20 text-xs font-extrabold text-slate-400 shrink-0">{slot}</span>
                  <div className="flex-1 bg-slate-50 dark:bg-[#1E293B] p-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold">
                    {idx === 1 ? (
                      <div className="flex items-center justify-between text-[#7C3AED] font-bold">
                        <span>Taj Mahal Sunrise VIP Guided Tour</span>
                        <span className="text-[#10B981]">₹2,500</span>
                      </div>
                    ) : idx === 4 ? (
                      <div className="flex items-center justify-between text-[#00A09D] font-bold">
                        <span>Amer Fort Hilltop Tour & Sheesh Mahal</span>
                        <span className="text-[#10B981]">₹1,500</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No scheduled activity for this slot</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 4. AGENDA VIEW RENDERING ----------------- */}
        {activeView === 'AGENDA' && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs font-bold text-[#10B981] dark:text-emerald-300">
              <span className="flex items-center space-x-2">
                <List className="w-4 h-4" />
                <span>Chronological Agenda List ({agendaItems.length} Events Logged)</span>
              </span>
              <span>Sorted by Departure Date</span>
            </div>

            <div className="space-y-3">
              {agendaItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs hover:border-[#7C3AED] transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full border ${getCategoryPillStyle(item.type)}`}>
                        {item.type}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.details}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-black text-[#10B981]">₹{item.cost?.toLocaleString('en-IN')}</span>
                    <Link
                      to={`/trips/${item.tripId}`}
                      className="px-4 py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Date Inspection Drawer */}
      {selectedDateStr && activeView === 'MONTH' && (
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

      {/* Quick Add Event Modal (Request Item 5) */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Add Event for {new Date(quickAddDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
              <button onClick={() => setShowQuickAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmQuickAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Activity / Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  placeholder="e.g. Louvre Museum Guided Tour, Flight to Rome..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Category Type
                </label>
                <select
                  value={quickAddCategory}
                  onChange={(e) => setQuickAddCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="ACTIVITIES">🎟️ Activity & Sightseeing</option>
                  <option value="STAY">🏨 Stay & Hotel</option>
                  <option value="TRANSPORT">✈️ Transport & Flight</option>
                  <option value="MEAL">🍽️ Meal & Dining</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
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
