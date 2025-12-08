import React, { useState, useEffect } from 'react';
import { Star, Target, TrendingUp, Plus, Filter, AlertCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Badge, Table, Input, Stat } from '../components/UI';
import performanceService from '../services/performanceService';
import { useAuthStore } from '../store/authStore';

const PerformanceManagement = () => {
  const [activeTab, setActiveTab] = useState('appraisals');
  const [dateRange, setDateRange] = useState('this-year');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appraisals, setAppraisals] = useState([]);
  const [goals, setGoals] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({ avgRating: 0, completed: 0, pending: 0 });
  const [showNewAppraisalModal, setShowNewAppraisalModal] = useState(false);
  const [formData, setFormData] = useState({ employeeId: '', rating: 5, comment: '' });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPerformanceData();
  }, [dateRange]);

  const fetchPerformanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const reviewsData = await performanceService.getReviews(null, dateRange);
      const reviewsList = Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews || [];
      setAppraisals(reviewsList);

      const goalsData = await performanceService.getGoals(null, 'all');
      const goalsList = Array.isArray(goalsData) ? goalsData : goalsData.goals || [];
      setGoals(goalsList);

      setFeedback(reviewsList.filter(r => r.feedback).slice(0, 5));

      // Calculate stats
      const completed = reviewsList.filter(r => r.status === 'completed').length;
      const pending = reviewsList.filter(r => r.status === 'pending').length;
      const avgRating = reviewsList.length > 0 
        ? (reviewsList.reduce((sum, a) => sum + (a.rating || 0), 0) / reviewsList.length).toFixed(1)
        : 0;

      setStats({ avgRating, completed, pending });
    } catch (err) {
      setError(err.message || 'Failed to load performance data');
      // Mock data fallback
      const mockAppraisals = [
        {
          _id: '1',
          employeeId: 'EMP001',
          name: 'John Doe',
          rating: 4.5,
          status: 'completed',
          evaluator: 'Sarah Williams',
          completedDate: '2025-12-05',
          comment: 'Excellent performance, strong leadership',
        },
        {
          _id: '2',
          employeeId: 'EMP002',
          name: 'Jane Smith',
          rating: 4.2,
          status: 'completed',
          evaluator: 'Michael Brown',
          completedDate: '2025-12-04',
          comment: 'Good work on the recent project',
        },
        {
          _id: '3',
          employeeId: 'EMP003',
          name: 'Bob Johnson',
          rating: 3.8,
          status: 'pending',
          evaluator: 'Sarah Williams',
          completedDate: null,
          comment: '',
        },
      ];
      setAppraisals(mockAppraisals);
      setStats({
        avgRating: (mockAppraisals.reduce((sum, a) => sum + a.rating, 0) / mockAppraisals.length).toFixed(1),
        completed: mockAppraisals.filter(a => a.status === 'completed').length,
        pending: mockAppraisals.filter(a => a.status === 'pending').length,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppraisal = async () => {
    try {
      await performanceService.createReview({
        ...formData,
        evaluatorId: user?.id,
      });
      setShowNewAppraisalModal(false);
      setFormData({ employeeId: '', rating: 5, comment: '' });
      fetchPerformanceData();
      alert('Appraisal created successfully');
    } catch (err) {
      alert('Failed to create appraisal: ' + err.message);
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
              Performance Management
            </h1>
            <p className="text-slate-400 mt-2">Track and evaluate employee performance</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white text-sm"
            >
              <option value="this-quarter" className="bg-slate-900">This Quarter</option>
              <option value="this-year" className="bg-slate-900">This Year</option>
              <option value="last-year" className="bg-slate-900">Last Year</option>
            </select>
            <Button onClick={() => setShowNewAppraisalModal(true)} className="flex items-center gap-2">
              <Plus size={20} />
              New Appraisal
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 overflow-hidden hover:border-amber-400/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Avg Rating</p>
                <p className="text-2xl font-black text-amber-300 mt-1">
                  {loading ? '-' : stats.avgRating}
                </p>
              </div>
              <Star className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 overflow-hidden hover:border-emerald-400/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Completed</p>
                <p className="text-2xl font-black text-emerald-300 mt-1">
                  {loading ? '-' : stats.completed}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 overflow-hidden hover:border-blue-400/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Pending</p>
                <p className="text-2xl font-black text-blue-300 mt-1">
                  {loading ? '-' : stats.pending}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* New Appraisal Modal */}
        {showNewAppraisalModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Create New Appraisal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Employee ID</label>
                  <input
                    type="text"
                    placeholder="EMP001"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Rating (1-5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="1" className="bg-slate-900">1 - Poor</option>
                    <option value="2" className="bg-slate-900">2 - Below Average</option>
                    <option value="3" className="bg-slate-900">3 - Average</option>
                    <option value="4" className="bg-slate-900">4 - Good</option>
                    <option value="5" className="bg-slate-900">5 - Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Comments</label>
                  <textarea
                    placeholder="Enter your feedback..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 min-h-24"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCreateAppraisal}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/50 text-sm font-semibold transition-all"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewAppraisalModal(false)}
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
          {['appraisals', 'goals', 'feedback'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm transition-all ${
                activeTab === tab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Appraisals Table */}
        {activeTab === 'appraisals' && (
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-white mb-4">Performance Appraisals</h3>
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading appraisals...</p>
            ) : appraisals.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No appraisals found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Employee</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Rating</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Evaluator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appraisals.map((appraisal) => (
                      <tr key={appraisal._id || appraisal.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-white">{appraisal.name}</p>
                            <p className="text-xs text-slate-400">{appraisal.employeeId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < Math.floor(appraisal.rating || 0) ? 'fill-amber-300 text-amber-300' : 'text-slate-500'}
                              />
                            ))}
                            <span className="text-white font-semibold ml-2">{appraisal.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            appraisal.status === 'completed' 
                              ? 'bg-emerald-500/30 border border-emerald-400/50 text-emerald-300'
                              : 'bg-amber-500/30 border border-amber-400/50 text-amber-300'
                          }`}>
                            {appraisal.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-200">{appraisal.evaluator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Goals Section */}
        {activeTab === 'goals' && (
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-white mb-4">Performance Goals</h3>
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading goals...</p>
            ) : goals.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No goals defined</p>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal._id || goal.id} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-white">{goal.title || goal.name}</p>
                        <p className="text-sm text-slate-300 mt-1">{goal.description || 'Q4 2025 Performance Goal'}</p>
                      </div>
                      <Badge variant={goal.status === 'completed' ? 'green' : 'blue'}>{goal.status || 'Active'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feedback Section */}
        {activeTab === 'feedback' && (
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-white mb-4">360 Feedback</h3>
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading feedback...</p>
            ) : feedback.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No feedback available</p>
            ) : (
              <div className="space-y-3">
                {feedback.map((item) => (
                  <div key={item._id || item.id} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-slate-300 mt-2">{item.comment || item.feedback || 'Feedback pending...'}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="text-xs text-slate-400">{item.completedDate || 'Pending'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PerformanceManagement;