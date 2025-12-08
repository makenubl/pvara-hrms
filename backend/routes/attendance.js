import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Simple in-memory mock dataset per company (keyed by company id)
const attendanceStore = new Map();

const buildSampleRecords = (companyId) => {
  if (attendanceStore.has(companyId)) return attendanceStore.get(companyId);
  const today = new Date();
  const statuses = ['present', 'absent', 'late', 'work_from_home'];
  const records = Array.from({ length: 10 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return {
      _id: `att-${companyId}-${i}`,
      employeeId: `EMP${String(i + 1).padStart(3, '0')}`,
      name: `Employee ${i + 1}`,
      date: d.toISOString().slice(0, 10),
      status: statuses[i % statuses.length],
      checkIn: i % 3 === 0 ? null : '09:00 AM',
      checkOut: i % 3 === 0 ? null : '05:30 PM',
      department: ['Technology', 'HR', 'Finance', 'Marketing'][i % 4],
    };
  });
  attendanceStore.set(companyId, records);
  return records;
};

// Mark attendance
router.post('/mark', authenticate, (req, res) => {
  const companyId = req.user.company?._id || req.user.company || 'default';
  const records = buildSampleRecords(companyId);
  const newRecord = {
    _id: `att-${companyId}-${Date.now()}`,
    ...req.body,
  };
  records.unshift(newRecord);
  attendanceStore.set(companyId, records);
  res.json({ success: true, data: newRecord });
});

// Get attendance records (optional employeeId)
router.get(['/records', '/:employeeId/records'], authenticate, (req, res) => {
  const { range } = req.query; // range is currently unused in stub
  const companyId = req.user.company?._id || req.user.company || 'default';
  const records = buildSampleRecords(companyId);
  const employeeId = req.params.employeeId;
  const filtered = employeeId ? records.filter((r) => r.employeeId === employeeId) : records;
  res.json(filtered);
});

// Get attendance by date
router.get('/date/:date', authenticate, (req, res) => {
  const companyId = req.user.company?._id || req.user.company || 'default';
  const records = buildSampleRecords(companyId);
  const byDate = records.filter((r) => r.date === req.params.date);
  res.json(byDate);
});

// Update attendance
router.put('/:id', authenticate, (req, res) => {
  const companyId = req.user.company?._id || req.user.company || 'default';
  const records = buildSampleRecords(companyId).map((r) => (r._id === req.params.id ? { ...r, ...req.body } : r));
  attendanceStore.set(companyId, records);
  const updated = records.find((r) => r._id === req.params.id);
  if (!updated) return res.status(404).json({ message: 'Record not found' });
  res.json(updated);
});

// Delete attendance
router.delete('/:id', authenticate, (req, res) => {
  const companyId = req.user.company?._id || req.user.company || 'default';
  const records = buildSampleRecords(companyId).filter((r) => r._id !== req.params.id);
  attendanceStore.set(companyId, records);
  res.json({ success: true, id: req.params.id });
});

// Attendance stats (optional employeeId)
router.get(['/stats', '/:employeeId/stats'], authenticate, (req, res) => {
  const companyId = req.user.company?._id || req.user.company || 'default';
  const records = buildSampleRecords(companyId);
  const employeeId = req.params.employeeId;
  const filtered = employeeId ? records.filter((r) => r.employeeId === employeeId) : records;
  const stats = {
    present: filtered.filter((r) => r.status === 'present').length,
    absent: filtered.filter((r) => r.status === 'absent').length,
    late: filtered.filter((r) => r.status === 'late').length,
    workFromHome: filtered.filter((r) => r.status === 'work_from_home').length,
  };
  res.json(stats);
});

export default router;
