import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#16243A] dark:text-slate-300 dark:border-[#1E293B]';

  const normalizedStatus = status?.toUpperCase() || 'UPCOMING';

  switch (normalizedStatus) {
    case 'ONGOING':
      badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      break;
    case 'UPCOMING':
      badgeStyle = 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      break;
    case 'COMPLETED':
      badgeStyle = 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      break;
    case 'CANCELLED':
      badgeStyle = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      break;
    default:
      break;
  }

  return (
    <span 
      title={`Trip Status: ${normalizedStatus}`}
      aria-label={`Trip status is ${normalizedStatus}`}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-md ${badgeStyle}`}
    >
      {normalizedStatus === 'UPCOMING' ? (
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06B6D4]"></span>
        </span>
      ) : normalizedStatus === 'ONGOING' ? (
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      ) : (
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-slate-400"></span>
      )}
      {status}
    </span>
  );
};
