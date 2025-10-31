import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ArrowRight, MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

const LandingNavbar = () => (
  <nav className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center">
    <Link to="/" className="flex items-center gap-3">
      <div className="bg-gradient-primary p-2 rounded-lg">
        <UtensilsCrossed className="w-6 h-6 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-white font-serif">La Bella</h1>
    </Link>
    <Link
      to="/dashboard"
      className="bg-white/10 backdrop-blur-sm text-white font-semibold py-2 px-5 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
    >
      Book a Table
    </Link>
  </nav>
);

const LandingFooter = () => (
  <footer className="bg-dark-800 text-slate-400 py-12">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-lg font-bold text-white mb-4 font-serif">La Bella</h3>
        <p className="text-sm">Experience the art of fine dining.</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2"><MapPin size={16} /> 123 Culinary Lane, Foodie City</p>
          <p className="flex items-center gap-2"><Phone size={16} /> (555) 123-4567</p>
          <p className="flex items-center gap-2"><Mail size={16} /> reservations@labella.com</p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Hours</h3>
        <div className="space-y-2 text-sm">
          <p>Mon - Fri: 5:00 PM - 10:00 PM</p>
          <p>Sat - Sun: 4:00 PM - 11:00 PM</p>
        </div>
      </div>
    </div>
    <div className="text-center mt-10 border-t border-dark-700 pt-6 text-xs">
      <p>&copy; 2025 La Bella. All Rights Reserved.</p>
    </div>
  </footer>
);

const LandingPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMenu = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .limit(3);
      
      if (error) {
        console.error("Error fetching featured menu:", error);
      } else {
        setMenuItems(data || []);
      }
      setLoading(false);
    };
    fetchFeaturedMenu();
  }, []);

  return (
    <div className="bg-dark-900 text-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center bg-hero-pattern bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-4">Savor the Moment</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Discover a symphony of flavors crafted with passion. Reserve your table and create lasting memories.
          </p>
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 bg-gradient-primary text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all shadow-lg shadow-primary/20 hover:opacity-90"
          >
            <span>Reserve Your Table</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-2 font-serif">From Our Kitchen</h2>
          <p className="text-center text-slate-400 mb-12">A selection of our most loved dishes.</p>
          
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-dark-800 rounded-lg overflow-hidden border border-dark-700"
                >
                  <img src={item.image_url || 'https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/1E1E1E/444444?text=No+Image'} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{item.description}</p>
                    <p className="text-lg font-semibold text-primary-light">${item.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
