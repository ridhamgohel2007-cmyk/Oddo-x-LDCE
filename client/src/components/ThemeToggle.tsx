import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Sun, Moon, Laptop, ChevronDown } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { mode, setMode, resolvedTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const modes: { key: ThemeMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'light', label: 'Light Mode', icon: Sun },
    { key: 'dark', label: 'Dark Mode', icon: Moon },
    { key: 'system', label: 'System Theme', icon: Laptop },
  ];

  const currentIcon = () => {
    if (mode === 'light') return <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 rotate-0 scale-100" />;
    if (mode === 'dark') return <Moon className="w-4 h-4 text-emerald-400 transition-transform duration-300 rotate-0 scale-100 fill-emerald-400/20" />;
    return <Laptop className="w-4 h-4 text-emerald-500 transition-transform duration-300 scale-100" />;
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label={`Current theme: ${mode}. Click to change theme.`}
        className="flex items-center space-x-1.5 p-2 rounded-xl bg-white dark:bg-[#111E2E] hover:bg-slate-100 dark:hover:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-300"
      >
        <span className="flex items-center justify-center w-5 h-5">
          {currentIcon()}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400 transition-transform duration-200" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-[#111E2E] border border-slate-200 dark:border-[#1E2D42] shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
            Select Theme Mode
          </div>
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.key;
            return (
              <button
                key={m.key}
                onClick={() => {
                  setMode(m.key);
                  setDropdownOpen(false);
                }}
                aria-label={`Switch to ${m.label}`}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162235]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span>{m.label}</span>
                {isSelected && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
