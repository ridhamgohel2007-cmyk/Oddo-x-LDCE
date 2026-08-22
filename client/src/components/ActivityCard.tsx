import React from 'react';
import { Clock, Plus, Tag, MapPin } from 'lucide-react';

export interface ActivityData {
  id: string;
  title: string;
  description: string;
  category: string;
  durationHours: number;
  estimatedCost: number;
  imageUrl: string;
  city?: {
    name: string;
  };
}

interface ActivityCardProps {
  activity: ActivityData;
  onAdd?: (activity: ActivityData) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onAdd }) => {
  return (
    <div className="bg-white dark:bg-[#111E2E] rounded-2xl border border-slate-200 dark:border-[#1E2D42] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-[#162235]">
          <img
            src={activity.imageUrl || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80'}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 text-white rounded-full text-[10px] font-extrabold backdrop-blur-md">
            {activity.category}
          </span>
        </div>

        <div className="p-4 space-y-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition">
            {activity.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>

          {activity.city && (
            <div className="flex items-center space-x-1 text-xs text-slate-400 font-semibold pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{activity.city.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-50 dark:bg-[#162235]/60 border-t border-slate-100 dark:border-[#1E2D42] flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 font-semibold">
            <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{activity.durationHours} hrs</span>
          </div>
          <div className="font-black text-emerald-600 dark:text-emerald-400">
            <span>₹{activity.estimatedCost.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {onAdd && (
          <button
            onClick={() => onAdd(activity)}
            aria-label={`Add activity ${activity.title}`}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Trip</span>
          </button>
        )}
      </div>
    </div>
  );
};
