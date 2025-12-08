import api from './api';

const approvalService = {
  getPendingForMe: () =>
    api.get('/approvals/pending'),

  getApprovals: (filters = {}) =>
    api.get('/approvals', { params: filters }),

  approve: (approvalId, data = {}) =>
    api.post(`/approvals/${approvalId}/approve`, data),

  reject: (approvalId, data = {}) =>
    api.post(`/approvals/${approvalId}/reject`, data),

  getApprovalDetails: (approvalId) =>
    api.get(`/approvals/${approvalId}`),

  createApproval: (approvalData) =>
    api.post('/approvals', approvalData),

  updateApproval: (approvalId, data) =>
    api.put(`/approvals/${approvalId}`, data),

  deleteApproval: (approvalId) =>
    api.delete(`/approvals/${approvalId}`),

  getApprovalStats: () =>
    api.get('/approvals/stats'),

  bulkApprove: (approvalIds) =>
    api.post('/approvals/bulk-approve', { ids: approvalIds }),

  bulkReject: (approvalIds) =>
    api.post('/approvals/bulk-reject', { ids: approvalIds }),
};

export default approvalService;
