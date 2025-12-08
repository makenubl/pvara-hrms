import React, { useState } from 'react';
import { Briefcase, MapPin, Users, Clock, Plus, Eye, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Badge, Table, Modal } from '../components/UI';
import { RECRUITMENT_STATUS, APPLICANT_STATUS } from '../utils/constants';

const Recruitment = () => {
  const [showJobModal, setShowJobModal] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');

  const [jobs] = useState([
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Technology',
      location: 'San Francisco, CA',
      salary: '$120K - $150K',
      status: 'open',
      applicants: 24,
      openedDate: '2025-11-15',
    },
    {
      id: 2,
      title: 'HR Manager',
      department: 'Human Resources',
      location: 'New York, NY',
      salary: '$80K - $100K',
      status: 'open',
      applicants: 12,
      openedDate: '2025-12-01',
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      salary: '$100K - $130K',
      status: 'closed',
      applicants: 45,
      openedDate: '2025-10-01',
    },
  ]);

  const [applicants] = useState([
    {
      id: 1,
      jobId: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      position: 'Senior Software Engineer',
      status: 'interview',
      appliedDate: '2025-12-05',
      rating: 4.5,
    },
    {
      id: 2,
      jobId: 1,
      name: 'Bob Williams',
      email: 'bob@example.com',
      position: 'Senior Software Engineer',
      status: 'screening',
      appliedDate: '2025-12-06',
      rating: 3.8,
    },
    {
      id: 3,
      jobId: 2,
      name: 'Carol Smith',
      email: 'carol@example.com',
      position: 'HR Manager',
      status: 'offer',
      appliedDate: '2025-12-02',
      rating: 4.8,
    },
  ]);

  const statusColors = {
    open: 'green',
    closed: 'red',
    on_hold: 'yellow',
    filled: 'blue',
  };

  const applicantStatusColors = {
    applied: 'blue',
    screening: 'yellow',
    interview: 'purple',
    offer: 'green',
    rejected: 'red',
    hired: 'green',
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-6">
        {/* Header with gradient */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Recruitment
            </h1>
            <p className="text-slate-400 mt-2">Manage job postings and applications</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            New Job
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-gray-600 text-sm">Open Positions</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">5</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Total Applicants</p>
            <p className="text-2xl font-bold text-green-600 mt-1">312</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">In Interview</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">18</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Offers Extended</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">4</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: 'jobs', label: 'Job Postings' },
            { id: 'applicants', label: 'Applicants' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                      <Badge variant={statusColors[job.status]}>{job.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        {job.applicants} applicants
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        Posted {job.openedDate}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{job.salary}</p>
                    <Button size="sm" variant="secondary" className="mt-2 flex items-center gap-1">
                      <Eye size={14} />
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'applicants' && (
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">Recent Applicants</h3>
            <div className="space-y-3">
              {applicants.map((applicant) => (
                <div key={applicant.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{applicant.name}</p>
                      <p className="text-sm text-gray-600">{applicant.position}</p>
                      <p className="text-xs text-gray-500">{applicant.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={applicantStatusColors[applicant.status]}>
                        {applicant.status}
                      </Badge>
                      <div className="flex items-center gap-1 mt-2 justify-end">
                        <Heart size={16} className="text-red-600" />
                        <span className="text-sm font-semibold">{applicant.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Recruitment;
