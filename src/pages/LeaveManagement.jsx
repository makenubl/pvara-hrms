import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { handleApprove, handleReject, handleRequestLeave } from '../utils/handlers';
import { Card, Button, Badge, Table, Modal, Input, Select } from '../components/UI';
import { LEAVE_TYPES, LEAVE_STATUS } from '../utils/constants';

const LeaveManagement = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Mock leave data
  const [leaveRecords] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      leaveType: 'annual',
      startDate: '2025-12-15',
      endDate: '2025-12-19',
      days: 5,
      status: 'approved',
      appliedOn: '2025-12-01',
      reason: 'Vacation',
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Jane Smith',
      leaveType: 'sick',
      startDate: '2025-12-10',
      endDate: '2025-12-10',
      days: 1,
      status: 'approved',
      appliedOn: '2025-12-10',
      reason: 'Medical appointment',
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Bob Johnson',
      leaveType: 'personal',
      startDate: '2025-12-22',
      endDate: '2025-12-24',
      days: 3,
      status: 'pending',
      appliedOn: '2025-12-08',
      reason: 'Personal work',
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'Sarah Williams',
      leaveType: 'annual',
      startDate: '2025-12-01',
      endDate: '2025-12-08',
      days: 8,
      status: 'rejected',
      appliedOn: '2025-11-25',
      reason: 'Vacation',
    },
  ]);

  const leaveBalance = {
    annual: { used: 12, balance: 8, total: 20 },
    sick: { used: 2, balance: 8, total: 10 },
    personal: { used: 1, balance: 4, total: 5 },
    casual: { used: 0, balance: 3, total: 3 },
  };

  const statusIcons = {
    approved: <CheckCircle className="w-5 h-5 text-green-600" />,
    rejected: <XCircle className="w-5 h-5 text-red-600" />,
    pending: <Clock className="w-5 h-5 text-yellow-600" />,
  };

  const statusColors = {
    approved: 'green',
    rejected: 'red',
    pending: 'yellow',
  };

  const filteredRecords = filterStatus === 'all' 
    ? leaveRecords 
    : leaveRecords.filter((r) => r.status === filterStatus);

  const columns = [
    {
      key: 'name',
      label: 'Employee',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{row.employeeId}</p>
        </div>
      ),
    },
    {
      key: 'leaveType',
      label: 'Leave Type',
      render: (value) => <Badge variant="blue">{value}</Badge>,
    },
    {
      key: 'days',
      label: 'Days',
      render: (value) => <span className="font-semibold">{value} days</span>,
    },
    {
      key: 'startDate',
      label: 'Period',
      render: (value, row) => <span className="text-sm">{value} to {row.endDate}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <div className="flex items-center gap-2">
          {statusIcons[value]}
          <Badge variant={statusColors[value]}>{value}</Badge>
        </div>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
            <p className="text-gray-600">Request, approve, and track leave</p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setShowRequestModal(true)}
          >
            <Plus size={20} />
            Request Leave
          </Button>
        </div>

        {/* Leave Balance */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(leaveBalance).map(([type, balance]) => (
            <Card key={type}>
              <p className="text-gray-600 text-xs font-semibold uppercase">{type} Leave</p>
              <div className="mt-2">
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-blue-600">{balance.balance}</span>
                  <span className="text-sm text-gray-600">/ {balance.total}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Used: {balance.used}</p>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(balance.used / balance.total) * 100}%` }}
                ></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <Card>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </Card>

        {/* Leave Requests Table */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Leave Requests</h3>
          <Table columns={columns} data={filteredRecords} />
        </Card>

        {/* Pending Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">Pending Approvals</h3>
            <div className="space-y-3">
              {leaveRecords
                .filter((r) => r.status === 'pending')
                .map((record) => (
                  <div key={record.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{record.name}</p>
                        <p className="text-sm text-gray-600">{record.leaveType} Leave • {record.days} days</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {record.startDate} to {record.endDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Approve
                        </Button>
                        <Button size="sm" variant="danger" className="text-xs">
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              {leaveRecords.filter((r) => r.status === 'pending').length === 0 && (
                <p className="text-gray-500 text-center py-4">No pending approvals</p>
              )}
            </div>
          </Card>

          {/* Leave Policies */}
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">Leave Policies</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="border-b border-gray-200 pb-3">
                <p className="font-medium text-gray-800">Annual Leave</p>
                <p className="text-xs text-gray-600">20 days per year • Non-transferable</p>
              </div>
              <div className="border-b border-gray-200 pb-3">
                <p className="font-medium text-gray-800">Sick Leave</p>
                <p className="text-xs text-gray-600">10 days per year • With medical certificate</p>
              </div>
              <div className="border-b border-gray-200 pb-3">
                <p className="font-medium text-gray-800">Personal Leave</p>
                <p className="text-xs text-gray-600">5 days per year • 1 week notice required</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Casual Leave</p>
                <p className="text-xs text-gray-600">3 days per year • Immediate approval</p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="secondary" size="sm">
              View All Policies
            </Button>
          </Card>
        </div>

        {/* Leave Request Modal */}
        <Modal
          isOpen={showRequestModal}
          title="Request Leave"
          onClose={() => setShowRequestModal(false)}
        >
          <form className="space-y-4">
            <Select
              label="Leave Type"
              options={Object.entries(LEAVE_TYPES).map(([key, value]) => ({
                label: key.replace('_', ' ').toUpperCase(),
                value: value,
              }))}
              required
            />
            <Input
              label="From Date"
              type="date"
              required
            />
            <Input
              label="To Date"
              type="date"
              required
            />
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Days: <span className="font-bold">-</span></p>
              <p className="text-xs text-gray-500 mt-1">Balance available: <span className="font-bold">-</span></p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Reason for leave..."
              ></textarea>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Submit Request</Button>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default LeaveManagement;
