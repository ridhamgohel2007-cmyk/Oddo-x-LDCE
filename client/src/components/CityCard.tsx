import React, { useState } from 'react';
import { MapPin, Plus, Star, Heart } from 'lucide-react';

export interface CityData {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  imageUrl: string;
  costIndex: string;
  popularityScore: number;
}

interface CityCardProps {
  city: CityData;
  onSelect?: (city: CityData) => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, onSelect }) => {
  const [isSaved, setIsSaved] = useState(false);

  const getCostBadge = (cost: string) => {
    switch (cost?.toUpperCase()) {
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">₹ Low Cost</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">₹₹₹ Luxury</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">₹₹ Moderate</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-[#111E2E] rounded-2xl border border-slate-200 dark:border-[#1E2D42] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-[#162235]">
          <img
            src={city.imageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'}
            alt={city.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex items-center space-x-1">
            {getCostBadge(city.costIndex)}
          </div>
          
          {/* Quick Heart / Save to Wishlist Icon Button */}
          <div className="absolute top-3 right-3 flex items-center space-x-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSaved(!isSaved);
              }}
              title={isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                isSaved
                  ? 'bg-rose-500 text-white scale-110 shadow-md'
                  : 'bg-black/40 hover:bg-black/60 text-white/80 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
            <div className="px-2 py-0.5 bg-black/60 text-amber-400 rounded-full text-[10px] font-extrabold backdrop-blur-md flex items-center space-x-1">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{city.popularityScore}</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
              {city.name}
            </h4>
            <span className="text-xs font-bold text-slate-400">{city.region}</span>
          </div>

          <div className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{city.country}</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
            {city.description}
          </p>
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-50 dark:bg-[#162235]/60 border-t border-slate-100 dark:border-[#1E2D42] flex justify-end">
        {onSelect && (
          <button
            onClick={() => onSelect(city)}
            aria-label={`Add ${city.name} to trip`}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Destination</span>
          </button>
        )}
      </div>
    </div>
  );
};
