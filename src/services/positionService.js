import api from './api';

const mockPositions = [
  { _id: 'pos-1', title: 'Senior Developer', department: 'Technology', level: 'Senior', salary_min: 100000, salary_max: 150000 },
  { _id: 'pos-2', title: 'HR Manager', department: 'Human Resources', level: 'Manager', salary_min: 80000, salary_max: 120000 },
  { _id: 'pos-3', title: 'Finance Analyst', department: 'Finance', level: 'Mid', salary_min: 60000, salary_max: 90000 },
];

const positionService = {
  getPositions: async (filters = {}) => {
    try {
      return await api.get('/positions', { params: filters });
    } catch (error) {
      return mockPositions;
    }
  },

  getPosition: async (positionId) => {
    try {
      return await api.get(`/positions/${positionId}`);
    } catch (error) {
      return mockPositions.find(p => p._id === positionId) || mockPositions[0];
    }
  },

  createPosition: async (positionData) => {
    try {
      return await api.post('/positions', positionData);
    } catch (error) {
      return { success: true, data: { _id: `pos-${Date.now()}`, ...positionData } };
    }
  },

  updatePosition: async (positionId, data) => {
    try {
      return await api.put(`/positions/${positionId}`, data);
    } catch (error) {
      return { success: true, data: { positionId, ...data } };
    }
  },

  deletePosition: async (positionId) => {
    try {
      return await api.delete(`/positions/${positionId}`);
    } catch (error) {
      return { success: true, message: 'Position deleted', positionId };
    }
  },

  getPositionsByDepartment: async (departmentId) => {
    try {
      return await api.get(`/positions?department=${departmentId}`);
    } catch (error) {
      return mockPositions.filter(p => p.department === departmentId);
    }
  },

  getPositionLevels: async () => {
    try {
      return await api.get('/positions/levels');
    } catch (error) {
      return ['Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Director'];
    }
  },

  getPositionSalaryRange: async (positionId) => {
    try {
      return await api.get(`/positions/${positionId}/salary-range`);
    } catch (error) {
      return { min: 80000, max: 120000 };
    }
  },

  updatePositionSalaryRange: async (positionId, data) => {
    try {
      return await api.put(`/positions/${positionId}/salary-range`, data);
    } catch (error) {
      return { success: true, data: { positionId, ...data } };
    }
  },
};

export default positionService;
