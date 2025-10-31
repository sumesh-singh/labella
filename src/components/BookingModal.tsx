import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, MapPin } from 'lucide-react';
import { Database } from '../types/supabase';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

type Table = Database['public']['Tables']['tables']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

interface BookingModalProps {
  table: Table | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingData: BookingInsert) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ table, isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    guests: 2,
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '18:00',
    special_requests: '',
  });

  useEffect(() => {
    if (table) {
      setFormData(prev => ({
        ...prev,
        guests: Math.min(2, table.capacity),
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '18:00',
      }));
    }
  }, [table]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!table) return;

    onConfirm({
      ...formData,
      table_id: table.id,
      guests: Number(formData.guests),
    });
    
    setFormData({
      customer_name: '', email: '', phone: '', guests: 2,
      date: format(new Date(), 'yyyy-MM-dd'), time: '18:00', special_requests: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = "w-full px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all";

  if (!table) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-dark-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide border border-dark-700">
              <div className="sticky top-0 bg-dark-800/80 backdrop-blur-md p-6 z-10 border-b border-dark-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Book Table {table.number}</h2>
                    <p className="text-slate-400 mt-1">Complete your reservation details</p>
                  </div>
                  <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="bg-dark-900 border border-dark-700 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary-light"/> Capacity: <span className="font-semibold text-white ml-1">{table.capacity} guests</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-light"/> Location: <span className="font-semibold text-white ml-1 capitalize">{table.location}</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                    <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} required className={inputClass} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputClass} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Number of Guests *</label>
                    <select name="guests" value={formData.guests} onChange={handleChange} required className={cn(inputClass, "appearance-none")}>
                      {Array.from({ length: table.capacity }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date *</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required min={format(new Date(), 'yyyy-MM-dd')} className={cn(inputClass, "[color-scheme:dark]")} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Time *</label>
                    <select name="time" value={formData.time} onChange={handleChange} required className={cn(inputClass, "appearance-none")}>
                      {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((time) => (<option key={time} value={time}>{time}</option>))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Special Requests (Optional)</label>
                  <textarea name="special_requests" value={formData.special_requests} onChange={handleChange} rows={3} className={cn(inputClass, "resize-none")} placeholder="Dietary requirements, celebrations..."/>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={onClose} className="flex-1 bg-dark-700 hover:bg-dark-600 text-slate-200 font-semibold py-3 px-6 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-gradient-primary text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 hover:opacity-90">Confirm Booking</button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
