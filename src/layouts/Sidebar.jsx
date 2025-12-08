import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  BarChart3,
  DollarSign,
  Award,
  Briefcase,
  BookOpen,
  Shield,
  Settings,
  Menu,
  X,
  LifeBuoy,
  Activity,
  ShieldCheck,
  Plug,
  Table2,
  ClipboardCheck,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { user } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: Calendar, label: 'Attendance', path: '/attendance' },
    { icon: Calendar, label: 'Leave Management', path: '/leaves' },
    { icon: DollarSign, label: 'Payroll', path: '/payroll' },
    { icon: Award, label: 'Performance', path: '/performance' },
    { icon: Briefcase, label: 'Recruitment', path: '/recruitment' },
    { icon: BookOpen, label: 'Learning & Development', path: '/learning' },
    { icon: Shield, label: 'Compliance', path: '/compliance' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: DollarSign, label: 'Billing', path: '/subscription' },
    { icon: ShieldCheck, label: 'Admin', path: '/admin' },
    { icon: Table2, label: 'Roles Matrix', path: '/roles' },
    { icon: ClipboardCheck, label: 'Access Reviews', path: '/access-reviews' },
    { icon: Plug, label: 'Integrations', path: '/integrations' },
    { icon: LifeBuoy, label: 'Support', path: '/support' },
    { icon: Activity, label: 'Status', path: '/status' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-blue-600 text-white p-2 rounded-lg"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-transform duration-300 z-40 md:z-auto overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
              <Users size={20} />
            </div>
            HRMS
          </h1>
          <p className="text-sm text-blue-300 mt-1">{user?.company || 'Enterprise'}</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => !sidebarOpen && toggleSidebar()}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700 bg-blue-800">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-blue-300 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
