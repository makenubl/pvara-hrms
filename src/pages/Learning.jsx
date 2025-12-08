import React, { useState } from 'react';
import { BookOpen, Award, CheckCircle, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { handleEnroll } from '../utils/handlers';
import { Card, Button, Badge, Table } from '../components/UI';
import { TRAINING_STATUS } from '../utils/constants';

const Learning = () => {
  const [activeTab, setActiveTab] = useState('programs');

  const [programs] = useState([
    {
      id: 1,
      title: 'AWS Solutions Architect Associate',
      provider: 'Amazon Web Services',
      duration: '40 hours',
      participants: 12,
      status: 'in_progress',
      startDate: '2025-12-01',
      endDate: '2026-03-31',
    },
    {
      id: 2,
      title: 'Advanced Leadership Skills',
      provider: 'LinkedIn Learning',
      duration: '20 hours',
      participants: 8,
      status: 'completed',
      startDate: '2025-10-01',
      endDate: '2025-11-30',
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      provider: 'Coursera',
      duration: '60 hours',
      participants: 15,
      status: 'not_started',
      startDate: '2026-01-15',
      endDate: '2026-06-30',
    },
  ]);

  const [enrollments] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      programTitle: 'AWS Solutions Architect Associate',
      enrolledDate: '2025-12-01',
      status: 'in_progress',
      progress: 65,
      completionDate: null,
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Jane Smith',
      programTitle: 'Advanced Leadership Skills',
      enrolledDate: '2025-10-01',
      status: 'completed',
      progress: 100,
      completionDate: '2025-11-28',
    },
  ]);

  return (
    <MainLayout>
      <div className="space-y-6 pb-6">
        {/* Header with gradient */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Learning & Development
            </h1>
            <p className="text-slate-400 mt-2">Manage training programs and employee development</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            New Program
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-gray-600 text-sm">Active Programs</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">8</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Total Enrollments</p>
            <p className="text-2xl font-bold text-green-600 mt-1">64</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">28</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">36</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: 'programs', label: 'Training Programs' },
            { id: 'enrollments', label: 'My Enrollments' },
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
        {activeTab === 'programs' && (
          <div className="grid grid-cols-1 gap-4">
            {programs.map((program) => (
              <Card key={program.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={20} className="text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-800">{program.title}</h3>
                      <Badge
                        variant={
                          program.status === 'in_progress'
                            ? 'blue'
                            : program.status === 'completed'
                            ? 'green'
                            : 'gray'
                        }
                      >
                        {program.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{program.provider}</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Duration: {program.duration}</span>
                      <span>Participants: {program.participants}</span>
                      <span>
                        {program.startDate} to {program.endDate}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary">
                    Enroll
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'enrollments' && (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-800">{enrollment.programTitle}</p>
                    <p className="text-sm text-gray-600">{enrollment.name}</p>
                  </div>
                  <Badge variant={enrollment.status === 'completed' ? 'green' : 'yellow'}>
                    {enrollment.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">{enrollment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <span>Enrolled: {enrollment.enrolledDate}</span>
                    {enrollment.completionDate && (
                      <span>Completed: {enrollment.completionDate}</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Learning;
