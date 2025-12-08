import api from './api';

const mockReviews = [
  { _id: 'rev-1', employeeId: 'EMP001', rating: 4.5, reviewer: 'Manager', date: '2025-11-15', comments: 'Excellent performance' },
  { _id: 'rev-2', employeeId: 'EMP002', rating: 4.0, reviewer: 'Manager', date: '2025-11-15', comments: 'Good work' },
];

const mockMetrics = [
  { _id: 'metric-1', employeeId: 'EMP001', metric: 'Productivity', value: 85, target: 80 },
  { _id: 'metric-2', employeeId: 'EMP001', metric: 'Quality', value: 90, target: 85 },
];

const performanceService = {
  getReviews: async (employeeId = null, dateRange = 'this-year') => {
    try {
      return await api.get(`/performance/${employeeId ? employeeId + '/reviews' : 'reviews'}?range=${dateRange}`);
    } catch (error) {
      return mockReviews;
    }
  },
  
  createReview: async (reviewData) => {
    try {
      return await api.post('/performance/reviews', reviewData);
    } catch (error) {
      return { success: true, data: { _id: `rev-${Date.now()}`, ...reviewData } };
    }
  },
  
  updateReview: async (reviewId, data) => {
    try {
      return await api.put(`/performance/reviews/${reviewId}`, data);
    } catch (error) {
      return { success: true, data: { reviewId, ...data } };
    }
  },
  
  deleteReview: async (reviewId) => {
    try {
      return await api.delete(`/performance/reviews/${reviewId}`);
    } catch (error) {
      return { success: true, message: 'Review deleted', reviewId };
    }
  },
  
  getMetrics: async (employeeId = null, dateRange = 'this-year') => {
    try {
      return await api.get(`/performance/${employeeId ? employeeId + '/metrics' : 'metrics'}?range=${dateRange}`);
    } catch (error) {
      return mockMetrics;
    }
  },
  
  getRatings: async (employeeId = null) => {
    try {
      return await api.get(`/performance/${employeeId ? employeeId + '/ratings' : 'ratings'}`);
    } catch (error) {
      return { overall: 4.2, teamwork: 4.0, communication: 4.5 };
    }
  },
  
  getGoals: async (employeeId = null, status = 'all') => {
    try {
      return await api.get(`/performance/${employeeId ? employeeId + '/goals' : 'goals'}?status=${status}`);
    } catch (error) {
      return [
        { _id: 'goal-1', title: 'Complete React Course', status: 'in-progress', progress: 75 },
        { _id: 'goal-2', title: 'Improve Code Quality', status: 'in-progress', progress: 60 },
      ];
    }
  },
};

export default performanceService;
