import React, { useState } from 'react';
import { MapPin, Plus, Star, Heart, Sun, Check } from 'lucide-react';

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
  isAdded?: boolean;
}

const FALLBACK_CITY_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

// Harmonized Season-Accurate "Best Time to Visit" Resolver (Request Item 1)
export const getBestTimeToVisit = (city: CityData): string => {
  const name = (city.name || '').toLowerCase();
  const country = (city.country || '').toLowerCase();
  const region = (city.region || '').toLowerCase();

  // Himalayan / High-altitude Hill stations
  if (
    name.includes('ladakh') || name.includes('leh') ||
    name.includes('manali') || name.includes('shimla') ||
    name.includes('srinagar') || name.includes('gangtok') ||
    name.includes('shillong') || name.includes('darjeeling')
  ) {
    return 'May–Sep (Summer & Autumn)';
  }

  // European Cities
  if (
    region.includes('europe') || country.includes('france') ||
    country.includes('italy') || country.includes('spain') ||
    country.includes('uk') || country.includes('united kingdom') ||
    country.includes('netherlands') || country.includes('switzerland') ||
    country.includes('greece')
  ) {
    return 'Apr–Oct (Spring & Summer)';
  }

  // Tropical / Coastal destinations
  if (
    name.includes('goa') || name.includes('kerala') ||
    name.includes('bali') || country.includes('indonesia') ||
    country.includes('mexico') || name.includes('cancun') ||
    country.includes('brazil') || name.includes('rio') ||
    country.includes('australia') || name.includes('sydney')
  ) {
    return 'Nov–Apr (Dry Season)';
  }

  // East Asia & North America
  if (
    country.includes('japan') || name.includes('tokyo') ||
    country.includes('usa') || country.includes('united states') ||
    country.includes('canada') || name.includes('vancouver')
  ) {
    return 'Sep–May (Cherry Blossom / Autumn)';
  }

  // Default for Indian Plains & Heritage (Agra, Jaipur, Delhi, Varanasi, Ahmedabad, Amritsar, Udaipur)
  return 'Oct–Mar (Pleasant Winter)';
};

export const CityCard: React.FC<CityCardProps> = ({ city, onSelect, isAdded = false }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imageSrc, setImageSrc] = useState(city.imageUrl || FALLBACK_CITY_IMAGE);

  const bestTimeStr = getBestTimeToVisit(city);

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

  const handleSelectClick = () => {
    setJustAdded(true);
    if (onSelect) onSelect(city);
    setTimeout(() => setJustAdded(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] dark:hover:bg-[#334155] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group">
      <div className="flex flex-col flex-1">
        {/* Aspect Ratio 16/9 Image Container with Fallback & Hover Zoom */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-[#0F172A] shrink-0">
          <img
            src={imageSrc}
            alt={city.name}
            onError={() => setImageSrc(FALLBACK_CITY_IMAGE)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex items-center space-x-1">
            {getCostBadge(city.costIndex)}
          </div>
          
          {/* Wishlist Heart & Rating Star Badge */}
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

        {/* Content Container */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                {city.name}
              </h4>
              <span className="text-xs font-bold text-[#00A09D] dark:text-[#38BDF8] shrink-0 ml-2">{city.region}</span>
            </div>

            <div className="flex items-center space-x-1 text-xs text-[#10B981] font-bold">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#00A09D]" />
              <span>{city.country}</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {city.description}
            </p>
          </div>

          {/* Harmonized Season-Accurate "Best Time to Visit" Tag (Request 1) */}
          <div className="flex items-center space-x-1.5 pt-1 text-[10px] font-extrabold text-[#00A09D] dark:text-[#38BDF8]">
            <Sun className="w-3.5 h-3.5 text-[#E2A03F] shrink-0" />
            <span>Best Time: {bestTimeStr}</span>
          </div>
        </div>
      </div>

      {/* Card Action Footer Button with Active Feedback State (Request 6) */}
      <div className="px-4 py-3 pb-4 bg-slate-50 dark:bg-[#0F172A]/80 border-t border-slate-100 dark:border-white/10 flex items-center justify-between mt-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Multi-City Stop</span>
        {onSelect && (
          <button
            onClick={handleSelectClick}
            aria-label={`Add ${city.name} to trip`}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition-all duration-200 flex items-center space-x-1.5 shrink-0 ${
              justAdded || isAdded
                ? 'bg-[#10B981] text-white shadow-emerald-500/30 scale-105'
                : 'bg-[#714B67] hover:bg-[#613E57] text-white hover:-translate-y-0.5'
            }`}
          >
            {justAdded || isAdded ? <Check className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{justAdded || isAdded ? 'Added ✓' : 'Add Destination'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
