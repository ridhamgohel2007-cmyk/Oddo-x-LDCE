import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Search } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8, 1)); // September 2026 default
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center space-x-3">
            <CalendarIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span>Calendar View / Timeline</span>
          </h1>
          <p className="text-xs font-medium text-gray-600 dark:text-slate-400 mt-1">Screen 11: Visual month grid showing scheduled travel dates and events</p>
        </div>
      </div>

      {/* Screen 11 Control Bar: Search bar, Group by, Filter, Sort by */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search bar......"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button className="px-3.5 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-extrabold text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-700 transition">Group by</button>
          <button className="px-3.5 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-extrabold text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-700 transition">Filter</button>
          <button className="px-3.5 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-extrabold text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-700 transition">Sort by...</button>
        </div>
      </div>

      {/* Wireframe Screen 11 Month Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-6">
        {/* Month Navigation Controls */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
          <button
            onClick={prevMonth}
            className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-2xl text-gray-900 dark:text-slate-100 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 dark:from-emerald-400 dark:via-teal-300 dark:to-white bg-clip-text text-transparent tracking-tight">
            {monthName} {year}
          </h2>

          <button
            onClick={nextMonth}
            className="p-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-2xl text-gray-900 dark:text-slate-100 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week Headers (SUM, MON, TUE, WED, THU, FRI, SAT as per Screen 11 wireframe) */}
        <div className="grid grid-cols-7 text-center font-black text-xs text-gray-800 dark:text-slate-200 tracking-wider py-2 uppercase">
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
          {/* Leading empty cells */}
          {leadingPadding.map((_, index) => (
            <div key={`pad-${index}`} className="min-h-[100px] bg-gray-50/50 dark:bg-slate-800/20 rounded-2xl p-2 border border-gray-100 dark:border-slate-800 opacity-40" />
          ))}

          {/* Days */}
          {daysArray.map((dayNum) => {
            const dateStr = `${year}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

            // Find trips that fall on this day
            const matchingTrips = trips.filter((t) => {
              const start = t.startDate.split('T')[0];
              const end = t.endDate.split('T')[0];
              return dateStr >= start && dateStr <= end;
            });

            return (
              <div
                key={dayNum}
                className="min-h-[100px] bg-white dark:bg-slate-900 rounded-2xl p-2 border border-gray-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400 transition flex flex-col justify-between"
              >
                <span className="text-xs font-black text-gray-900 dark:text-slate-100">{dayNum}</span>

                <div className="space-y-1 my-1">
                  {matchingTrips.map((t) => (
                    <Link
                      key={t.id}
                      to={`/trips/${t.id}`}
                      className="block p-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-[10px] font-extrabold truncate hover:from-emerald-700 hover:to-teal-700 transition shadow-sm"
                      title={t.title}
                    >
                      {t.title.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
