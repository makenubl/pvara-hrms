import api from './api';

const learningService = {
  getCourses: (status = 'all', category = 'all') => 
    api.get(`/learning/courses?status=${status}&category=${category}`),
  
  createCourse: (courseData) => 
    api.post('/learning/courses', courseData),
  
  updateCourse: (courseId, data) => 
    api.put(`/learning/courses/${courseId}`, data),
  
  deleteCourse: (courseId) => 
    api.delete(`/learning/courses/${courseId}`),
  
  getEnrollments: (employeeId = null, status = 'all') => 
    api.get(`/learning/enrollments${employeeId ? `?employeeId=${employeeId}` : ''}${status !== 'all' ? `&status=${status}` : ''}`),
  
  enrollCourse: (employeeId, courseId) => 
    api.post('/learning/enrollments', { employeeId, courseId }),
  
  completeLesson: (courseId, lessonId) => 
    api.post(`/learning/progress`, { courseId, lessonId }),
  
  getCertifications: (employeeId = null) => 
    api.get(`/learning/certifications${employeeId ? `?employeeId=${employeeId}` : ''}`),
};

export default learningService;
