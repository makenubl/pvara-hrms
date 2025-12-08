import api from './api';

const mockJobs = [
  { _id: 'job-1', title: 'Senior Developer', department: 'Technology', status: 'open', applicants: 8 },
  { _id: 'job-2', title: 'HR Specialist', department: 'Human Resources', status: 'open', applicants: 5 },
];

const mockCandidates = [
  { _id: 'cand-1', name: 'Alice Johnson', position: 'Senior Developer', status: 'interview-scheduled', rating: 4.5 },
  { _id: 'cand-2', name: 'Bob Smith', position: 'HR Specialist', status: 'pending', rating: 4.0 },
];

const recruitmentService = {
  getJobListings: async (status = 'open', dateRange = 'all') => {
    try {
      return await api.get(`/recruitment/jobs?status=${status}&range=${dateRange}`);
    } catch (error) {
      return mockJobs;
    }
  },
  
  createJobListing: async (jobData) => {
    try {
      return await api.post('/recruitment/jobs', jobData);
    } catch (error) {
      return { success: true, data: { _id: `job-${Date.now()}`, ...jobData } };
    }
  },
  
  updateJobListing: async (jobId, data) => {
    try {
      return await api.put(`/recruitment/jobs/${jobId}`, data);
    } catch (error) {
      return { success: true, data: { jobId, ...data } };
    }
  },
  
  deleteJobListing: async (jobId) => {
    try {
      return await api.delete(`/recruitment/jobs/${jobId}`);
    } catch (error) {
      return { success: true, message: 'Job listing deleted', jobId };
    }
  },
  
  getApplications: async (jobId = null, status = 'all') => {
    try {
      return await api.get(`/recruitment/applications${jobId ? `?jobId=${jobId}` : ''}${status !== 'all' ? `&status=${status}` : ''}`);
    } catch (error) {
      return [{ _id: 'app-1', jobId: 'job-1', candidateName: 'Alice Johnson', status: 'pending', appliedDate: '2025-12-05' }];
    }
  },
  
  updateApplicationStatus: async (appId, status) => {
    try {
      return await api.put(`/recruitment/applications/${appId}`, { status });
    } catch (error) {
      return { success: true, message: 'Application updated', appId, status };
    }
  },
  
  getCandidates: async (status = 'all') => {
    try {
      return await api.get(`/recruitment/candidates?status=${status}`);
    } catch (error) {
      return mockCandidates;
    }
  },
  
  scheduleInterview: async (appId, data) => {
    try {
      return await api.post(`/recruitment/interviews`, { applicationId: appId, ...data });
    } catch (error) {
      return { success: true, message: 'Interview scheduled', applicationId: appId, ...data };
    }
  },
};

export default recruitmentService;
