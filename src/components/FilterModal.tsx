import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (status: string, location: string) => void;
  currentStatus: string;
  currentLocation: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, currentStatus, currentLocation }) => {
  const [status, setStatus] = useState(currentStatus);
  const [location, setLocation] = useState(currentLocation);

  useEffect(() => {
    setStatus(currentStatus);
    setLocation(currentLocation);
  }, [isOpen, currentStatus, currentLocation]);

  const handleApply = () => {
    onApply(status, location);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full border border-dark-700">
              <div className="flex items-center justify-between p-6 border-b border-dark-700">
                <div className="flex items-center gap-3">
                  <Filter className="w-6 h-6 text-primary-light" />
                  <h2 className="text-xl font-bold text-white">Filter Tables</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    By Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="all">All Tables</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    By Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="all">All Locations</option>
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="window">Window Side</option>
                  </select>
                </div>
              </div>

              <div className="p-6 flex gap-4 border-t border-dark-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-dark-700 hover:bg-dark-600 text-slate-200 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 bg-gradient-primary text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 hover:opacity-90"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;
