import React from 'react';
import { cn } from '../lib/utils';

interface StatsCardProps {
  label: string;
  value: number;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, color }) => {
  return (
    <div className="bg-dark-800 rounded-lg p-5 border border-dark-700">
      <p className={cn("text-sm font-medium mb-2", color ? color : "text-slate-400")}>{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
};

export default StatsCard;
