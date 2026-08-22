import React, { useState } from 'react';
import { MapPin, Plus, Star, Heart, Sun } from 'lucide-react';

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

const FALLBACK_CITY_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

export const CityCard: React.FC<CityCardProps> = ({ city, onSelect }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageSrc, setImageSrc] = useState(city.imageUrl || FALLBACK_CITY_IMAGE);

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
    <div className="bg-white dark:bg-[#1E293B] dark:hover:bg-[#334155] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-[#0F172A]">
          <img
            src={imageSrc}
            alt={city.name}
            onError={() => setImageSrc(FALLBACK_CITY_IMAGE)}
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
            <span className="text-xs font-bold text-[#00A09D] dark:text-[#38BDF8]">{city.region}</span>
          </div>

          <div className="flex items-center space-x-1 text-xs text-[#10B981] font-bold">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#00A09D]" />
            <span>{city.country}</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
            {city.description}
          </p>

          {/* Time to Visit Tag (Request 4) */}
          <div className="flex items-center space-x-1.5 pt-1 text-[10px] font-extrabold text-[#00A09D] dark:text-[#38BDF8]">
            <Sun className="w-3.5 h-3.5 text-[#E2A03F] shrink-0" />
            <span>Best Time to Visit: Oct–Mar</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-50 dark:bg-[#0F172A]/80 border-t border-slate-100 dark:border-white/10 flex justify-end">
        {onSelect && (
          <button
            onClick={() => onSelect(city)}
            aria-label={`Add ${city.name} to trip`}
            className="px-3.5 py-1.5 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Destination</span>
          </button>
        )}
      </div>
    </div>
  );
};
