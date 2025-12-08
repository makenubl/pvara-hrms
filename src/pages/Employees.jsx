import React, { useState } from 'react';
import { Search, Plus, Filter, Download, Edit2, Eye, Trash2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { handleAddEmployee, handleExportData, handleViewDetails } from '../utils/handlers';
import { Card, Button, Badge, Table, Input, Modal } from '../components/UI';
import { EMPLOYEE_STATUS, DEPARTMENTS } from '../utils/constants';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Mock employee data
  const [employees] = useState([
    {
      id: 'EMP001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      department: 'Technology',
      designation: 'Senior Software Engineer',
      status: 'active',
      joiningDate: '2021-03-15',
      salary: 85000,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    {
      id: 'EMP002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 234-5678',
      department: 'Human Resources',
      designation: 'HR Manager',
      status: 'active',
      joiningDate: '2020-06-20',
      salary: 65000,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    },
    {
      id: 'EMP003',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1 (555) 345-6789',
      department: 'Finance',
      designation: 'Financial Analyst',
      status: 'active',
      joiningDate: '2022-01-10',
      salary: 55000,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    },
    {
      id: 'EMP004',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '+1 (555) 456-7890',
      department: 'Marketing',
      designation: 'Marketing Manager',
      status: 'active',
      joiningDate: '2021-09-05',
      salary: 60000,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      id: 'EMP005',
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1 (555) 567-8901',
      department: 'Technology',
      designation: 'Full Stack Developer',
      status: 'on_leave',
      joiningDate: '2022-05-12',
      salary: 75000,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
  ]);

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = !filterDept || emp.department === filterDept;
    const matchStatus = !filterStatus || emp.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const statusColors = {
    active: 'green',
    inactive: 'gray',
    on_leave: 'yellow',
    suspended: 'red',
  };

  const columns = [
    {
      key: 'id',
      label: 'Employee ID',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'department',
      label: 'Department',
    },
    {
      key: 'designation',
      label: 'Designation',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge variant={statusColors[value]}>{value.replace('_', ' ')}</Badge>,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-blue-100 rounded" title="View">
            <Eye size={16} className="text-blue-600" />
          </button>
          <button className="p-1 hover:bg-yellow-100 rounded" title="Edit">
            <Edit2 size={16} className="text-yellow-600" />
          </button>
          <button className="p-1 hover:bg-red-100 rounded" title="Delete">
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employee Directory</h1>
            <p className="text-gray-600">Manage and view all employees</p>
          </div>
          <Button className="flex items-center gap-2" onClick={handleAddEmployee}>
            <UserPlus size={20} />
            Add Employee
          </Button>
        </div>

        {/* Filters */}
        <Card className="space-y-4">
          <h3 className="font-semibold text-gray-800">Search & Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
            />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-gray-600 text-sm">Total Employees</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{employees.length}</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {employees.filter((e) => e.status === 'active').length}
            </p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">On Leave</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {employees.filter((e) => e.status === 'on_leave').length}
            </p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Departments</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {new Set(employees.map((e) => e.department)).size}
            </p>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Employee List</h3>
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
          <Table
            columns={columns}
            data={filteredEmployees}
            onRowClick={(emp) => {
              setSelectedEmployee(emp);
              setShowModal(true);
            }}
          />
        </Card>

        {/* Employee Detail Modal */}
        <Modal
          isOpen={showModal}
          title="Employee Details"
          onClose={() => setShowModal(false)}
          size="lg"
        >
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  className="w-16 h-16 rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{selectedEmployee.name}</h3>
                  <p className="text-gray-600">{selectedEmployee.designation}</p>
                  <Badge variant="green">{selectedEmployee.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Employee ID</p>
                  <p className="font-semibold text-gray-800">{selectedEmployee.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800">{selectedEmployee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-800">{selectedEmployee.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold text-gray-800">{selectedEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joining Date</p>
                  <p className="font-semibold text-gray-800">{selectedEmployee.joiningDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Salary</p>
                  <p className="font-semibold text-gray-800">${selectedEmployee.salary.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button className="flex-1">Edit</Button>
                <Button variant="secondary" className="flex-1">View Full Profile</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default Employees;
