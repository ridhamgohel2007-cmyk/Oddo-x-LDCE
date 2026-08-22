import React from 'react';
import { Clock, DollarSign, Tag, Plus } from 'lucide-react';

export interface ActivityData {
  id: string;
  cityId: string;
  title: string;
  description: string;
  category: string;
  estimatedCost: number;
  durationHours: number;
  imageUrl: string;
  city?: any;
}

interface ActivityCardProps {
  activity: ActivityData;
  onAdd?: (activity: ActivityData) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onAdd }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between">
      <div>
        <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 bg-emerald-600/90 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
            {activity.category}
          </div>
          {activity.city && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
              {activity.city.name}
            </div>
          )}
        </div>

        <div className="p-4">
          <h4 className="text-base font-extrabold text-gray-900 dark:text-white line-clamp-1">{activity.title}</h4>
          <p className="text-xs font-medium text-gray-700 dark:text-slate-300 mt-1 line-clamp-2">{activity.description}</p>

          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-gray-800 dark:text-slate-200 pt-3 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{activity.durationHours} hrs</span>
            </div>
            <div className="flex items-center space-x-1 font-black text-emerald-700 dark:text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
              <span>${activity.estimatedCost}</span>
            </div>
          </div>
        </div>
      </div>

      {onAdd && (
        <div className="p-4 pt-0">
          <button
            onClick={() => onAdd(activity)}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      )}
    </div>
  );
};
