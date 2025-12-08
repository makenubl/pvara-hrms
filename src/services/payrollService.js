import api from './api';

const payrollService = {
  getPayrolls: (employeeId = null, dateRange = 'this-month') => 
    api.get(`/payroll${employeeId ? `/${employeeId}` : '/records'}?range=${dateRange}`),
  
  generatePayroll: (month, year, data) => 
    api.post('/payroll/generate', { month, year, ...data }),
  
  processPayroll: (payrollId, data) => 
    api.post(`/payroll/${payrollId}/process`, data),
  
  getSalaryStructure: (employeeId) => 
    api.get(`/payroll/${employeeId}/salary-structure`),
  
  updateSalaryStructure: (employeeId, data) => 
    api.put(`/payroll/${employeeId}/salary-structure`, data),
  
  getDeductions: (payrollId = null) => 
    api.get(`/payroll${payrollId ? `/${payrollId}/deductions` : '/deductions'}`),
  
  getBenefits: (employeeId = null) => 
    api.get(`/payroll${employeeId ? `/${employeeId}/benefits` : '/benefits'}`),
  
  generatePayslip: (payrollId) => 
    api.get(`/payroll/${payrollId}/payslip`),
};

export default payrollService;
