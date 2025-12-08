import api from './api';

const employeeService = {
  getEmployees: (filters = {}) =>
    api.get('/employees', { params: filters }),

  getEmployee: (employeeId) =>
    api.get(`/employees/${employeeId}`),

  createEmployee: (employeeData) =>
    api.post('/employees', employeeData),

  updateEmployee: (employeeId, data) =>
    api.put(`/employees/${employeeId}`, data),

  deleteEmployee: (employeeId) =>
    api.delete(`/employees/${employeeId}`),

  getEmployeeByDepartment: (departmentId) =>
    api.get(`/employees?department=${departmentId}`),

  bulkImportEmployees: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/employees/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default employeeService;
