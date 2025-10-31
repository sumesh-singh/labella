import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-700 px-4 md:px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg md:text-2xl font-bold text-white">Table Management</h1>
        <p className="text-xs md:text-sm text-slate-400">Oversee and manage all table reservations.</p>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative text-slate-400 hover:text-white">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40?u=admin"
            alt="Admin User"
            className="w-10 h-10 rounded-full border-2 border-primary"
          />
          <div className="hidden md:block">
            <h4 className="font-semibold text-white">Admin User</h4>
            <p className="text-xs text-slate-400">Manager</p>
          </div>
          <ChevronDown className="w-5 h-5 text-slate-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
};

export default Header;
