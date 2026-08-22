import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeStyle = 'bg-gray-100 text-gray-700 border-gray-200';
  let dotStyle = 'bg-gray-400';

  switch (status?.toUpperCase()) {
    case 'ONGOING':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotStyle = 'bg-emerald-500 animate-pulse';
      break;
    case 'UPCOMING':
      badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
      dotStyle = 'bg-blue-500';
      break;
    case 'COMPLETED':
      badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
      dotStyle = 'bg-purple-500';
      break;
    case 'CANCELLED':
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
      dotStyle = 'bg-rose-500';
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotStyle}`}></span>
      {status}
    </span>
  );
};
