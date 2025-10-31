import React from 'react';
import { Users, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Database } from '../types/supabase';
import { cn } from '../lib/utils';

type Table = Database['public']['Tables']['tables']['Row'];

interface TableCardProps {
  table: Table;
  onBook: (table: Table) => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onBook }) => {
  const statusStyles = {
    available: {
      bg: 'bg-green-500/10 border-green-500/30',
      text: 'text-green-400',
      dot: 'bg-green-400',
    },
    reserved: {
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
    },
    occupied: {
      bg: 'bg-red-500/10 border-red-500/30',
      text: 'text-red-400',
      dot: 'bg-red-400',
    },
  };

  const currentStatus = statusStyles[table.status as keyof typeof statusStyles];

  const formatLocation = (location: string) => {
    return location.charAt(0).toUpperCase() + location.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border p-5 transition-all flex flex-col',
        'bg-dark-800 border-dark-700 hover:border-primary hover:shadow-2xl hover:shadow-primary/10'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Table {table.number}</h3>
          <div className={cn('flex items-center gap-2 mt-1 px-2 py-0.5 rounded-full text-xs font-medium w-fit', currentStatus.bg, currentStatus.text)}>
            <span className={cn('w-2 h-2 rounded-full', currentStatus.dot)}></span>
            <span className="capitalize">{table.status}</span>
          </div>
        </div>
        <div className="bg-dark-700/50 px-3 py-1 rounded-full text-slate-300">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">{table.capacity}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-5 text-slate-400 text-sm flex-grow">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{formatLocation(table.location)}</span>
        </div>
      </div>

      {table.status === 'available' && (
        <button
          onClick={() => onBook(table)}
          className="group w-full bg-gradient-primary text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-lg shadow-primary/20 hover:opacity-90 flex items-center justify-center gap-2"
        >
          <span>Book Now</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </motion.div>
  );
};

export default TableCard;
