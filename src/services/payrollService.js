import api from './api';

const mockPayrolls = [
  {
    _id: 'payroll-1',
    employeeId: 'EMP001',
    month: 12,
    year: 2025,
    baseSalary: 120000,
    deductions: 15000,
    netSalary: 105000,
    status: 'processed',
    processedDate: '2025-12-05',
  },
  {
    _id: 'payroll-2',
    employeeId: 'EMP002',
    month: 12,
    year: 2025,
    baseSalary: 85000,
    deductions: 10000,
    netSalary: 75000,
    status: 'processed',
    processedDate: '2025-12-05',
  },
];

const payrollService = {
  getPayrolls: async (employeeId = null, dateRange = 'this-month') => {
    try {
      return await api.get(`/payroll${employeeId ? `/${employeeId}` : '/records'}?range=${dateRange}`);
    } catch (error) {
      return mockPayrolls;
    }
  },
  
  generatePayroll: async (month, year, data) => {
    try {
      return await api.post('/payroll/generate', { month, year, ...data });
    } catch (error) {
      return { success: true, message: 'Payroll generated (mock mode)', data: { month, year, ...data } };
    }
  },
  
  processPayroll: async (payrollId, data) => {
    try {
      return await api.post(`/payroll/${payrollId}/process`, data);
    } catch (error) {
      return { success: true, message: 'Payroll processed (mock mode)', payrollId, ...data };
    }
  },
  
  getSalaryStructure: async (employeeId) => {
    try {
      return await api.get(`/payroll/${employeeId}/salary-structure`);
    } catch (error) {
      return { baseSalary: 100000, allowances: 5000, deductions: 5000 };
    }
  },
  
  updateSalaryStructure: async (employeeId, data) => {
    try {
      return await api.put(`/payroll/${employeeId}/salary-structure`, data);
    } catch (error) {
      return { success: true, message: 'Salary structure updated (mock mode)', employeeId, ...data };
    }
  },
  
  getDeductions: async (payrollId = null) => {
    try {
      return await api.get(`/payroll${payrollId ? `/${payrollId}/deductions` : '/deductions'}`);
    } catch (error) {
      return { tax: 5000, insurance: 3000, pension: 2000 };
    }
  },
  
  getBenefits: async (employeeId = null) => {
    try {
      return await api.get(`/payroll${employeeId ? `/${employeeId}/benefits` : '/benefits'}`);
    } catch (error) {
      return { health: 2000, retirement: 3000, vacation: 1500 };
    }
  },
  
  generatePayslip: async (payrollId) => {
    try {
      return await api.get(`/payroll/${payrollId}/payslip`);
    } catch (error) {
      return { success: true, message: 'Payslip generated (mock mode)', payrollId };
    }
  },
};

export default payrollService;
