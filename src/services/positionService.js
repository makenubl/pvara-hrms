import api from './api';

const positionService = {
  getPositions: (filters = {}) =>
    api.get('/positions', { params: filters }),

  getPosition: (positionId) =>
    api.get(`/positions/${positionId}`),

  createPosition: (positionData) =>
    api.post('/positions', positionData),

  updatePosition: (positionId, data) =>
    api.put(`/positions/${positionId}`, data),

  deletePosition: (positionId) =>
    api.delete(`/positions/${positionId}`),

  getPositionsByDepartment: (departmentId) =>
    api.get(`/positions?department=${departmentId}`),

  getPositionLevels: () =>
    api.get('/positions/levels'),

  getPositionSalaryRange: (positionId) =>
    api.get(`/positions/${positionId}/salary-range`),

  updatePositionSalaryRange: (positionId, data) =>
    api.put(`/positions/${positionId}/salary-range`, data),
};

export default positionService;
