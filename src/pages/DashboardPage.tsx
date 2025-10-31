import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AlertCircle, Plus, Search, Filter as FilterIcon, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import TableCard from '../components/TableCard';
import BookingModal from '../components/BookingModal';
import StatsCard from '../components/StatsCard';
import SuccessNotification from '../components/SuccessNotification';
import FilterModal from '../components/FilterModal';
import { Database } from '../types/supabase';
import { supabase } from '../lib/supabase';

type Table = Database['public']['Tables']['tables']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

function DashboardPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const fetchTables = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tables').select('*').order('number', { ascending: true });
    if (error) {
      setError(error.message);
      console.error("Error fetching tables:", error);
    } else {
      setTables(data || []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTables();
    
    // Set up a real-time listener for table changes
    const channel = supabase
      .channel('tables-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, (payload) => {
        console.log('Change received!', payload);
        fetchTables(); // Refetch tables on any change
      })
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTables]);

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const statusMatch = selectedStatus === 'all' || table.status === selectedStatus;
      const locationMatch = selectedLocation === 'all' || table.location === selectedLocation;
      return statusMatch && locationMatch;
    });
  }, [tables, selectedStatus, selectedLocation]);

  const stats = useMemo(() => {
    const total = tables.length;
    const available = tables.filter((t) => t.status === 'available').length;
    const reserved = tables.filter((t) => t.status === 'reserved').length;
    const occupied = tables.filter((t) => t.status === 'occupied').length;
    return { total, available, reserved, occupied };
  }, [tables]);

  const handleBookTable = (table: Table) => {
    setSelectedTable(table);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (bookingData: BookingInsert) => {
    if (!selectedTable || !bookingData.table_id) return;

    // Use the new 'create_booking' database function (RPC)
    const { error } = await supabase.rpc('create_booking', {
      p_table_id: bookingData.table_id,
      p_customer_name: bookingData.customer_name,
      p_email: bookingData.email,
      p_phone: bookingData.phone,
      p_guests: bookingData.guests,
      p_date: bookingData.date,
      p_time: bookingData.time,
      p_special_requests: bookingData.special_requests,
    });

    if (error) {
      console.error("Error creating booking via RPC:", error);
      setNotificationMessage(`Error: ${error.message}`);
      setShowNotification(true);
      return;
    }

    // The function now handles both booking creation and table status update.
    // The real-time subscription will automatically refetch the data.
    setNotificationMessage(`Table ${selectedTable?.number} reserved for ${bookingData.customer_name}.`);
    setShowNotification(true);
    setIsBookingModalOpen(false);
    setSelectedTable(null);

    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const handleApplyFilters = (status: string, location: string) => {
    setSelectedStatus(status);
    setSelectedLocation(location);
    setIsFilterModalOpen(false);
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
          <h3 className="text-xl font-semibold text-white mb-2">Failed to load tables</h3>
          <p className="text-slate-400">{error}</p>
        </div>
      );
    }

    if (filteredTables.length === 0) {
      return (
        <div className="bg-dark-800 rounded-lg p-12 text-center border-2 border-dashed border-dark-700">
          <AlertCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Tables Found</h3>
          <p className="text-slate-400">Try adjusting your filters or add some tables to your database.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTables.map((table) => (
          <TableCard key={table.id} table={table} onBook={handleBookTable} />
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatsCard label="Total Tables" value={stats.total} />
          <StatsCard label="Available" value={stats.available} color="text-green-400" />
          <StatsCard label="Occupied" value={stats.occupied} color="text-red-400" />
          <StatsCard label="Reserved" value={stats.reserved} color="text-amber-400" />
        </div>

        <div className="bg-dark-800 rounded-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search tables..."
                className="bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg border border-dark-600"
            >
              <FilterIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity w-full md:w-auto justify-center">
            <Plus className="w-5 h-5" />
            <span>Add Table</span>
          </button>
        </div>

        {renderContent()}
      </main>

      <BookingModal
        table={selectedTable}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedTable(null);
        }}
        onConfirm={handleConfirmBooking}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentStatus={selectedStatus}
        currentLocation={selectedLocation}
      />

      <SuccessNotification
        isVisible={showNotification}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
}

export default DashboardPage;
