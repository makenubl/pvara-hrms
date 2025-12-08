import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Badge, Table } from '../components/UI';
import { getMonthlyCalendar, formatDate } from '../utils/dateUtils';
import attendanceService from '../services/attendanceService';
import { useAuthStore } from '../store/authStore';

const Attendance = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedMonth] = useState(new Date());
  const [dateRange, setDateRange] = useState('this-month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, workFromHome: 0 });
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markData, setMarkData] = useState({ status: 'present', date: formatDate(new Date(), 'yyyy-MM-dd') });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAttendanceData();
  }, [dateRange]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await attendanceService.getAttendance(null, dateRange);
      const recordList = Array.isArray(records) ? records : records.records || [];
      setAttendanceRecords(recordList);

      // Calculate stats
      const statsData = await attendanceService.getAttendanceStats(null, dateRange);
      setStats(statsData || {
        present: recordList.filter(r => r.status === 'present').length,
        absent: recordList.filter(r => r.status === 'absent').length,
        late: recordList.filter(r => r.status === 'late').length,
        workFromHome: recordList.filter(r => r.status === 'work_from_home').length,
      });
    } catch (err) {
      setError(err.message || 'Failed to load attendance records');
      // Fallback mock data
      setAttendanceRecords([
        {
          _id: '1',
          employeeId: 'EMP001',
          name: 'John Doe',
          date: '2025-12-08',
          status: 'present',
          checkIn: '09:00 AM',
          checkOut: '05:30 PM',
          department: 'Technology',
        },
        {
          _id: '2',
          employeeId: 'EMP002',
          name: 'Jane Smith',
          date: '2025-12-08',
          status: 'present',
          checkIn: '09:15 AM',
          checkOut: '05:45 PM',
          department: 'Human Resources',
        },
        {
          _id: '3',
          employeeId: 'EMP003',
          name: 'Bob Johnson',
          date: '2025-12-08',
          status: 'absent',
          checkIn: null,
          checkOut: null,
          department: 'Finance',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      await attendanceService.markAttendance({
        ...markData,
        employeeId: user?.id,
      });
      setShowMarkModal(false);
      setMarkData({ status: 'present', date: formatDate(new Date(), 'yyyy-MM-dd') });
      fetchAttendanceData();
      alert('Attendance marked successfully');
    } catch (err) {
      alert('Failed to mark attendance: ' + err.message);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-6 text-slate-100">
        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Header with gradient */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Attendance Management
            </h1>
            <p className="text-slate-400 mt-2">Track and manage employee attendance</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white text-sm"
            >
              <option value="this-week" className="bg-slate-900">This Week</option>
              <option value="this-month" className="bg-slate-900">This Month</option>
              <option value="this-quarter" className="bg-slate-900">This Quarter</option>
            </select>
            <Button onClick={() => setShowMarkModal(true)} className="flex items-center gap-2">
              <Plus size={20} />
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 overflow-hidden hover:border-emerald-400/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <p className="relative text-slate-300 text-sm">Total Present</p>
            <p className="relative text-2xl font-black text-white mt-1">
              {loading ? '-' : stats.present || 0}
            </p>
          </div>
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 overflow-hidden hover:border-red-400/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <p className="relative text-slate-300 text-sm">Absent</p>
            <p className="relative text-2xl font-black text-white mt-1">
              {loading ? '-' : stats.absent || 0}
            </p>
          </div>
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 overflow-hidden hover:border-amber-400/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <p className="relative text-slate-300 text-sm">Late</p>
            <p className="relative text-2xl font-black text-white mt-1">
              {loading ? '-' : stats.late || 0}
            </p>
          </div>
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 overflow-hidden hover:border-purple-400/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <p className="relative text-slate-300 text-sm">Work From Home</p>
            <p className="relative text-2xl font-black text-white mt-1">
              {loading ? '-' : stats.workFromHome || 0}
            </p>
          </div>
        </div>

        {/* Mark Attendance Modal */}
        {showMarkModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Mark Attendance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Date</label>
                  <input
                    type="date"
                    value={markData.date}
                    onChange={(e) => setMarkData({ ...markData, date: e.target.value })}
                    className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Status</label>
                  <select
                    value={markData.status}
                    onChange={(e) => setMarkData({ ...markData, status: e.target.value })}
                    className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="present" className="bg-slate-900">Present</option>
                    <option value="absent" className="bg-slate-900">Absent</option>
                    <option value="late" className="bg-slate-900">Late</option>
                    <option value="work_from_home" className="bg-slate-900">Work From Home</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleMarkAttendance}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/50 text-sm font-semibold transition-all"
                  >
                    Mark
                  </button>
                  <button
                    onClick={() => setShowMarkModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-500/20 border border-slate-400/30 text-slate-300 hover:border-slate-400/50 text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('calendar')}
          >
            Calendar View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
        </div>

        {viewMode === 'list' ? (
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Attendance Records</h3>
              <p className="text-sm text-slate-300">{attendanceRecords.length} records</p>
            </div>
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading records...</p>
            ) : attendanceRecords.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No attendance records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Check In</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Check Out</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record) => (
                      <tr key={record._id || record.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-white">{record.name}</p>
                            <p className="text-xs text-slate-400">{record.employeeId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            record.status === 'present' ? 'bg-emerald-500/30 border border-emerald-400/50 text-emerald-300' :
                            record.status === 'absent' ? 'bg-red-500/30 border border-red-400/50 text-red-300' :
                            record.status === 'late' ? 'bg-amber-500/30 border border-amber-400/50 text-amber-300' :
                            'bg-purple-500/30 border border-purple-400/50 text-purple-300'
                          }`}>
                            {record.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white font-medium">{record.checkIn || '-'}</td>
                        <td className="py-3 px-4 text-white font-medium">{record.checkOut || '-'}</td>
                        <td className="py-3 px-4 text-slate-200">{record.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-white mb-4">
                {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-bold text-slate-300 text-sm p-2">
                    {day}
                  </div>
                ))}
                {getMonthlyCalendar(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1).map((day) => (
                  <div
                    key={day.toDateString()}
                    className="aspect-square border border-white/20 rounded-lg p-2 cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <p className="text-xs font-semibold text-white">{day.getDate()}</p>
                    <div className="mt-1 text-xs text-slate-400">
                      {Math.floor(Math.random() * 80)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-white mb-4">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-300 rounded"></div>
                  <span className="text-sm text-slate-200">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-300 rounded"></div>
                  <span className="text-sm text-slate-200">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-300 rounded"></div>
                  <span className="text-sm text-slate-200">Late</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-300 rounded"></div>
                  <span className="text-sm text-slate-200">Work From Home</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20 space-y-3">
                <h4 className="font-semibold text-white">Quick Stats</h4>
                <div>
                  <p className="text-sm text-slate-300">Average Attendance</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {attendanceRecords.length > 0 
                      ? Math.round((stats.present / (stats.present + stats.absent + stats.late)) * 100) 
                      : '94'}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">This Period</p>
                  <p className="text-lg font-bold text-white">{stats.present}/{attendanceRecords.length} days</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Attendance;