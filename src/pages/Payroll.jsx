import React, { useState, useEffect } from 'react';
import { DollarSign, Download, Filter, Plus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { Button, Badge } from '../components/UI';
import payrollService from '../services/payrollService';
import { useAuthStore } from '../store/authStore';

const Payroll = () => {
  const [dateRange, setDateRange] = useState('this-month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payrolls, setPayrolls] = useState([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateData, setGenerateData] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPayrollData();
  }, [dateRange]);

  const fetchPayrollData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await payrollService.getPayrolls(null, dateRange);
      const payrollList = Array.isArray(data) ? data : data.records || [];
      setPayrolls(payrollList);
    } catch (err) {
      setError(err.message || 'Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayroll = async () => {
    // Validate month and year are selected
    if (!generateData.month || !generateData.year) {
      toast.error('Please select month and year');
      return;
    }

    try {
      await payrollService.generatePayroll(generateData.month, generateData.year, {});
      setShowGenerateModal(false);
      fetchPayrollData();
      toast.success('Payroll generated successfully');
    } catch (err) {
      toast.error('Failed to generate payroll: ' + err.message);
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
              Payroll Management
            </h1>
            <p className="text-slate-400 mt-2">Manage employee salaries and benefits</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white text-sm"
            >
              <option value="this-month" className="bg-slate-900">This Month</option>
              <option value="last-month" className="bg-slate-900">Last Month</option>
              <option value="this-quarter" className="bg-slate-900">This Quarter</option>
            </select>
            <Button onClick={() => setShowGenerateModal(true)} className="flex items-center gap-2">
              <Plus size={20} />
              Generate Payroll
            </Button>
          </div>
        </div>

        {showGenerateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Generate Payroll</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Month</label>
                  <select
                    value={generateData.month}
                    onChange={(e) => setGenerateData({ ...generateData, month: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i + 1} className="bg-slate-900">{new Date(2025, i, 1).toLocaleString('default', { month: 'long' })}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Year</label>
                  <input
                    type="number"
                    value={generateData.year}
                    onChange={(e) => setGenerateData({ ...generateData, year: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleGeneratePayroll}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/50 text-sm font-semibold transition-all"
                  >
                    Generate
                  </button>
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-500/20 border border-slate-400/30 text-slate-300 hover:border-slate-400/50 text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Payroll Records</h3>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-bold">
              {payrolls.length}
            </span>
          </div>

          {loading ? (
            <p className="text-slate-400 text-center py-8">Loading payroll records...</p>
          ) : payrolls.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No payroll records found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Employee</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Salary</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Deductions</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Net Amount</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((payroll) => (
                    <tr key={payroll._id || payroll.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-white">{payroll.employeeName}</p>
                          <p className="text-xs text-slate-400">{payroll.employeeId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white font-semibold">${(payroll.salary || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 text-white font-semibold">${(payroll.deductions || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 text-cyan-300 font-bold">${(payroll.netAmount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          payroll.status === 'processed' ? 'bg-emerald-500/30 border border-emerald-400/50 text-emerald-300' :
                          payroll.status === 'pending' ? 'bg-amber-500/30 border border-amber-400/50 text-amber-300' :
                          'bg-slate-500/30 border border-slate-400/50 text-slate-300'
                        }`}>
                          {payroll.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1">
                          <Download size={14} />
                          Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Payroll;
