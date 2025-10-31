import React from 'react';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  selectedStatus: string;
  selectedLocation: string;
  onStatusChange: (status: string) => void;
  onLocationChange: (location: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedStatus,
  selectedLocation,
  onStatusChange,
  onLocationChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-amber-600" />
        <h2 className="text-lg font-semibold text-gray-800">Filter Tables</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
          >
            <option value="all">All Tables</option>
            <option value="available">Available Only</option>
            <option value="reserved">Reserved Only</option>
            <option value="occupied">Occupied Only</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
          >
            <option value="all">All Locations</option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="window">Window Side</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
