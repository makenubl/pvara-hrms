import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', authenticate, (req, res) => {
  res.json({ totalEmployees: 150, newJoinees: 3, separations: 1, avgSalary: 85000 });
});

router.get('/employees', authenticate, (req, res) => {
  res.json({ active: 145, inactive: 5, newHires: 3, promotions: 2 });
});

router.get('/attendance', authenticate, (req, res) => {
  res.json({ avgAttendance: 94.5, present: 1420, absent: 80, late: 30, workFromHome: 20 });
});

router.get('/payroll', authenticate, (req, res) => {
  res.json({ totalPayroll: 12750000, avgSalary: 85000, processed: 150, pending: 0 });
});

router.get('/recruitment', authenticate, (req, res) => {
  res.json({ openPositions: 8, applications: 42, interviews: 12, hired: 2 });
});

router.get('/departments', authenticate, (req, res) => {
  res.json([
    { dept: 'Technology', employees: 45, avgPerformance: 4.3, avgSalary: 105000 },
    { dept: 'HR', employees: 20, avgPerformance: 4.1, avgSalary: 75000 },
    { dept: 'Finance', employees: 30, avgPerformance: 4.2, avgSalary: 80000 },
  ]);
});

router.get('/trends', authenticate, (req, res) => {
  res.json({ metric: req.query.metric || 'employee-growth', trend: 'increasing', data: [140, 142, 145, 148, 150] });
});

router.post('/reports', authenticate, (req, res) => {
  res.json({ success: true, message: 'Report generated', type: req.body.type || 'monthly', filename: `report-${Date.now()}.pdf` });
});

export default router;
