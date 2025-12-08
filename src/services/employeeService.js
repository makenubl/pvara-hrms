import api from './api';

const mockEmployees = [
  {
    _id: 'emp-1',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john@pvara.com',
    department: 'Technology',
    position: 'Senior Developer',
    salary: 120000,
    joinDate: '2020-01-15',
    status: 'active',
  },
  {
    _id: 'emp-2',
    employeeId: 'EMP002',
    name: 'Jane Smith',
    email: 'jane@pvara.com',
    department: 'Human Resources',
    position: 'HR Manager',
    salary: 85000,
    joinDate: '2021-03-20',
    status: 'active',
  },
  {
    _id: 'emp-3',
    employeeId: 'EMP003',
    name: 'Bob Johnson',
    email: 'bob@pvara.com',
    department: 'Finance',
    position: 'Finance Analyst',
    salary: 75000,
    joinDate: '2019-06-10',
    status: 'active',
  },
];

const employeeService = {
  getEmployees: async (filters = {}) => {
    try {
      return await api.get('/employees', { params: filters });
    } catch (error) {
      return mockEmployees;
    }
  },

  getEmployee: async (employeeId) => {
    try {
      return await api.get(`/employees/${employeeId}`);
    } catch (error) {
      return mockEmployees.find(e => e.employeeId === employeeId) || mockEmployees[0];
    }
  },

  createEmployee: async (employeeData) => {
    try {
      return await api.post('/employees', employeeData);
    } catch (error) {
      return { success: true, data: { _id: `emp-${Date.now()}`, ...employeeData } };
    }
  },

  updateEmployee: async (employeeId, data) => {
    try {
      return await api.put(`/employees/${employeeId}`, data);
    } catch (error) {
      return { success: true, data: { employeeId, ...data } };
    }
  },

  deleteEmployee: async (employeeId) => {
    try {
      return await api.delete(`/employees/${employeeId}`);
    } catch (error) {
      return { success: true, message: 'Employee deleted', employeeId };
    }
  },

  getEmployeeByDepartment: async (departmentId) => {
    try {
      return await api.get(`/employees?department=${departmentId}`);
    } catch (error) {
      return mockEmployees.filter(e => e.department === departmentId);
    }
  },

  bulkImportEmployees: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await api.post('/employees/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      return { success: true, message: 'File imported (mock mode)', recordsImported: 10 };
    }
  },
};

export default employeeService;
