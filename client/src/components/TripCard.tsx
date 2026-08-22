import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trash2, Eye, PieChart, Hotel, Ticket, Utensils, Navigation } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

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
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete }) => {
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

  // Calculate Tarzan-style Structured Itinerary Breakdown Counts
  let stayCount = 0;
  let transportCount = 0;
  let activityCount = 0;
  let mealCount = 0;

  if (trip.stops) {
    trip.stops.forEach((stop: any) => {
      if (stop.items) {
        stop.items.forEach((item: any) => {
          const type = item.type?.toUpperCase();
          if (type === 'STAY') stayCount++;
          else if (type === 'TRANSPORT') transportCount++;
          else if (type === 'MEAL') mealCount++;
          else activityCount++;
        });
      }
    });
  }

  // Fallback defaults if trip items aren't populated yet
  if (stayCount === 0 && transportCount === 0 && activityCount === 0 && mealCount === 0) {
    stayCount = Math.max(1, destinationCount);
    transportCount = Math.max(1, destinationCount);
    activityCount = Math.max(3, destinationCount * 2);
  }

  return (
    <div className="bg-white dark:bg-[#111E2E] dark:hover:bg-[#162235] rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-[#1E2D42] overflow-hidden transition-all duration-300 group flex flex-col justify-between">
      <div>
        {/* Cover Photo */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#162235]">
          <img
            src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <StatusBadge status={trip.status} />
          </div>

          {/* Quick Delete */}
          <div className="absolute top-3 right-3 flex items-center space-x-1.5">
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
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition-colors">
              {trip.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {trip.description || 'Customized multi-city travel itinerary.'}
            </p>
          </div>

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

          {/* Card Metrics with INR Currency Symbol */}
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2.5 border-t border-slate-100 dark:border-[#1E2D42]">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-semibold">{formattedStart} - {formattedEnd}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {destinationCount} City Stop{destinationCount !== 1 ? 's' : ''}
                </span>
              </div>
              {trip.totalBudget > 0 && (
                <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-extrabold">
                  <span>₹{trip.totalBudget.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
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
    </div>
  );
};
