import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Database, User, Upload } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Input, Select, Tabs } from '../components/UI';
import { useCompanyStore } from '../store/companyStore';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { branding, uploadLogo } = useCompanyStore();
  const [logoPreview, setLogoPreview] = useState(branding?.logo || null);
  const [settings, setSettings] = useState({
    companyName: 'Tech Corp Inc',
    industry: 'Technology',
    email: 'admin@teckcorp.com',
    timezone: 'UTC-5',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
  });

  const handleInputChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        uploadLogo(reader.result);
        alert('Logo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'system', label: 'System' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600">Manage your PVARA configuration</p>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Logo</h3>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="settings-logo-upload"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    as="label"
                    htmlFor="settings-logo-upload"
                    variant="secondary"
                    className="cursor-pointer"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG or SVG (max 5MB). Recommended: 400x400px
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
              <div className="space-y-4">
                <Input
                  label="Company Name"
                  value={settings.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
                <Input
                  label="Industry"
                  value={settings.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <Select
                  label="Timezone"
                  options={[
                    { label: 'UTC-8 (PST)', value: 'UTC-8' },
                    { label: 'UTC-6 (CST)', value: 'UTC-6' },
                    { label: 'UTC-5 (EST)', value: 'UTC-5' },
                    { label: 'UTC+0 (GMT)', value: 'UTC+0' },
                    { label: 'UTC+5:30 (IST)', value: 'UTC+5:30' },
                  ]}
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                />
                <Button>Save Changes</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Regional Settings</h3>
              <div className="space-y-4">
                <Select
                  label="Language"
                  options={[
                    { label: 'English', value: 'en' },
                    { label: 'Spanish', value: 'es' },
                    { label: 'French', value: 'fr' },
                    { label: 'German', value: 'de' },
                    { label: 'Hindi', value: 'hi' },
                  ]}
                  value={settings.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                />
                <Select
                  label="Date Format"
                  options={[
                    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
                    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
                  ]}
                  value={settings.dateFormat}
                  onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                />
                <Button>Save Changes</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { label: 'Leave Requests', description: 'Notify when employees request leave' },
                { label: 'Attendance Alert', description: 'Daily attendance summary' },
                { label: 'Payroll Processing', description: 'Payroll cycle notifications' },
                { label: 'Performance Reviews', description: 'Review submission reminders' },
                { label: 'System Updates', description: 'Important system announcements' },
              ].map((notif, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{notif.label}</p>
                    <p className="text-sm text-gray-600">{notif.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              ))}
              <Button>Save Preferences</Button>
            </div>
          </Card>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Password & Security</h3>
              <div className="space-y-4">
                <Input label="Current Password" type="password" />
                <Input label="New Password" type="password" />
                <Input label="Confirm Password" type="password" />
                <Button>Change Password</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
              <p className="text-gray-600 mb-4">
                Add an extra layer of security to your account
              </p>
              <Button>Enable 2FA</Button>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                {[
                  { device: 'Chrome on Mac', location: 'San Francisco, CA', time: 'Current' },
                  { device: 'Safari on iPhone', location: 'San Francisco, CA', time: '2 hours ago' },
                ].map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{session.device}</p>
                      <p className="text-sm text-gray-600">
                        {session.location} • {session.time}
                      </p>
                    </div>
                    <Button size="sm" variant="danger">
                      Logout
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* System */}
        {activeTab === 'system' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">PVARA Version</p>
                <p className="font-semibold text-gray-800">1.0.0</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-semibold text-gray-800">December 8, 2025</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Database Size</p>
                <p className="font-semibold text-gray-800">2.4 GB</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">API Endpoint</p>
                <p className="font-semibold text-gray-800">https://api.pvara.com</p>
              </div>
              <Button>Check for Updates</Button>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Settings;
