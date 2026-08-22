import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, ArrowRight, Trash2 } from 'lucide-react';
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between">
      <div>
        {/* Cover Photo */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
          <img
            src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <StatusBadge status={trip.status} />
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete(trip.id);
              }}
              className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-900/80 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600 rounded-full backdrop-blur-md text-gray-600 dark:text-slate-300 transition"
              title="Delete Trip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {trip.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">
            {trip.description || 'Customized travel itinerary.'}
          </p>

          <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-slate-300">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{formattedStart} - {formattedEnd}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{destinationCount} Destination Stop{destinationCount !== 1 ? 's' : ''}</span>
            </div>
            {trip.totalBudget > 0 && (
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold text-gray-800 dark:text-slate-200">${trip.totalBudget.toLocaleString()} Budget</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer link actions */}
      <div className="px-5 py-3.5 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
        <Link
          to={`/trips/${trip.id}`}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 inline-flex items-center space-x-1"
        >
          <span>View Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to={`/trips/${trip.id}/budget`}
          className="text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
        >
          Budget Breakdown
        </Link>
      </div>
    </div>
  );
};
