import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, User, Save, Eye, EyeOff } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Badge } from '../components/UI';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    timezone: 'UTC-5',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    slackNotifications: false,
    smsAlerts: true,
    weeklyReport: true,
    payrollReminder: true,
    leaveApprovals: true,
  });

  const [securitySettings] = useState({
    twoFactorEnabled: true,
    lastPasswordChange: '2025-10-15',
    sessionTimeout: '30',
    loginAlerts: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-6 text-slate-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-slate-400 mt-2">Manage your account and preferences</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
          {['account', 'notifications', 'security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Account Settings */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <User size={18} />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option>Engineering</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>HR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option>UTC-5</option>
                    <option>UTC-8</option>
                    <option>UTC+0</option>
                    <option>UTC+5:30</option>
                  </select>
                </div>
              </div>
              <Button className="mt-6 flex items-center gap-2">
                <Save size={18} />
                Save Changes
              </Button>
            </Card>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Bell size={18} />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                  { key: 'slackNotifications', label: 'Slack Notifications', description: 'Send alerts to Slack' },
                  { key: 'smsAlerts', label: 'SMS Alerts', description: 'Critical updates via SMS' },
                  { key: 'weeklyReport', label: 'Weekly Report', description: 'Summary every Monday' },
                  { key: 'payrollReminder', label: 'Payroll Reminders', description: 'Notify before payroll processing' },
                  { key: 'leaveApprovals', label: 'Leave Approvals', description: 'Alert on leave requests' },
                ].map((setting) => (
                  <div key={setting.key} className="flex items-start gap-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                    <input
                      type="checkbox"
                      id={setting.key}
                      checked={notificationSettings[setting.key]}
                      onChange={() => handleNotificationChange(setting.key)}
                      className="w-4 h-4 mt-1 rounded border-white/20 accent-cyan-400"
                    />
                    <div className="flex-1">
                      <label htmlFor={setting.key} className="block font-medium text-white cursor-pointer">
                        {setting.label}
                      </label>
                      <p className="text-xs text-slate-400 mt-1">{setting.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Lock size={18} />
                Security Settings
              </h3>
              
              {/* Two-Factor Authentication */}
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-400 mt-1">Protect your account with 2FA</p>
                  </div>
                  <Badge variant={securitySettings.twoFactorEnabled ? 'green' : 'gray'}>
                    {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>

              {/* Password Change */}
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="font-medium text-white mb-4">Change Password</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                  <Button className="w-full">Update Password</Button>
                </div>
              </div>

              {/* Login History */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="font-medium text-white mb-2">Recent Activity</p>
                <div className="text-sm text-slate-300">
                  <p>Last password change: {securitySettings.lastPasswordChange}</p>
                  <p>Session timeout: {securitySettings.sessionTimeout} minutes</p>
                  <p className="mt-2 text-cyan-400">Login alerts: {securitySettings.loginAlerts ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Settings;
