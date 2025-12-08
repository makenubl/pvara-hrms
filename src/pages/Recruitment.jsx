import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Users, Clock, Plus, Eye, Heart, AlertCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Badge } from '../components/UI';
import recruitmentService from '../services/recruitmentService';
import { useAuthStore } from '../store/authStore';

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [jobFormData, setJobFormData] = useState({ title: '', department: '', location: '', description: '' });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchRecruitmentData();
  }, []);

  const fetchRecruitmentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobsData = await recruitmentService.getJobListings('open');
      const jobsList = Array.isArray(jobsData) ? jobsData : jobsData.jobs || [];
      setJobs(jobsList);

      const applicantsData = await recruitmentService.getApplications();
      const applicantsList = Array.isArray(applicantsData) ? applicantsData : applicantsData.applications || [];
      setApplicants(applicantsList.slice(0, 10));
    } catch (err) {
      setError(err.message || 'Failed to load recruitment data');
      // Fallback mock data
      setJobs([
        {
          _id: '1',
          title: 'Senior React Developer',
          department: 'Engineering',
          location: 'Remote',
          postedDate: '2025-11-20',
          applicants: 24,
          status: 'open',
        },
        {
          _id: '2',
          title: 'UX/UI Designer',
          department: 'Design',
          location: 'New York',
          postedDate: '2025-11-25',
          applicants: 18,
          status: 'open',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    // Validate required fields
    if (!jobFormData.title || !jobFormData.department || !jobFormData.location) {
      toast.error('Please fill in title, department, and location');
      return;
    }

    try {
      await recruitmentService.createJobListing({
        ...jobFormData,
        createdBy: user?.id,
      });
      setShowNewJobModal(false);
      setJobFormData({ title: '', department: '', location: '', description: '' });
      fetchRecruitmentData();
      toast.success('Job listing created successfully');
    } catch (err) {
      toast.error('Failed to create job: ' + err.message);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-6 text-slate-100">
        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Recruitment
            </h1>
            <p className="text-slate-400 mt-2">Manage job openings and applicants</p>
          </div>
          <Button onClick={() => setShowNewJobModal(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Post Job
          </Button>
        </div>

        {/* New Job Modal */}
        {showNewJobModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Post New Job</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={jobFormData.title}
                  onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={jobFormData.department}
                  onChange={(e) => setJobFormData({ ...jobFormData, department: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={jobFormData.location}
                  onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400"
                />
                <textarea
                  placeholder="Job Description"
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 min-h-20"
                />
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCreateJob}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/50 text-sm font-semibold transition-all"
                  >
                    Post
                  </button>
                  <button
                    onClick={() => setShowNewJobModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-500/20 border border-slate-400/30 text-slate-300 hover:border-slate-400/50 text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10">
          {['jobs', 'applicants'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm transition-all ${
                activeTab === tab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab === 'jobs' ? 'Open Positions' : 'Applications'}
            </button>
          ))}
        </div>

        {/* Open Positions */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading positions...</p>
            ) : jobs.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No open positions</p>
            ) : (
              jobs.map((job) => (
                <div key={job._id || job.id} className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Briefcase size={16} />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <MapPin size={16} />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Clock size={16} />
                          {job.postedDate}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-slate-300">{job.description || 'View full details for more information'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-xl px-4 py-2 text-center">
                        <p className="text-xs text-cyan-300 font-semibold">Applications</p>
                        <p className="text-2xl font-black text-cyan-400">{job.applicants || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Applications */}
        {activeTab === 'applicants' && (
          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading applications...</p>
            ) : applicants.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No applications</p>
            ) : (
              applicants.map((app) => (
                <div key={app._id || app.id} className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{app.name || app.applicantName}</h3>
                      <p className="text-sm text-slate-400 mt-1">{app.jobTitle}</p>
                      <div className="flex gap-4 mt-3">
                        <div>
                          <p className="text-xs text-slate-400">Applied</p>
                          <p className="text-sm text-white font-semibold">{app.appliedDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Email</p>
                          <p className="text-sm text-white font-semibold">{app.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        app.status === 'interview' ? 'bg-blue-500/30 border border-blue-400/50 text-blue-300' :
                        app.status === 'shortlisted' ? 'bg-emerald-500/30 border border-emerald-400/50 text-emerald-300' :
                        app.status === 'rejected' ? 'bg-red-500/30 border border-red-400/50 text-red-300' :
                        'bg-amber-500/30 border border-amber-400/50 text-amber-300'
                      }`}>
                        {app.status}
                      </span>
                      <button className="px-3 py-1 rounded-lg text-xs font-semibold text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/50 transition-all">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Recruitment;
