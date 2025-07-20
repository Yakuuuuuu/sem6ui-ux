import { Settings as SettingsIcon, Bell, Shield, Palette, Database } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '../../../hooks/useToast';

const SETTINGS_KEY = 'admin_settings';

const defaultSettings = {
  siteName: 'Shoe Store',
  storeDescription: 'Premium shoe collection',
  orderNotifications: false,
  lowStockAlerts: false,
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backendConnected, setBackendConnected] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    }
    setLoading(false);
    // Check backend connectivity
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${API_URL}/health`)
      .then(res => res.ok)
      .then(ok => setBackendConnected(ok))
      .catch(() => setBackendConnected(false));
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setTimeout(() => {
      setSaving(false);
      toast({ title: 'Settings saved', description: 'Your settings have been updated.' });
    }, 500);
  };

  if (loading) return <div className="p-8 text-gray-500">Loading settings...</div>;

  return (
    <div role="main" aria-label="Admin Settings">
      <h1 className="text-3xl font-bold text-gray-900 mb-8" tabIndex={0}>Settings</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow" aria-labelledby="general-settings-heading">
          <div className="p-6 border-b border-gray-200">
            <h2 id="general-settings-heading" className="text-lg font-semibold text-gray-900 flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              General Settings
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="siteName" className="font-medium text-gray-900">Site Name</label>
                  <p className="text-sm text-gray-600">The name of your store</p>
                </div>
                <input 
                  id="siteName"
                  type="text" 
                  placeholder="Shoe Store" 
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={settings.siteName}
                  onChange={handleChange}
                  aria-label="Site Name"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="storeDescription" className="font-medium text-gray-900">Store Description</label>
                  <p className="text-sm text-gray-600">Brief description of your store</p>
                </div>
                <input 
                  id="storeDescription"
                  type="text" 
                  placeholder="Premium shoe collection" 
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={settings.storeDescription}
                  onChange={handleChange}
                  aria-label="Store Description"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow" aria-labelledby="notifications-settings-heading">
          <div className="p-6 border-b border-gray-200">
            <h2 id="notifications-settings-heading" className="text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2" aria-hidden="true" />
              Notifications
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="orderNotifications" className="font-medium text-gray-900">Order Notifications</label>
                  <p className="text-sm text-gray-600">Get notified when new orders arrive</p>
                </div>
                <input id="orderNotifications" type="checkbox" className="h-4 w-4" checked={settings.orderNotifications} onChange={handleChange} aria-label="Order Notifications" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="lowStockAlerts" className="font-medium text-gray-900">Low Stock Alerts</label>
                  <p className="text-sm text-gray-600">Alert when products are running low</p>
                </div>
                <input id="lowStockAlerts" type="checkbox" className="h-4 w-4" checked={settings.lowStockAlerts} onChange={handleChange} aria-label="Low Stock Alerts" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Backend Integration Section */}
        {backendConnected ? (
          <div className="bg-white rounded-lg shadow" aria-labelledby="backend-integration-heading">
            <div className="p-6 border-b border-gray-200">
              <h2 id="backend-integration-heading" className="text-lg font-semibold text-gray-900 flex items-center">
                <Database className="h-5 w-5 mr-2" aria-hidden="true" />
                Backend Integration
              </h2>
            </div>
            <div className="p-6 text-center py-8">
              <Database className="mx-auto h-12 w-12 text-green-400 mb-4" aria-hidden="true" />
              <p className="text-green-600 mb-2 font-semibold">Backend connected!</p>
              <p className="text-sm text-gray-400">All backend features are available.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow" aria-labelledby="backend-integration-heading">
            <div className="p-6 border-b border-gray-200">
              <h2 id="backend-integration-heading" className="text-lg font-semibold text-gray-900 flex items-center">
                <Database className="h-5 w-5 mr-2" aria-hidden="true" />
                Backend Integration
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
                <p className="text-gray-500 mb-2">Connect to a backend service</p>
                <p className="text-sm text-gray-400">Settings will be available after backend integration</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
