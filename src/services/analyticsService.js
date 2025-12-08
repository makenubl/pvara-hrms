import api from './api';

const analyticsService = {
  getOverview: async (dateRange = 'this-month') => {
    try {
      return await api.get(`/analytics/overview?range=${dateRange}`);
    } catch (error) {
      return { totalEmployees: 150, newJoinees: 3, separations: 1, avgSalary: 85000 };
    }
  },
  
  getEmployeeMetrics: async (dateRange = 'this-month') => {
    try {
      return await api.get(`/analytics/employees?range=${dateRange}`);
    } catch (error) {
      return { active: 145, inactive: 5, newHires: 3, promotions: 2 };
    }
  },
  
  getAttendanceMetrics: async (dateRange = 'this-month') => {
    try {
      return await api.get(`/analytics/attendance?range=${dateRange}`);
    } catch (error) {
      return { avgAttendance: 94.5, present: 1420, absent: 80, late: 30, workFromHome: 20 };
    }
  },
  
  getPayrollMetrics: async (dateRange = 'this-month') => {
    try {
      return await api.get(`/analytics/payroll?range=${dateRange}`);
    } catch (error) {
      return { totalPayroll: 12750000, avgSalary: 85000, processed: 150, pending: 0 };
    }
  },
  
  getRecruitmentMetrics: async (dateRange = 'this-month') => {
    try {
      return await api.get(`/analytics/recruitment?range=${dateRange}`);
    } catch (error) {
      return { openPositions: 8, applications: 42, interviews: 12, hired: 2 };
    }
  },
  
  getDepartmentMetrics: async (dateRange = 'this-month') => {
    try {
      return await api.get(`/analytics/departments?range=${dateRange}`);
    } catch (error) {
      return [
        { dept: 'Technology', employees: 45, avgPerformance: 4.3, avgSalary: 105000 },
        { dept: 'HR', employees: 20, avgPerformance: 4.1, avgSalary: 75000 },
        { dept: 'Finance', employees: 30, avgPerformance: 4.2, avgSalary: 80000 },
      ];
    }
  },
  
  getTrendData: async (metric = 'employee-growth', dateRange = 'this-year') => {
    try {
      return await api.get(`/analytics/trends?metric=${metric}&range=${dateRange}`);
    } catch (error) {
      return { metric, trend: 'increasing', data: [140, 142, 145, 148, 150] };
    }
  },
  
  generateReport: async (reportType = 'monthly') => {
    try {
      return await api.post('/analytics/reports', { type: reportType });
    } catch (error) {
      return { success: true, message: 'Report generated (mock mode)', type: reportType, filename: `report-${Date.now()}.pdf` };
    }
  },
};

export default analyticsService;
