import React, { useState, useEffect } from 'react';
import { Settings, Building, Clock, Bell, Loader2 } from 'lucide-react';
import SettingsCard from '../components/SettingsCard';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import SuccessNotification from '../components/SuccessNotification';

interface SettingsState {
  [key: string]: any;
}

const InputField = ({ label, id, type = 'text', value, onChange }: { label: string, id: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      value={value || ''}
      onChange={onChange}
      className={cn("w-full px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all", type === 'time' ? '[color-scheme:dark]' : '')}
    />
  </div>
);

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('settings').select('*');
      if (error) {
        console.error("Error fetching settings:", error);
      } else {
        const settingsObject = (data || []).reduce((acc: SettingsState, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {});
        setSettings(settingsObject);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    const settingsToUpsert = Object.entries(settings).map(([key, value]) => ({
      key,
      value: value,
    }));

    const { error } = await supabase.from('settings').upsert(settingsToUpsert, { onConflict: 'key' });
    
    if (error) {
      console.error("Error saving settings:", error);
    } else {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <header className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-700 px-4 md:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-white">Settings</h1>
          <p className="text-xs md:text-sm text-slate-400">Configure your application settings.</p>
        </div>
        <button 
          onClick={handleSaveChanges}
          disabled={saving}
          className="px-6 py-2 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <SettingsCard
            icon={Building}
            title="Restaurant Details"
            description="Update your restaurant's public information."
          >
            <div className="space-y-6">
              <InputField label="Restaurant Name" id="restaurant_name" value={settings.restaurant_name} onChange={handleChange} />
              <InputField label="Address" id="address" value={settings.address} onChange={handleChange} />
              <InputField label="Phone Number" id="phone" type="tel" value={settings.phone} onChange={handleChange} />
            </div>
          </SettingsCard>

          <SettingsCard
            icon={Clock}
            title="Operating Hours"
            description="Set the weekly hours of operation."
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <span className="font-medium text-slate-300">Weekdays (Mon-Fri)</span>
                <InputField label="Opening Time" id="weekday_open" type="time" value={settings.weekday_open} onChange={handleChange} />
                <InputField label="Closing Time" id="weekday_close" type="time" value={settings.weekday_close} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <span className="font-medium text-slate-300">Weekends (Sat-Sun)</span>
                <InputField label="Opening Time" id="weekend_open" type="time" value={settings.weekend_open} onChange={handleChange} />
                <InputField label="Closing Time" id="weekend_close" type="time" value={settings.weekend_close} onChange={handleChange} />
              </div>
            </div>
          </SettingsCard>
          
          <SettingsCard
            icon={Bell}
            title="Notifications"
            description="Manage how you receive notifications."
          >
            <div className="space-y-4">
               <InputField label="Notification Email" id="notification_email" type="email" value={settings.notification_email} onChange={handleChange} />
               <p className="text-xs text-slate-500">All booking confirmations and alerts will be sent to this email address.</p>
            </div>
          </SettingsCard>
        </div>
      </main>
      <SuccessNotification
        isVisible={showNotification}
        message="Settings saved successfully!"
        onClose={() => setShowNotification(false)}
      />
    </>
  );
};

export default SettingsPage;
