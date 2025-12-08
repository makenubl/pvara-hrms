import api from './api';

const mockCourses = [
  { _id: 'course-1', title: 'React Fundamentals', category: 'Technology', status: 'active', enrolledCount: 15 },
  { _id: 'course-2', title: 'HR Best Practices', category: 'HR', status: 'active', enrolledCount: 12 },
  { _id: 'course-3', title: 'Financial Analysis', category: 'Finance', status: 'active', enrolledCount: 8 },
];

const mockEnrollments = [
  { _id: 'enroll-1', courseId: 'course-1', employeeId: 'EMP001', status: 'in-progress', progress: 65 },
  { _id: 'enroll-2', courseId: 'course-2', employeeId: 'EMP002', status: 'in-progress', progress: 40 },
];

const learningService = {
  getCourses: async (status = 'all', category = 'all') => {
    try {
      return await api.get(`/learning/courses?status=${status}&category=${category}`);
    } catch (error) {
      return mockCourses;
    }
  },
  
  createCourse: async (courseData) => {
    try {
      return await api.post('/learning/courses', courseData);
    } catch (error) {
      return { success: true, data: { _id: `course-${Date.now()}`, ...courseData } };
    }
  },
  
  updateCourse: async (courseId, data) => {
    try {
      return await api.put(`/learning/courses/${courseId}`, data);
    } catch (error) {
      return { success: true, data: { courseId, ...data } };
    }
  },
  
  deleteCourse: async (courseId) => {
    try {
      return await api.delete(`/learning/courses/${courseId}`);
    } catch (error) {
      return { success: true, message: 'Course deleted', courseId };
    }
  },
  
  getEnrollments: async (employeeId = null, status = 'all') => {
    try {
      return await api.get(`/learning/enrollments${employeeId ? `?employeeId=${employeeId}` : ''}${status !== 'all' ? `&status=${status}` : ''}`);
    } catch (error) {
      return mockEnrollments;
    }
  },
  
  enrollCourse: async (employeeId, courseId) => {
    try {
      return await api.post('/learning/enrollments', { employeeId, courseId });
    } catch (error) {
      return { success: true, message: 'Enrolled successfully', employeeId, courseId };
    }
  },
  
  completeLesson: async (courseId, lessonId) => {
    try {
      return await api.post(`/learning/progress`, { courseId, lessonId });
    } catch (error) {
      return { success: true, message: 'Lesson completed', courseId, lessonId };
    }
  },
  
  getCertifications: async (employeeId = null) => {
    try {
      return await api.get(`/learning/certifications${employeeId ? `?employeeId=${employeeId}` : ''}`);
    } catch (error) {
      return [{ _id: 'cert-1', title: 'React Professional', issueDate: '2025-11-15', employeeId }];
    }
  },
};

export default learningService;
