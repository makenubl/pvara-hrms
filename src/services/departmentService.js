import apiClient from './api';

const departmentService = {
  // Get all departments
  getAll: async () => {
    try {
      const response = await apiClient.get('/departments');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch departments' };
    }
  },

  // Create a new department
  create: async (departmentData) => {
    try {
      const response = await apiClient.post('/departments', departmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create department' };
    }
  },

  // Update a department
  update: async (id, departmentData) => {
    try {
      const response = await apiClient.put(`/departments/${id}`, departmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update department' };
    }
  },

  // Delete a department
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete department' };
    }
  },

  // Get department statistics
  getStats: async () => {
    try {
      const response = await apiClient.get('/departments/stats/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch statistics' };
    }
  },
};

export default departmentService;
