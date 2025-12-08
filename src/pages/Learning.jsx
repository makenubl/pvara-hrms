import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Play, Users, Plus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { Button, Badge } from '../components/UI';
import learningService from '../services/learningService';
import { useAuthStore } from '../store/authStore';

const Learning = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollData, setEnrollData] = useState({ courseId: '' });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchLearningData();
  }, []);

  const fetchLearningData = async () => {
    setLoading(true);
    setError(null);
    try {
      const coursesData = await learningService.getCourses('all');
      const coursesList = Array.isArray(coursesData) ? coursesData : coursesData.courses || [];
      setCourses(coursesList);

      const enrollmentsData = await learningService.getEnrollments(user?.id);
      const enrollmentsList = Array.isArray(enrollmentsData) ? enrollmentsData : enrollmentsData.enrollments || [];
      setEnrollments(enrollmentsList);

      const certsData = await learningService.getCertifications(user?.id);
      const certsList = Array.isArray(certsData) ? certsData : certsData.certifications || [];
      setCertifications(certsList);
    } catch (err) {
      setError(err.message || 'Failed to load learning data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    // Validate courseId is selected
    if (!enrollData.courseId) {
      toast.error('Please select a course to enroll');
      return;
    }

    try {
      await learningService.enrollCourse(user?.id, enrollData.courseId);
      setShowEnrollModal(false);
      setEnrollData({ courseId: '' });
      fetchLearningData();
      toast.success('Enrolled successfully');
    } catch (err) {
      toast.error('Failed to enroll: ' + err.message);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-6">
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Learning & Development
            </h1>
            <p className="text-slate-400 mt-2">Explore courses and track certifications</p>
          </div>
          <Button onClick={() => setShowEnrollModal(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Enroll Course
          </Button>
        </div>

        {showEnrollModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Enroll in Course</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Select Course</label>
                  <select
                    value={enrollData.courseId}
                    onChange={(e) => setEnrollData({ ...enrollData, courseId: e.target.value })}
                    className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="" className="bg-slate-900">Choose a course...</option>
                    {courses.map((course) => (
                      <option key={course._id || course.id} value={course._id || course.id} className="bg-slate-900">
                        {course.title || course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleEnroll}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/50 text-sm font-semibold transition-all"
                  >
                    Enroll
                  </button>
                  <button
                    onClick={() => setShowEnrollModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-500/20 border border-slate-400/30 text-slate-300 hover:border-slate-400/50 text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 border-b border-white/10">
          {['courses', 'enrollments', 'certifications'].map((tab) => (
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

        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <p className="text-slate-400 col-span-full text-center py-8">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="text-slate-400 col-span-full text-center py-8">No courses available</p>
            ) : (
              courses.map((course) => (
                <div key={course._id || course.id} className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <BookOpen className="text-cyan-400" size={24} />
                    <Badge variant="blue">{course.category || 'General'}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white">{course.title || course.name}</h3>
                  <p className="text-sm text-slate-400 mt-2">{course.description || 'Course details'}</p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-slate-300">
                    <Users size={16} />
                    {course.enrolledCount || 0} enrolled
                  </div>
                  <button className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/50 text-sm font-semibold transition-all">
                    View Course
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'enrollments' && (
          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading enrollments...</p>
            ) : enrollments.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No enrollments yet</p>
            ) : (
              enrollments.map((enrollment) => (
                <div key={enrollment._id || enrollment.id} className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{enrollment.courseTitle || enrollment.courseName}</h3>
                      <p className="text-sm text-slate-400 mt-1">{enrollment.instructorName || 'Instructor'}</p>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-300">Progress</span>
                          <span className="text-xs font-semibold text-cyan-300">{enrollment.progress || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${enrollment.progress || 0}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 px-3 py-2 rounded-lg text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/50 text-xs font-semibold transition-all flex items-center gap-1">
                      <Play size={14} />
                      Continue
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <p className="text-slate-400 col-span-full text-center py-8">Loading certifications...</p>
            ) : certifications.length === 0 ? (
              <p className="text-slate-400 col-span-full text-center py-8">No certifications earned yet</p>
            ) : (
              certifications.map((cert) => (
                <div key={cert._id || cert.id} className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-amber-400/30 rounded-2xl p-6 hover:border-amber-400/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="text-amber-400" size={20} />
                        <span className="text-sm font-bold text-amber-300">Certified</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{cert.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">Earned: {cert.earnedDate || 'Today'}</p>
                      <p className="text-xs text-slate-500 mt-2">ID: {cert.certificateId || 'CERT-001'}</p>
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

export default Learning;
