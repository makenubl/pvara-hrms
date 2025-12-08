import api from './api';

const performanceService = {
  getReviews: (employeeId = null, dateRange = 'this-year') => 
    api.get(`/performance/${employeeId ? employeeId + '/reviews' : 'reviews'}?range=${dateRange}`),
  
  createReview: (reviewData) => 
    api.post('/performance/reviews', reviewData),
  
  updateReview: (reviewId, data) => 
    api.put(`/performance/reviews/${reviewId}`, data),
  
  deleteReview: (reviewId) => 
    api.delete(`/performance/reviews/${reviewId}`),
  
  getMetrics: (employeeId = null, dateRange = 'this-year') => 
    api.get(`/performance/${employeeId ? employeeId + '/metrics' : 'metrics'}?range=${dateRange}`),
  
  getRatings: (employeeId = null) => 
    api.get(`/performance/${employeeId ? employeeId + '/ratings' : 'ratings'}`),
  
  getGoals: (employeeId = null, status = 'all') => 
    api.get(`/performance/${employeeId ? employeeId + '/goals' : 'goals'}?status=${status}`),
};

export default performanceService;
