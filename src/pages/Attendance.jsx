import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { handleCheckIn, handleCheckOut, handleMarkAttendance } from '../utils/handlers';
import { Card, Button, Badge, Table, Input } from '../components/UI';
import { ATTENDANCE_STATUS } from '../utils/constants';
import { getMonthlyCalendar, formatDate } from '../utils/dateUtils';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // calendar, list
  const [filterDept, setFilterDept] = useState('');

  // Mock attendance data
  const [attendanceRecords] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      date: '2025-12-08',
      status: 'present',
      checkIn: '09:00 AM',
      checkOut: '05:30 PM',
      department: 'Technology',
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Jane Smith',
      date: '2025-12-08',
      status: 'present',
      checkIn: '09:15 AM',
      checkOut: '05:45 PM',
      department: 'Human Resources',
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Bob Johnson',
      date: '2025-12-08',
      status: 'absent',
      checkIn: null,
      checkOut: null,
      department: 'Finance',
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'Sarah Williams',
      date: '2025-12-08',
      status: 'late',
      checkIn: '10:30 AM',
      checkOut: '05:15 PM',
      department: 'Marketing',
    },
    {
      id: 5,
      employeeId: 'EMP005',
      name: 'Michael Brown',
      date: '2025-12-08',
      status: 'work_from_home',
      checkIn: '08:45 AM',
      checkOut: '06:00 PM',
      department: 'Technology',
    },
  ]);

  const statusIcons = {
    present: <CheckCircle className="w-5 h-5 text-green-600" />,
    absent: <XCircle className="w-5 h-5 text-red-600" />,
    late: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    half_day: <AlertCircle className="w-5 h-5 text-blue-600" />,
    work_from_home: <Clock className="w-5 h-5 text-purple-600" />,
  };

  const statusColors = {
    present: 'green',
    absent: 'red',
    late: 'yellow',
    half_day: 'blue',
    work_from_home: 'purple',
  };

  const monthDays = getMonthlyCalendar(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1);

  const todayAttendance = attendanceRecords.filter(
    (r) => r.date === formatDate(new Date(), 'yyyy-MM-dd')
  );

  const columns = [
    {
      key: 'name',
      label: 'Employee Name',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{row.employeeId}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <div className="flex items-center gap-2">
          {statusIcons[value]}
          <Badge variant={statusColors[value]}>{value.replace('_', ' ')}</Badge>
        </div>
      ),
    },
    {
      key: 'checkIn',
      label: 'Check In',
      render: (value) => <span className="font-medium">{value || '-'}</span>,
    },
    {
      key: 'checkOut',
      label: 'Check Out',
      render: (value) => <span className="font-medium">{value || '-'}</span>,
    },
    {
      key: 'department',
      label: 'Department',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
            <p className="text-gray-600">Track and manage employee attendance</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            Mark Attendance
          </Button>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-gray-600 text-sm">Total Present</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {attendanceRecords.filter((r) => r.status === 'present').length}
            </p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Absent</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {attendanceRecords.filter((r) => r.status === 'absent').length}
            </p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Late</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {attendanceRecords.filter((r) => r.status === 'late').length}
            </p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Work From Home</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {attendanceRecords.filter((r) => r.status === 'work_from_home').length}
            </p>
          </Card>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            List View
          </button>
        </div>

        {viewMode === 'list' ? (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Today's Attendance</h3>
              <p className="text-sm text-gray-600">{formatDate(new Date())}</p>
            </div>
            <Table columns={columns} data={attendanceRecords} />
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <h3 className="font-semibold text-gray-800 mb-4">
                {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-bold text-gray-600 text-sm p-2">
                    {day}
                  </div>
                ))}
                {monthDays.map((day) => (
                  <div
                    key={day.toDateString()}
                    className="aspect-square border border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <p className="text-xs font-semibold text-gray-700">{day.getDate()}</p>
                    <div className="mt-1 text-xs text-gray-500">
                      {Math.floor(Math.random() * 80)}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Legends */}
            <Card>
              <h3 className="font-semibold text-gray-800 mb-4">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span className="text-sm text-gray-700">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 rounded"></div>
                  <span className="text-sm text-gray-700">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                  <span className="text-sm text-gray-700">Late</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-200 rounded"></div>
                  <span className="text-sm text-gray-700">Work From Home</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <h4 className="font-semibold text-gray-800">Quick Stats</h4>
                <div>
                  <p className="text-sm text-gray-600">Average Attendance</p>
                  <p className="text-2xl font-bold text-blue-600">94%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-lg font-bold text-gray-800">22/22 days</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Attendance;
