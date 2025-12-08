import api from './api';

const analyticsService = {
  getOverview: (dateRange = 'this-month') => 
    api.get(`/analytics/overview?range=${dateRange}`),
  
  getEmployeeMetrics: (dateRange = 'this-month') => 
    api.get(`/analytics/employees?range=${dateRange}`),
  
  getAttendanceMetrics: (dateRange = 'this-month') => 
    api.get(`/analytics/attendance?range=${dateRange}`),
  
  getPayrollMetrics: (dateRange = 'this-month') => 
    api.get(`/analytics/payroll?range=${dateRange}`),
  
  getRecruitmentMetrics: (dateRange = 'this-month') => 
    api.get(`/analytics/recruitment?range=${dateRange}`),
  
  getDepartmentMetrics: (dateRange = 'this-month') => 
    api.get(`/analytics/departments?range=${dateRange}`),
  
  getTrendData: (metric = 'employee-growth', dateRange = 'this-year') => 
    api.get(`/analytics/trends?metric=${metric}&range=${dateRange}`),
  
  generateReport: (reportType = 'monthly') => 
    api.post('/analytics/reports', { type: reportType }),
};

export default analyticsService;
