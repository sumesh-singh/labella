import React from 'react';
import { motion } from 'framer-motion';
import { Database } from '../types/supabase';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden flex flex-col"
    >
      <img src={item.image_url || 'https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/1E1E1E/FFFFFF?text=Image+Not+Found'} alt={item.name} className="w-full h-40 object-cover" />
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white">{item.name}</h3>
          <p className="text-lg font-bold text-primary-light">${item.price.toFixed(2)}</p>
        </div>
        <p className="text-sm text-slate-400 mb-4 flex-grow">{item.description}</p>
        <div className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full w-fit">
          {item.category}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
