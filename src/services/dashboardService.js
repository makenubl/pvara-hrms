import api from './api';

const mockMetrics = {
  totalEmployees: 150,
  presentToday: 142,
  onLeave: 5,
  newJoinees: 3,
  avgAttendance: 94.5,
};

const dashboardService = {
  // Get dashboard metrics
  getMetrics: async () => {
    try {
      return await api.get('/dashboard/metrics');
    } catch (error) {
      return mockMetrics;
    }
  },
  
  // Get employee statistics
  getEmployeeStats: async () => {
    try {
      return await api.get('/dashboard/employees');
    } catch (error) {
      return { total: 150, byDepartment: { Technology: 45, HR: 20, Finance: 30, Marketing: 25, Sales: 30 } };
    }
  },
  
  // Get attendance data
  getAttendanceData: async (dateRange = 'this-month') => {
    try {
      return await api.get(`/dashboard/attendance?range=${dateRange}`);
    } catch (error) {
      return { present: 142, absent: 5, late: 3, workFromHome: 0, avgRate: 94.5 };
    }
  },
  
  // Get performance data
  getPerformanceData: async (dateRange = 'this-month') => {
    try {
      return await api.get(`/dashboard/performance?range=${dateRange}`);
    } catch (error) {
      return { highPerformers: 35, average: 85, needsImprovement: 30, avgRating: 4.1 };
    }
  },
  
  // Get pending approvals
  getPendingApprovals: async () => {
    try {
      return await api.get('/dashboard/pending-approvals');
    } catch (error) {
      return [
        { _id: 'appr-1', type: 'leave_request', employeeName: 'John Doe', date: '2025-12-08' },
        { _id: 'appr-2', type: 'salary_adjustment', employeeName: 'Jane Smith', date: '2025-12-07' },
      ];
    }
  },
  
  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    try {
      return await api.get(`/dashboard/activities?limit=${limit}`);
    } catch (error) {
      return [
        { _id: 'act-1', action: 'Employee joined', employee: 'New Hire', date: '2025-12-08' },
        { _id: 'act-2', action: 'Approval approved', employee: 'Manager', date: '2025-12-07' },
      ];
    }
  },
  
  // Get department metrics
  getDepartmentMetrics: async () => {
    try {
      return await api.get('/dashboard/departments');
    } catch (error) {
      return [
        { name: 'Technology', employees: 45, avgPerformance: 4.3 },
        { name: 'Human Resources', employees: 20, avgPerformance: 4.1 },
        { name: 'Finance', employees: 30, avgPerformance: 4.2 },
      ];
    }
  },
};

export default dashboardService;
