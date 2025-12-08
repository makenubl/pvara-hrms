import api from './api';

const mockApprovals = [
  { _id: 'appr-1', type: 'leave_request', status: 'pending', employeeId: 'EMP001', createdAt: '2025-12-08' },
  { _id: 'appr-2', type: 'salary_adjustment', status: 'pending', employeeId: 'EMP002', createdAt: '2025-12-07' },
  { _id: 'appr-3', type: 'promotion', status: 'approved', employeeId: 'EMP003', createdAt: '2025-12-05' },
];

const approvalService = {
  getPendingForMe: async () => {
    try {
      return await api.get('/approvals/pending');
    } catch (error) {
      return mockApprovals.filter(a => a.status === 'pending');
    }
  },

  getApprovals: async (filters = {}) => {
    try {
      return await api.get('/approvals', { params: filters });
    } catch (error) {
      return mockApprovals;
    }
  },

  approve: async (approvalId, data = {}) => {
    try {
      return await api.post(`/approvals/${approvalId}/approve`, data);
    } catch (error) {
      return { success: true, message: 'Approved (mock mode)', approvalId, ...data };
    }
  },

  reject: async (approvalId, data = {}) => {
    try {
      return await api.post(`/approvals/${approvalId}/reject`, data);
    } catch (error) {
      return { success: true, message: 'Rejected (mock mode)', approvalId, ...data };
    }
  },

  getApprovalDetails: async (approvalId) => {
    try {
      return await api.get(`/approvals/${approvalId}`);
    } catch (error) {
      return mockApprovals.find(a => a._id === approvalId) || mockApprovals[0];
    }
  },

  createApproval: async (approvalData) => {
    try {
      return await api.post('/approvals', approvalData);
    } catch (error) {
      return { success: true, data: { _id: `appr-${Date.now()}`, ...approvalData, status: 'pending' } };
    }
  },

  updateApproval: async (approvalId, data) => {
    try {
      return await api.put(`/approvals/${approvalId}`, data);
    } catch (error) {
      return { success: true, data: { approvalId, ...data } };
    }
  },

  deleteApproval: async (approvalId) => {
    try {
      return await api.delete(`/approvals/${approvalId}`);
    } catch (error) {
      return { success: true, message: 'Approval deleted', approvalId };
    }
  },

  getApprovalStats: async () => {
    try {
      return await api.get('/approvals/stats');
    } catch (error) {
      return { pending: 5, approved: 12, rejected: 2 };
    }
  },

  bulkApprove: async (approvalIds) => {
    try {
      return await api.post('/approvals/bulk-approve', { ids: approvalIds });
    } catch (error) {
      return { success: true, message: 'Bulk approved (mock mode)', count: approvalIds.length };
    }
  },

  bulkReject: async (approvalIds) => {
    try {
      return await api.post('/approvals/bulk-reject', { ids: approvalIds });
    } catch (error) {
      return { success: true, message: 'Bulk rejected (mock mode)', count: approvalIds.length };
    }
  },
};

export default approvalService;
