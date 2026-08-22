import React from 'react';
import { MapPin, Star, Plus } from 'lucide-react';

export interface CityData {
  id: string;
  name: string;
  country: string;
  region: string;
  imageUrl: string;
  description: string;
  costIndex: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  popularityScore: number;
}

interface CityCardProps {
  city: CityData;
  onSelect?: (city: CityData) => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, onSelect }) => {
  const getCostBadge = (cost: string) => {
    switch (cost) {
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">$ Low Cost</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">$$$ Luxury</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">$$ Moderate</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-[#111E2E] dark:hover:bg-[#162235] rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-[#1E2D42] overflow-hidden transition-all duration-300 group flex flex-col justify-between">
      <div>
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-[#162235]">
          <img
            src={city.imageUrl}
            alt={city.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex space-x-1.5">
            {getCostBadge(city.costIndex)}
          </div>
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded-full text-xs font-extrabold backdrop-blur-md flex items-center space-x-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{city.popularityScore}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>{city.country} • {city.region}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{city.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{city.description}</p>
        </div>
      </div>

      {onSelect && (
        <div className="p-4 pt-0">
          <button
            onClick={() => onSelect(city)}
            aria-label={`Add ${city.name} to trip`}
            className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-500 text-emerald-700 dark:text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Trip</span>
          </button>
        </div>
      )}
    </div>
  );
};
