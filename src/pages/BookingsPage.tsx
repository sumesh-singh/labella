import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { Database } from '../types/supabase';

type BookingWithTableNumber = Database['public']['Tables']['bookings']['Row'] & {
  tables: { number: number } | null;
};

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingWithTableNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*, tables(number)')
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (error) {
        setError(error.message);
        console.error("Error fetching bookings:", error);
      } else {
        setBookings(data as BookingWithTableNumber[] || []);
        setError(null);
      }
      setLoading(false);
    };

    fetchBookings();
  }, []);

  const getStatusChip = (status: string) => {
    const styles: { [key: string]: string } = {
      confirmed: 'bg-blue-500/10 text-blue-400',
      seated: 'bg-yellow-500/10 text-yellow-400',
      completed: 'bg-green-500/10 text-green-400',
      cancelled: 'bg-red-500/10 text-red-400',
    };
    return (
      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', styles[status] || 'bg-gray-500/10 text-gray-400')}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
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
          <h3 className="text-xl font-semibold text-white mb-2">Failed to load bookings</h3>
          <p className="text-slate-400">{error}</p>
        </div>
      );
    }
    
    if (bookings.length === 0) {
      return (
        <div className="bg-dark-800 rounded-lg p-12 text-center border-2 border-dashed border-dark-700">
          <AlertCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Bookings Found</h3>
          <p className="text-slate-400">Once a table is booked, the reservation will appear here.</p>
        </div>
      );
    }

    return (
      <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-dark-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Customer</th>
              <th scope="col" className="px-6 py-3">Date & Time</th>
              <th scope="col" className="px-6 py-3">Table No.</th>
              <th scope="col" className="px-6 py-3">Guests</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-dark-700 hover:bg-dark-700/40">
                <td className="px-6 py-4 font-medium text-white">
                  <div>{booking.customer_name}</div>
                  <div className="text-xs text-slate-400">{booking.email}</div>
                </td>
                <td className="px-6 py-4">{booking.date} at {booking.time}</td>
                <td className="px-6 py-4 text-center">{booking.tables?.number || 'N/A'}</td>
                <td className="px-6 py-4 text-center">{booking.guests}</td>
                <td className="px-6 py-4">{getStatusChip(booking.status)}</td>
                <td className="px-6 py-4 text-right">
                  <a href="#" className="font-medium text-primary-light hover:underline">Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <header className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-700 px-4 md:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-white">All Bookings</h1>
          <p className="text-xs md:text-sm text-slate-400">View and manage all reservations.</p>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="bg-dark-800 rounded-lg p-4 mb-6 flex items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search bookings..."
              className="bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg border border-dark-600">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
        {renderContent()}
      </main>
    </>
  );
};

export default BookingsPage;
