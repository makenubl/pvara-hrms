import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  User,
  Save,
  Eye,
  EyeOff,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Users,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Badge, Modal } from '../components/UI';
import positionService from '../services/positionService';
import { useAuthStore } from '../store/authStore';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [expandedPositions, setExpandedPositions] = useState(new Set());
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

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

  const [newPosition, setNewPosition] = useState({
    title: '',
    department: '',
    description: '',
    reportsTo: null,
    isTopLevel: false,
    level: 'mid',
    grossSalary: '',
    salary_range_min: '',
    salary_range_max: '',
    benefits: '',
    responsibilities: '',
    requirements: '',
  });

  const [newPositionError, setNewPositionError] = useState(null);
  const [submittingPosition, setSubmittingPosition] = useState(false);

  // Load positions from API on mount
  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await positionService.getPositions();
      setPositions(Array.isArray(data) ? data : data.positions || []);
    } catch (err) {
      setError(err.message || 'Failed to load positions');
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePositionChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'isTopLevel') {
      setNewPosition((prev) => ({ 
        ...prev, 
        isTopLevel: checked,
        reportsTo: checked ? null : prev.reportsTo // Clear reportsTo if top level
      }));
    } else if (name === 'reportsTo') {
      setNewPosition((prev) => ({ ...prev, reportsTo: value ? value : null }));
    } else {
      setNewPosition((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddPosition = async (e) => {
    e.preventDefault();
    setNewPositionError(null);
    setSubmittingPosition(true);

    try {
      // Validation
      if (!newPosition.title || !newPosition.department) {
        setNewPositionError('Title and Department are required');
        setSubmittingPosition(false);
        return;
      }

      // Validate top-level position requires gross salary
      if (newPosition.isTopLevel && !newPosition.grossSalary) {
        setNewPositionError('Gross Salary is required for top-level positions (CEO, Chairman, etc.)');
        setSubmittingPosition(false);
        return;
      }

      // Validate salary ranges
      if (newPosition.salary_range_min && newPosition.salary_range_max) {
        if (Number(newPosition.salary_range_min) > Number(newPosition.salary_range_max)) {
          setNewPositionError('Minimum salary cannot be greater than maximum salary');
          setSubmittingPosition(false);
          return;
        }
      }

      const positionData = {
        title: newPosition.title,
        department: newPosition.department,
        description: newPosition.description || undefined,
        level: newPosition.level,
        isTopLevel: newPosition.isTopLevel,
        reportsTo: newPosition.isTopLevel ? null : (newPosition.reportsTo || undefined),
        grossSalary: newPosition.grossSalary ? Number(newPosition.grossSalary) : undefined,
        salary_range_min: newPosition.salary_range_min ? Number(newPosition.salary_range_min) : undefined,
        salary_range_max: newPosition.salary_range_max ? Number(newPosition.salary_range_max) : undefined,
        benefits: newPosition.benefits ? newPosition.benefits.split(',').map(b => b.trim()).filter(Boolean) : [],
        responsibilities: newPosition.responsibilities ? newPosition.responsibilities.split(',').map(r => r.trim()).filter(Boolean) : [],
        requirements: newPosition.requirements ? newPosition.requirements.split(',').map(r => r.trim()).filter(Boolean) : [],
      };

      await positionService.createPosition(positionData);
      await fetchPositions();
      toast.success('Position created successfully!');
      setShowPositionModal(false);
      setNewPosition({ 
        title: '', 
        department: '', 
        description: '',
        reportsTo: null, 
        isTopLevel: false,
        level: 'mid',
        grossSalary: '',
        salary_range_min: '',
        salary_range_max: '',
        benefits: '',
        responsibilities: '',
        requirements: '',
      });
    } catch (err) {
      setNewPositionError(err.message || 'Failed to create position');
    } finally {
      setSubmittingPosition(false);
    }
  };

  const handleDeletePosition = async (posId) => {
    if (window.confirm('Delete this position?')) {
      try {
        await positionService.deletePosition(posId);
        await fetchPositions();
        toast.success('Position deleted successfully');
      } catch (err) {
        toast.error('Failed to delete position: ' + err.message);
      }
    }
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedPositions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedPositions(newExpanded);
  };

  const renderPositionTree = (pos, level = 0) => (
    <div key={pos._id || pos.id} className="ml-4">
      <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-lg mb-2 hover:bg-white/10 transition-all">
        {pos.children && pos.children.length > 0 && (
          <button onClick={() => toggleExpanded(pos._id || pos.id)} className="text-cyan-400 mt-1">
            {expandedPositions.has(pos._id || pos.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        )}
        {(!pos.children || pos.children.length === 0) && <div className="w-6" />}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-white">{pos.title}</p>
            {pos.positionId && (
              <Badge variant="gray" className="text-xs">ID: {pos.positionId}</Badge>
            )}
            {pos.isTopLevel && (
              <Badge variant="purple" className="text-xs">Top Level</Badge>
            )}
          </div>
          
          <p className="text-xs text-slate-400 mb-2">{pos.department}</p>
          
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="blue">{pos.level}</Badge>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Users size={12} /> {pos.employeeCount || 0} employee{(pos.employeeCount || 0) !== 1 ? 's' : ''}
            </span>
            {pos.grossSalary && (
              <span className="text-xs text-emerald-300">
                Salary: ${pos.grossSalary.toLocaleString()}
              </span>
            )}
            {pos.salary_range_min && pos.salary_range_max && (
              <span className="text-xs text-cyan-300">
                Range: ${pos.salary_range_min.toLocaleString()} - ${pos.salary_range_max.toLocaleString()}
              </span>
            )}
          </div>

          {pos.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{pos.description}</p>
          )}
          
          {pos.reportsTo && (
            <p className="text-xs text-slate-500 mt-1">
              Reports to: <span className="text-slate-300">{pos.reportsTo.title}</span>
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button 
            className="p-2 hover:bg-cyan-500/20 rounded-lg transition-all"
            title="Edit Position"
          >
            <Edit2 size={16} className="text-cyan-400" />
          </button>
          <button 
            onClick={() => handleDeletePosition(pos._id || pos.id)} 
            className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
            title="Delete Position"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      </div>

      {expandedPositions.has(pos._id || pos.id) && pos.children && pos.children.length > 0 && (
        <div>{pos.children.map((child) => renderPositionTree(child, level + 1))}</div>
      )}
    </div>
  );

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
          {['account', 'notifications', 'security', 'hierarchy'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400'
              }`}
            >
              {tab === 'hierarchy' ? 'Organization' : tab.charAt(0).toUpperCase() + tab.slice(1)}
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

        {/* Organization Hierarchy */}
        {activeTab === 'hierarchy' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Organization Structure</h2>
              <Button onClick={() => setShowPositionModal(true)} className="flex items-center gap-2">
                <Plus size={18} />
                Add Position
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-3">
                <AlertCircle className="text-red-400" size={20} />
                <p className="text-red-300">{error}</p>
              </div>
            )}

            <Card>
              <h3 className="font-semibold text-white mb-4">Reporting Structure</h3>
              {loading ? (
                <div className="p-8 text-center text-slate-400">Loading positions...</div>
              ) : positions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No positions found. Create one to get started.</div>
              ) : (
                <div className="space-y-4">
                  {positions.map((pos) => renderPositionTree(pos))}
                </div>
              )}
            </Card>

            {/* Position Distribution */}
            <Card>
              <h3 className="font-semibold text-white mb-4">Position Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <p className="text-slate-300 text-sm">Total Positions</p>
                  <p className="text-2xl font-black text-cyan-400 mt-2">{positions.length}</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <p className="text-slate-300 text-sm">Filled</p>
                  <p className="text-2xl font-black text-emerald-400 mt-2">{positions.filter(p => p.employees > 0).length}</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <p className="text-slate-300 text-sm">Open</p>
                  <p className="text-2xl font-black text-amber-400 mt-2">{positions.filter(p => p.employees === 0).length}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Position Modal - Enhanced */}
      <Modal isOpen={showPositionModal} title="Add New Position" onClose={() => setShowPositionModal(false)}>
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          {newPositionError && (
            <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg mb-4">
              <p className="text-red-300 text-sm">{newPositionError}</p>
            </div>
          )}
          
          <form onSubmit={handleAddPosition} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wide">Basic Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Position Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={newPosition.title}
                  onChange={handlePositionChange}
                  placeholder="e.g., Chief Executive Officer, Senior Developer"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Department <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={newPosition.department}
                  onChange={handlePositionChange}
                  placeholder="e.g., Executive, Engineering, Sales"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newPosition.description}
                  onChange={handlePositionChange}
                  placeholder="Brief description of the position..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Hierarchy */}
            <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wide">Reporting Hierarchy</h4>
              
              <div className="flex items-center gap-3 p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                <input
                  type="checkbox"
                  id="isTopLevel"
                  name="isTopLevel"
                  checked={newPosition.isTopLevel}
                  onChange={handlePositionChange}
                  className="w-4 h-4 rounded border-white/20 accent-cyan-400"
                />
                <div>
                  <label htmlFor="isTopLevel" className="block font-medium text-white cursor-pointer">
                    Top-Level Position (CEO, Chairman, etc.)
                  </label>
                  <p className="text-xs text-slate-300 mt-1">
                    Check this if position doesn't report to anyone
                  </p>
                </div>
              </div>

              {!newPosition.isTopLevel && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Reports To</label>
                  <select
                    name="reportsTo"
                    value={newPosition.reportsTo || ''}
                    onChange={handlePositionChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="">Select reporting position</option>
                    {positions.map((pos) => (
                      <option key={pos._id || pos.id} value={pos._id || pos.id}>
                        {pos.title} - {pos.department}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Level</label>
                <select
                  name="level"
                  value={newPosition.level}
                  onChange={handlePositionChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="junior">Junior Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive Level</option>
                </select>
              </div>
            </div>

            {/* Compensation */}
            <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wide">Compensation</h4>
              
              {newPosition.isTopLevel && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Gross Salary <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="grossSalary"
                    value={newPosition.grossSalary}
                    onChange={handlePositionChange}
                    placeholder="e.g., 150000"
                    min="0"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required={newPosition.isTopLevel}
                  />
                  <p className="text-xs text-amber-300 mt-1">
                    Required for top-level positions
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Salary Range Min</label>
                  <input
                    type="number"
                    name="salary_range_min"
                    value={newPosition.salary_range_min}
                    onChange={handlePositionChange}
                    placeholder="e.g., 50000"
                    min="0"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Salary Range Max</label>
                  <input
                    type="number"
                    name="salary_range_max"
                    value={newPosition.salary_range_max}
                    onChange={handlePositionChange}
                    placeholder="e.g., 80000"
                    min="0"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wide">Additional Details</h4>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Benefits</label>
                <textarea
                  name="benefits"
                  value={newPosition.benefits}
                  onChange={handlePositionChange}
                  placeholder="Enter benefits separated by commas (e.g., Health Insurance, Retirement Plan, Stock Options)"
                  rows={2}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Key Responsibilities</label>
                <textarea
                  name="responsibilities"
                  value={newPosition.responsibilities}
                  onChange={handlePositionChange}
                  placeholder="Enter responsibilities separated by commas"
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Requirements</label>
                <textarea
                  name="requirements"
                  value={newPosition.requirements}
                  onChange={handlePositionChange}
                  placeholder="Enter requirements separated by commas (e.g., Bachelor's Degree, 5+ years experience)"
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submittingPosition} className="flex-1">
                {submittingPosition ? 'Creating Position...' : 'Create Position'}
              </Button>
              <Button 
                variant="secondary" 
                type="button" 
                className="flex-1" 
                onClick={() => {
                  setShowPositionModal(false);
                  setNewPositionError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Settings;
