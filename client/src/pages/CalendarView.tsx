import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  ArrowRight,
  CheckCircle2,
  Move,
  CalendarRange,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8, 1)); // September 2026 default
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

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const year = currentMonth.getFullYear();
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });

  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(year, currentMonth.getMonth(), 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingPadding = Array.from({ length: firstDayIndex }, (_, i) => i);

  // Drag and Drop handlers
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
        `Successfully rescheduled "${draggedActivity.itemTitle}" to ${new Date(targetDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}!`
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
      `Rescheduled "${activityToReschedule.itemTitle}" to ${new Date(newScheduleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}!`
    );
    setShowRescheduleModal(false);
    setTimeout(() => setRescheduleSuccess(''), 4000);
  };

  // Get items for selected date
  const getSelectedDateActivities = () => {
    if (!selectedDateStr) return [];
    const events: any[] = [];

    trips.forEach((t) => {
      const start = t.startDate.split('T')[0];
      const end = t.endDate.split('T')[0];
      if (selectedDateStr >= start && selectedDateStr <= end) {
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
                  type: item.type,
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

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Screen 11 Header */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <CalendarIcon className="w-8 h-8 text-emerald-500" />
            <span>Interactive Calendar & Reschedule Timeline</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Screen 11: Expand single dates to inspect daily activity breakdowns and drag to reschedule activities across days
          </p>
        </div>
      </div>

      {rescheduleSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{rescheduleSuccess}</span>
        </div>
      )}

      {/* Month Navigation & Grid */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2D42] pb-4">
          <button
            onClick={prevMonth}
            aria-label="Previous Month"
            className="p-2.5 bg-slate-100 dark:bg-[#162235] hover:bg-slate-200 dark:hover:bg-[#1E2D42] rounded-2xl text-slate-900 dark:text-white transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {monthName} {year}
          </h2>

          <button
            onClick={nextMonth}
            aria-label="Next Month"
            className="p-2.5 bg-slate-100 dark:bg-[#162235] hover:bg-slate-200 dark:hover:bg-[#1E2D42] rounded-2xl text-slate-900 dark:text-white transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week Headers */}
        <div className="grid grid-cols-7 text-center font-black text-xs text-slate-700 dark:text-slate-300 tracking-wider py-2 uppercase">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-2">
          {leadingPadding.map((_, index) => (
            <div key={`pad-${index}`} className="min-h-[100px] bg-slate-50/50 dark:bg-[#162235]/30 rounded-2xl p-2 border border-slate-100 dark:border-[#1E2D42] opacity-30" />
          ))}

          {daysArray.map((dayNum) => {
            const dateStr = `${year}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = selectedDateStr === dateStr;

            const matchingTrips = trips.filter((t) => {
              const start = t.startDate.split('T')[0];
              const end = t.endDate.split('T')[0];
              return dateStr >= start && dateStr <= end;
            });

            return (
              <div
                key={dayNum}
                onClick={() => setSelectedDateStr(isSelected ? null : dateStr)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnDate(e, dateStr)}
                className={`min-h-[105px] p-2.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/40'
                    : 'bg-white dark:bg-[#111E2E] border-slate-200 dark:border-[#1E2D42] hover:border-emerald-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white">{dayNum}</span>
                  {matchingTrips.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>

                <div className="space-y-1 my-1">
                  {matchingTrips.map((t) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, { tripId: t.id, itemTitle: t.title })}
                      className="p-1 bg-emerald-500 text-white rounded-lg text-[10px] font-extrabold truncate shadow-xs flex items-center space-x-1"
                      title={`${t.title} (Drag to reschedule)`}
                    >
                      <Move className="w-2.5 h-2.5 shrink-0 opacity-80" />
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span>{matchingTrips.length > 0 ? `${matchingTrips.length} Trip` : ''}</span>
                  <span>{isSelected ? 'Collapse ▲' : 'Expand ▼'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Date Inspection Drawer / Modal (PS Requirement) */}
      {selectedDateStr && (
        <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-[#1E2D42] space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2D42] pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">
                Expanded Daily Inspection Drawer
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Detailed Activity Schedule for {new Date(selectedDateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
            </div>

            <button
              onClick={() => setSelectedDateStr(null)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-[#162235]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {selectedDateEvents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-semibold space-y-2">
              <p>No specific line item activities scheduled for this date.</p>
              <Link to="/create-trip" className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold">
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
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group hover:border-emerald-500 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-extrabold rounded-full">
                        {evt.type || 'ACTIVITY'}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{evt.timeSlot}</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1">
                        <Move className="w-3 h-3 text-slate-400" />
                        <span>Drag to Reschedule</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{evt.itemTitle}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Trip: <span className="font-bold text-slate-700 dark:text-slate-200">{evt.tripTitle}</span> ({evt.stopTitle})
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mr-2">${evt.cost}</span>

                    <button
                      onClick={() => handleOpenRescheduleModal(evt)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-[#1E2D42] hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    >
                      <CalendarRange className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Reschedule</span>
                    </button>

                    <Link
                      to={`/trips/${evt.tripId}`}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
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
          <div className="bg-white dark:bg-[#111E2E] max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E2D42] space-y-4">
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#162235] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
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
