import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart, Users, AlertCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { LineChart, Line, BarChart, Bar, PieChart as PieChartComponent, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import analyticsService from '../services/analyticsService';
import { useAuthStore } from '../store/authStore';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('this-month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overviewData, setOverviewData] = useState({});
  const [employeeMetrics, setEmployeeMetrics] = useState([]);
  const [departmentMetrics, setDepartmentMetrics] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const overview = await analyticsService.getOverview(dateRange);
      setOverviewData(overview || {});

      const empMetrics = await analyticsService.getEmployeeMetrics(dateRange);
      setEmployeeMetrics(Array.isArray(empMetrics) ? empMetrics : empMetrics.data || []);

      const deptMetrics = await analyticsService.getDepartmentMetrics(dateRange);
      setDepartmentMetrics(Array.isArray(deptMetrics) ? deptMetrics : deptMetrics.data || []);

      const trends = await analyticsService.getTrendData('employee-growth', dateRange);
      setTrendData(Array.isArray(trends) ? trends : trends.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#06b6d4', '#0ea5e9', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <MainLayout>
      <div className="space-y-6 pb-6">
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Analytics
            </h1>
            <p className="text-slate-400 mt-2">HR metrics and insights</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white text-sm"
          >
            <option value="this-week" className="bg-slate-900">This Week</option>
            <option value="this-month" className="bg-slate-900">This Month</option>
            <option value="this-year" className="bg-slate-900">This Year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
            <div className="relative">
              <p className="text-slate-300 text-sm">Total Employees</p>
              <p className="text-3xl font-black text-cyan-400 mt-1">{loading ? '-' : overviewData.totalEmployees || 324}</p>
            </div>
          </div>
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
            <div className="relative">
              <p className="text-slate-300 text-sm">Attendance Rate</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">{loading ? '-' : overviewData.attendanceRate || '94%'}</p>
            </div>
          </div>
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
            <div className="relative">
              <p className="text-slate-300 text-sm">Performance Score</p>
              <p className="text-3xl font-black text-blue-400 mt-1">{loading ? '-' : overviewData.performanceScore || '4.2/5'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Employee Growth Trend</h3>
            {!loading && trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(148,163,184,0.6)" />
                  <YAxis stroke="rgba(148,163,184,0.6)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.2)' }} />
                  <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-slate-400">No data</div>
            )}
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Department Distribution</h3>
            {!loading && departmentMetrics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChartComponent>
                  <Pie data={departmentMetrics} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {departmentMetrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.2)' }} />
                </PieChartComponent>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-slate-400">No data</div>
            )}
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Employee Metrics</h3>
          {!loading && employeeMetrics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="department" stroke="rgba(148,163,184,0.6)" />
                <YAxis stroke="rgba(148,163,184,0.6)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.2)' }} />
                <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-slate-400">No data</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
