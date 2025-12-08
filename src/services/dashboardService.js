import api from './api';

const dashboardService = {
  // Get dashboard metrics
  getMetrics: () => api.get('/dashboard/metrics'),
  
  // Get employee statistics
  getEmployeeStats: () => api.get('/dashboard/employees'),
  
  // Get attendance data
  getAttendanceData: (dateRange = 'this-month') => 
    api.get(`/dashboard/attendance?range=${dateRange}`),
  
  // Get performance data
  getPerformanceData: (dateRange = 'this-month') => 
    api.get(`/dashboard/performance?range=${dateRange}`),
  
  // Get pending approvals
  getPendingApprovals: () => api.get('/dashboard/pending-approvals'),
  
  // Get recent activities
  getRecentActivities: (limit = 10) => 
    api.get(`/dashboard/activities?limit=${limit}`),
  
  // Get department metrics
  getDepartmentMetrics: () => api.get('/dashboard/departments'),
};

export default dashboardService;
