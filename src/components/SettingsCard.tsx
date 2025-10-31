import React from 'react';

interface SettingsCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ icon: Icon, title, description, children }) => {
  return (
    <div className="bg-dark-800 rounded-lg border border-dark-700">
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary-light p-3 rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default SettingsCard;
