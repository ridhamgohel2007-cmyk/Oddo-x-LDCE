import React from 'react';
import { Clock, DollarSign, Plus } from 'lucide-react';

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
    <div className="bg-white dark:bg-[#111E2E] dark:hover:bg-[#162235] rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-[#1E2D42] overflow-hidden transition-all duration-300 group flex flex-col justify-between">
      <div>
        <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-[#162235]">
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-emerald-500/90 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
            {activity.category}
          </div>
          {activity.city && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
              {activity.city.name}
            </div>
          )}
        </div>

        <div className="p-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{activity.title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{activity.description}</p>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-[#1E2D42]">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>{activity.durationHours} hrs</span>
            </div>
            <div className="flex items-center space-x-1 font-black text-emerald-600 dark:text-emerald-400">
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
            aria-label={`Add activity ${activity.title}`}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      )}
    </div>
  );
};
