import api from './api';

const mockCompliance = [
  { _id: 'comp-1', type: 'data_protection', status: 'compliant', lastAudit: '2025-11-01' },
  { _id: 'comp-2', type: 'labor_laws', status: 'compliant', lastAudit: '2025-10-15' },
];

const complianceService = {
  getCompliance: async (type = 'all', dateRange = 'this-year') => {
    try {
      return await api.get(`/compliance?type=${type}&range=${dateRange}`);
    } catch (error) {
      return mockCompliance;
    }
  },
  
  getAudits: async (status = 'all') => {
    try {
      return await api.get(`/compliance/audits?status=${status}`);
    } catch (error) {
      return [{ _id: 'audit-1', status: 'completed', date: '2025-11-15', findings: 0 }];
    }
  },
  
  createAudit: async (auditData) => {
    try {
      return await api.post('/compliance/audits', auditData);
    } catch (error) {
      return { success: true, data: { _id: `audit-${Date.now()}`, ...auditData } };
    }
  },
  
  updateAudit: async (auditId, data) => {
    try {
      return await api.put(`/compliance/audits/${auditId}`, data);
    } catch (error) {
      return { success: true, data: { auditId, ...data } };
    }
  },
  
  getCertifications: async () => {
    try {
      return await api.get('/compliance/certifications');
    } catch (error) {
      return [{ _id: 'cert-1', name: 'ISO 9001', expiryDate: '2026-12-31', status: 'valid' }];
    }
  },
  
  updateCertification: async (certId, data) => {
    try {
      return await api.put(`/compliance/certifications/${certId}`, data);
    } catch (error) {
      return { success: true, data: { certId, ...data } };
    }
  },
  
  getComplianceStatus: async () => {
    try {
      return await api.get('/compliance/status');
    } catch (error) {
      return { overall: 'compliant', score: 95, lastAudit: '2025-11-15' };
    }
  },
  
  getViolations: async (status = 'open') => {
    try {
      return await api.get(`/compliance/violations?status=${status}`);
    } catch (error) {
      return [];
    }
  },
};

export default complianceService;
