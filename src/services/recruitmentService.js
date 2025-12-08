import api from './api';

const recruitmentService = {
  getJobListings: (status = 'open', dateRange = 'all') => 
    api.get(`/recruitment/jobs?status=${status}&range=${dateRange}`),
  
  createJobListing: (jobData) => 
    api.post('/recruitment/jobs', jobData),
  
  updateJobListing: (jobId, data) => 
    api.put(`/recruitment/jobs/${jobId}`, data),
  
  deleteJobListing: (jobId) => 
    api.delete(`/recruitment/jobs/${jobId}`),
  
  getApplications: (jobId = null, status = 'all') => 
    api.get(`/recruitment/applications${jobId ? `?jobId=${jobId}` : ''}${status !== 'all' ? `&status=${status}` : ''}`),
  
  updateApplicationStatus: (appId, status) => 
    api.put(`/recruitment/applications/${appId}`, { status }),
  
  getCandidates: (status = 'all') => 
    api.get(`/recruitment/candidates?status=${status}`),
  
  scheduleInterview: (appId, data) => 
    api.post(`/recruitment/interviews`, { applicationId: appId, ...data }),
};

export default recruitmentService;
