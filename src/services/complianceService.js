import api from './api';

const complianceService = {
  getCompliance: (type = 'all', dateRange = 'this-year') => 
    api.get(`/compliance?type=${type}&range=${dateRange}`),
  
  getAudits: (status = 'all') => 
    api.get(`/compliance/audits?status=${status}`),
  
  createAudit: (auditData) => 
    api.post('/compliance/audits', auditData),
  
  updateAudit: (auditId, data) => 
    api.put(`/compliance/audits/${auditId}`, data),
  
  getCertifications: () => 
    api.get('/compliance/certifications'),
  
  updateCertification: (certId, data) => 
    api.put(`/compliance/certifications/${certId}`, data),
  
  getComplianceStatus: () => 
    api.get('/compliance/status'),
  
  getViolations: (status = 'open') => 
    api.get(`/compliance/violations?status=${status}`),
};

export default complianceService;
