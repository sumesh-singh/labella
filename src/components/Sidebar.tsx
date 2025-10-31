import React from 'react';
import { NavLink } from 'react-router-dom';
import { UtensilsCrossed, LayoutDashboard, CalendarCheck, BookOpen, Settings, LogOut } from 'lucide-react';

const NavItem = ({ icon: Icon, label, to }: { icon: React.ElementType, label: string, to: string }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary/20 text-primary-light'
          : 'text-slate-400 hover:bg-dark-700 hover:text-slate-200'
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-dark-800 p-6 flex-col border-r border-dark-700 hidden md:flex">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-gradient-primary p-2 rounded-lg">
          <UtensilsCrossed className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">La Bella</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
        <NavItem icon={CalendarCheck} label="Bookings" to="/bookings" />
        <NavItem icon={BookOpen} label="Menu" to="/menu" />
        <NavItem icon={Settings} label="Settings" to="/settings" />
      </nav>

      <div className="mt-auto">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-dark-700 hover:text-slate-200 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Exit to Site</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
