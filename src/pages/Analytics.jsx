import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { handleDownloadReport } from '../utils/handlers';
import { Card, Button } from '../components/UI';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('this-quarter');

  // Mock analytics data
  const employeeGrowth = [
    { month: 'Jan', total: 280 },
    { month: 'Feb', total: 290 },
    { month: 'Mar', total: 300 },
    { month: 'Apr', total: 310 },
    { month: 'May', total: 315 },
    { month: 'Jun', total: 324 },
  ];

  const departmentDistribution = [
    { name: 'Technology', value: 95, color: '#3b82f6' },
    { name: 'Finance', value: 48, color: '#10b981' },
    { name: 'HR', value: 32, color: '#f59e0b' },
    { name: 'Marketing', value: 68, color: '#8b5cf6' },
    { name: 'Operations', value: 52, color: '#ef4444' },
    { name: 'Sales', value: 29, color: '#06b6d4' },
  ];

  const turnoverData = [
    { quarter: 'Q1', joinings: 8, separations: 2 },
    { quarter: 'Q2', joinings: 12, separations: 3 },
    { quarter: 'Q3', joinings: 10, separations: 1 },
    { quarter: 'Q4', joinings: 15, separations: 2 },
  ];

  const performanceDistribution = [
    { rating: 'Excellent (5)', count: 78 },
    { rating: 'Very Good (4)', count: 128 },
    { rating: 'Good (3)', count: 95 },
    { rating: 'Satisfactory (2)', count: 18 },
    { rating: 'Needs Improvement (1)', count: 5 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 pb-6">
        {/* Header with gradient */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Analytics & Reports
            </h1>
            <p className="text-slate-400 mt-2">View insights and generate reports</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="this-month">This Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="this-year">This Year</option>
            </select>
            <Button size="sm" className="flex items-center gap-2">
              <Download size={16} />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-gray-600 text-sm">Total Headcount</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">324</p>
            <p className="text-xs text-green-600 mt-2">↑ 3 this month</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Avg Tenure</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">4.2 yrs</p>
            <p className="text-xs text-gray-600 mt-2">Stable</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Turnover Rate</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">3.8%</p>
            <p className="text-xs text-green-600 mt-2">↓ Below industry</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Avg Performance</p>
            <p className="text-2xl font-bold text-green-600 mt-1">4.1/5</p>
            <p className="text-xs text-green-600 mt-2">↑ 0.2 this quarter</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Growth */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Growth Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={employeeGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Department Distribution */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Turnover & Hiring */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hiring vs Attrition</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="joinings" fill="#10b981" />
                <Bar dataKey="separations" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance Distribution */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Rating Distribution</h3>
            <div className="space-y-3">
              {performanceDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                    <span className="text-sm font-bold text-gray-800">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.count / 324) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Reports Section */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Employee Directory Report', description: 'Complete employee information' },
              { title: 'Attendance Summary', description: 'Monthly attendance patterns' },
              { title: 'Leave Analytics', description: 'Leave utilization and trends' },
              { title: 'Payroll Report', description: 'Salary and compensation analysis' },
              { title: 'Performance Review', description: 'Performance metrics and ratings' },
              { title: 'Recruitment Report', description: 'Hiring funnel and metrics' },
            ].map((report, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <p className="font-medium text-gray-800">{report.title}</p>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => handleDownloadReport(report.name)}>Download</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Analytics;
