import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, Edit2, Eye, Trash2, UserPlus, AlertCircle, X } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Badge, Table, Input, Modal } from '../components/UI';
import { EMPLOYEE_STATUS, DEPARTMENTS } from '../utils/constants';
import employeeService from '../services/employeeService';
import positionService from '../services/positionService';
import toast from 'react-hot-toast';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '', // Changed from designation to position
    salary: '',
    joiningDate: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch employees and positions on mount
  useEffect(() => {
    fetchEmployees();
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const data = await positionService.getPositions();
      const posList = Array.isArray(data) ? data : data.positions || [];
      setPositions(posList.filter(p => p.status === 'active'));
    } catch (err) {
      console.error('Failed to load positions:', err);
      setPositions([]);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees();
      const empList = Array.isArray(data) ? data : data.employees || [];
      setEmployees(empList);
    } catch (err) {
      setError(err.message || 'Failed to load employees');
      // Fallback to mock data
      setEmployees([
        {
          _id: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          department: 'Technology',
          designation: 'Senior Software Engineer',
          status: 'active',
          joiningDate: '2021-03-15',
          salary: 85000,
        },
        {
          _id: 'EMP002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '+1 (555) 234-5678',
          department: 'Human Resources',
          designation: 'HR Manager',
          status: 'active',
          joiningDate: '2020-06-20',
          salary: 65000,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newEmployee = await employeeService.createEmployee({
        ...formData,
        salary: parseFloat(formData.salary),
        status: 'active',
      });
      setEmployees([...employees, newEmployee]);
      setShowAddModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        position: '',
        salary: '',
        joiningDate: new Date().toISOString().split('T')[0],
      });
      toast.success('Employee added successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (empId) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await employeeService.deleteEmployee(empId);
      setEmployees(employees.filter(e => e._id !== empId));
      toast.success('Employee deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete employee');
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const name = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const matchSearch =
      name.includes(searchTerm.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp._id || '').toLowerCase().includes(searchTerm.toLowerCase());
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
      key: '_id',
      label: 'Employee ID',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.firstName}`} 
            alt={`${row.firstName} ${row.lastName}`} 
            className="w-8 h-8 rounded-full" 
          />
          <span className="text-xs text-slate-400">{value?.slice(-6) || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'firstName',
      label: 'Name',
      render: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'N/A',
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
      render: (value) => <Badge variant={statusColors[value] || 'gray'}>{(value || 'unknown').replace('_', ' ')}</Badge>,
    },
    {
      key: '_id',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedEmployee(row); setShowModal(true); }}
            className="p-2 hover:bg-blue-500/20 hover:border-blue-400/50 border border-transparent rounded-lg transition-all" 
            title="View"
          >
            <Eye size={16} className="text-blue-400" />
          </button>
          <button 
            className="p-2 hover:bg-cyan-500/20 hover:border-cyan-400/50 border border-transparent rounded-lg transition-all" 
            title="Edit"
          >
            <Edit2 size={16} className="text-cyan-400" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDeleteEmployee(row._id); }}
            className="p-2 hover:bg-red-500/20 hover:border-red-400/50 border border-transparent rounded-lg transition-all" 
            title="Delete"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 pb-6">
        {/* Header with gradient */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Employee Directory
            </h1>
            <p className="text-slate-400 mt-2">Manage and view all employees</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="group relative overflow-hidden rounded-xl py-3 px-6 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/50 hover:border-cyan-400 hover:from-cyan-500/50 hover:to-blue-500/50 transition-all flex items-center gap-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 opacity-0 group-hover:opacity-100 blur-lg transition-opacity"></div>
            <UserPlus size={20} className="relative" />
            <span className="relative">Add Employee</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        )}

        {/* Filters - Premium Glass Card */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all shadow-lg">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Filter size={18} className="text-cyan-400" />
            Search & Filter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-slate-400 transition-all"
              />
            </div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white transition-all"
            >
              <option value="" className="bg-slate-900">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-slate-900">
                  {dept}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white transition-all"
            >
              <option value="" className="bg-slate-900">All Status</option>
              <option value="active" className="bg-slate-900">Active</option>
              <option value="on_leave" className="bg-slate-900">On Leave</option>
              <option value="inactive" className="bg-slate-900">Inactive</option>
              <option value="suspended" className="bg-slate-900">Suspended</option>
            </select>
          </div>
        </div>

        {/* Stats - Premium Glass Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-cyan-400/50 transition-all group">
            <p className="text-slate-400 text-sm font-medium">Total Employees</p>
            <p className="text-3xl font-black text-white mt-2">{employees.length}</p>
            <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-green-400/50 transition-all group">
            <p className="text-slate-400 text-sm font-medium">Active</p>
            <p className="text-3xl font-black text-green-400 mt-2">
              {employees.filter((e) => e.status === 'active').length}
            </p>
          </div>
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-amber-400/50 transition-all group">
            <p className="text-slate-400 text-sm font-medium">On Leave</p>
            <p className="text-3xl font-black text-amber-400 mt-2">
              {employees.filter((e) => e.status === 'on_leave').length}
            </p>
          </div>
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-blue-400/50 transition-all group">
            <p className="text-slate-400 text-sm font-medium">Departments</p>
            <p className="text-3xl font-black text-blue-400 mt-2">
              {new Set(employees.map((e) => e.department)).size}
            </p>
          </div>
        </div>

        {/* Table - Premium Glass */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white text-lg">Employee List ({filteredEmployees.length})</h3>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 hover:text-purple-200 hover:border-purple-400/50 text-sm font-semibold transition-all">
              <Download size={16} />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              data={filteredEmployees}
              onRowClick={(emp) => {
                setSelectedEmployee(emp);
                setShowModal(true);
              }}
            />
          </div>
        </div>

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
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedEmployee.firstName}`}
                  alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                  className="w-16 h-16 rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                  <p className="text-gray-600">{selectedEmployee.designation}</p>
                  <Badge variant="green">{selectedEmployee.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Employee ID</p>
                  <p className="font-semibold text-gray-800">{selectedEmployee._id?.slice(-8) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800">{selectedEmployee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-800">{selectedEmployee.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold text-gray-800">{selectedEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joining Date</p>
                  <p className="font-semibold text-gray-800">{selectedEmployee.joiningDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Salary</p>
                  <p className="font-semibold text-gray-800">${(selectedEmployee.salary || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button className="flex-1">Edit</Button>
                <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Close</Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Add Employee Modal */}
        <Modal
          isOpen={showAddModal}
          title="Add New Employee"
          onClose={() => setShowAddModal(false)}
          size="lg"
        >
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Minimum 6 characters"
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Department *</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Position *</label>
                <select
                  required
                  value={formData.position}
                  onChange={(e) => {
                    const selectedPos = positions.find(p => (p._id || p.id) === e.target.value);
                    setFormData({ 
                      ...formData, 
                      position: e.target.value,
                      department: selectedPos?.department || formData.department,
                      salary: selectedPos?.grossSalary || formData.salary
                    });
                  }}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">Select Position</option>
                  {positions.length === 0 && (
                    <option value="" disabled>No positions available - Create one in Settings</option>
                  )}
                  {positions.map((pos) => (
                    <option key={pos._id || pos.id} value={pos._id || pos.id}>
                      {pos.title} - {pos.department} {pos.positionId ? `(${pos.positionId})` : ''}
                    </option>
                  ))}
                </select>
                {positions.length === 0 && (
                  <p className="text-xs text-amber-400 mt-1">⚠️ Create positions in Settings first</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Salary</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Joining Date *</label>
                <input
                  type="date"
                  required
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? 'Adding Employee...' : 'Add Employee'}
              </Button>
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default Employees;
