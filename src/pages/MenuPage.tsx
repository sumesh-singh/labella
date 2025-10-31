import React, { useState, useEffect } from 'react';
import { Plus, Search, Loader2, AlertCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import MenuCard from '../components/MenuCard';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) {
        setError(error.message);
        console.error("Error fetching menu:", error);
      } else {
        setMenuItems(data || []);
        setError(null);
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const categories = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Beverage'];

  const filteredItems = filter === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === filter);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-dark-800 rounded-lg p-12 text-center border-2 border-dashed border-red-500/50">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Failed to load menu</h3>
          <p className="text-slate-400">{error}</p>
        </div>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <div className="bg-dark-800 rounded-lg p-12 text-center border-2 border-dashed border-dark-700">
          <AlertCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Menu Items Found</h3>
          <p className="text-slate-400">Add some items to your menu in the Supabase dashboard to see them here.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <header className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-700 px-4 md:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-white">Restaurant Menu</h1>
          <p className="text-xs md:text-sm text-slate-400">Manage your restaurant's menu items.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="bg-dark-800 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-shrink-0 flex items-center gap-2 bg-dark-900 border border-dark-700 p-1 rounded-lg">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  filter === category ? 'bg-primary text-white' : 'text-slate-300 hover:bg-dark-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search menu..."
              className="bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>

        {renderContent()}
      </main>
    </>
  );
};

export default MenuPage;
