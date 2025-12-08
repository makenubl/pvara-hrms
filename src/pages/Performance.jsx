import React, { useState } from 'react';
import { Star, Target, TrendingUp, Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Badge, Table, Modal, Input, Stat } from '../components/UI';
import { PERFORMANCE_RATING, APPRAISAL_STATUS } from '../utils/constants';

const PerformanceManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('appraisals'); // appraisals, goals, feedback

  const [appraisals] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      period: '2025 Q4',
      status: 'completed',
      rating: 4,
      ratedBy: 'Sarah Williams',
      ratedDate: '2025-12-05',
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Jane Smith',
      period: '2025 Q4',
      status: 'completed',
      rating: 5,
      ratedBy: 'Sarah Williams',
      ratedDate: '2025-12-03',
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Bob Johnson',
      period: '2025 Q4',
      status: 'pending',
      rating: null,
      ratedBy: 'Sarah Williams',
      ratedDate: null,
    },
  ]);

  const [goals] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      goal: 'Complete AWS certification',
      target: '2026-03-31',
      progress: 75,
      status: 'in_progress',
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Jane Smith',
      goal: 'Improve team retention by 15%',
      target: '2026-06-30',
      progress: 40,
      status: 'in_progress',
    },
  ]);

  const [feedbacks] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      givenBy: 'Michael Brown',
      feedback: 'Excellent technical skills and collaborative approach',
      rating: 4.5,
      type: '360_feedback',
    },
    {
      id: 2,
      employeeId: 'EMP001',
      name: 'John Doe',
      givenBy: 'Sarah Williams',
      feedback: 'Strong leadership qualities and mentoring abilities',
      rating: 4,
      type: '360_feedback',
    },
  ]);

  const ratingColors = {
    5: 'bg-green-100 text-green-800',
    4: 'bg-blue-100 text-blue-800',
    3: 'bg-yellow-100 text-yellow-800',
    2: 'bg-orange-100 text-orange-800',
    1: 'bg-red-100 text-red-800',
  };

  const appraisalColumns = [
    {
      key: 'name',
      label: 'Employee',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{row.employeeId}</p>
        </div>
      ),
    },
    {
      key: 'period',
      label: 'Period',
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value) =>
        value ? (
          <div className="flex items-center gap-1">
            {[...Array(value)].map((_, i) => (
              <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        ) : (
          <span className="text-gray-500">Pending</span>
        ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'completed' ? 'green' : 'yellow'}>{value}</Badge>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Performance Management</h1>
            <p className="text-gray-600">Appraisals, goals, and 360-degree feedback</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            New Appraisal
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat
            icon={TrendingUp}
            label="Avg Rating"
            value="4.2/5"
            trend="↑ 0.3 this quarter"
            trendUp={true}
          />
          <Stat
            icon={Star}
            label="Completed"
            value="156"
            trend="89% completion"
            trendUp={true}
          />
          <Stat
            icon={Target}
            label="Active Goals"
            value="324"
            trend="75% on track"
            trendUp={true}
          />
          <Stat
            label="360 Feedbacks"
            value="92"
            trend="This quarter"
            trendUp={true}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: 'appraisals', label: 'Appraisals' },
            { id: 'goals', label: 'Goals & OKRs' },
            { id: 'feedback', label: '360 Feedback' },
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
        {activeTab === 'appraisals' && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Performance Appraisals</h3>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <Table columns={appraisalColumns} data={appraisals} />
          </Card>
        )}

        {activeTab === 'goals' && (
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">Goals & OKRs</h3>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-800">{goal.name}</p>
                      <p className="text-sm text-gray-600">{goal.goal}</p>
                    </div>
                    <Badge variant={goal.status === 'in_progress' ? 'blue' : 'green'}>
                      {goal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-sm font-semibold text-gray-800">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Target: {goal.target}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'feedback' && (
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">360-Degree Feedback</h3>
            <div className="space-y-4">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{fb.name}</p>
                      <p className="text-sm text-gray-600">From: {fb.givenBy}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-yellow-600">{fb.rating}/5</p>
                      <div className="flex gap-1 justify-end mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < Math.round(fb.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">{fb.feedback}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default PerformanceManagement;
