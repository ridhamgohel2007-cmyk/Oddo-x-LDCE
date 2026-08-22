import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, ArrowRight, Trash2, Edit3, Eye, PieChart } from 'lucide-react';
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

          {/* Explicit Quick Actions Bar */}
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

          {/* Granular Card Metrics */}
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-[#1E2D42]">
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
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>${trip.totalBudget.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Action Triggers Footer */}
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
