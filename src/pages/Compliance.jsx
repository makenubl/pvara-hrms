import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Plus, Filter, AlertCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Badge } from '../components/UI';
import complianceService from '../services/complianceService';
import { useAuthStore } from '../store/authStore';

const Compliance = () => {
  const [activeTab, setActiveTab] = useState('audits');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audits, setAudits] = useState([]);
  const [violations, setViolations] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const auditsData = await complianceService.getAudits();
      const auditsList = Array.isArray(auditsData) ? auditsData : auditsData.audits || [];
      setAudits(auditsList);

      const violationsData = await complianceService.getViolations('all');
      const violationsList = Array.isArray(violationsData) ? violationsData : violationsData.violations || [];
      setViolations(violationsList);

      const certsData = await complianceService.getCertifications();
      const certsList = Array.isArray(certsData) ? certsData : certsData.certifications || [];
      setCertifications(certsList);

      setStats({
        total: auditsList.length,
        completed: auditsList.filter(a => a.status === 'completed').length,
        pending: auditsList.filter(a => a.status === 'pending').length,
      });
    } catch (err) {
      setError(err.message || 'Failed to load compliance data');
    } finally {
      setLoading(false);
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Compliance Management
            </h1>
            <p className="text-slate-400 mt-2">Track audits, violations, and certifications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 overflow-hidden hover:border-blue-400/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <p className="relative text-slate-300 text-sm">Total Audits</p>
            <p className="relative text-2xl font-black text-white mt-1">{loading ? '-' : stats.total}</p>
          </div>
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 overflow-hidden hover:border-emerald-400/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <p className="relative text-slate-300 text-sm">Completed</p>
            <p className="relative text-2xl font-black text-white mt-1">{loading ? '-' : stats.completed}</p>
          </div>
          <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 overflow-hidden hover:border-red-400/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <p className="relative text-slate-300 text-sm">Violations</p>
            <p className="relative text-2xl font-black text-white mt-1">{loading ? '-' : violations.length}</p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-white/10">
          {['audits', 'violations', 'certifications'].map((tab) => (
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

        {activeTab === 'audits' && (
          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading audits...</p>
            ) : audits.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No audits found</p>
            ) : (
              audits.map((audit) => (
                <div key={audit._id || audit.id} className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{audit.name || audit.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{audit.description || 'Audit details'}</p>
                      <div className="flex gap-4 mt-3">
                        <div>
                          <p className="text-xs text-slate-400">Scope</p>
                          <p className="text-sm text-white font-semibold">{audit.scope || 'General'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Date</p>
                          <p className="text-sm text-white font-semibold">{audit.date || 'TBD'}</p>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      audit.status === 'completed' ? 'bg-emerald-500/30 border border-emerald-400/50 text-emerald-300' :
                      'bg-amber-500/30 border border-amber-400/50 text-amber-300'
                    }`}>
                      {audit.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'violations' && (
          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading violations...</p>
            ) : violations.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No violations found</p>
            ) : (
              violations.map((violation) => (
                <div key={violation._id || violation.id} className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-red-400/30 rounded-2xl p-6 hover:border-red-400/50 transition-all">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="text-red-400 flex-shrink-0 mt-1" size={24} />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{violation.type || 'Violation'}</h3>
                      <p className="text-sm text-slate-400 mt-1">{violation.description}</p>
                      <div className="flex gap-4 mt-3">
                        <div>
                          <p className="text-xs text-slate-400">Severity</p>
                          <p className="text-sm text-red-300 font-semibold">{violation.severity || 'High'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Reported</p>
                          <p className="text-sm text-white font-semibold">{violation.reportedDate || 'Today'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading certifications...</p>
            ) : certifications.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No certifications</p>
            ) : (
              certifications.map((cert) => (
                <div key={cert._id || cert.id} className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{cert.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">Expires: {cert.expiryDate}</p>
                    </div>
                    <CheckCircle className="text-emerald-400" size={24} />
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

export default Compliance;
