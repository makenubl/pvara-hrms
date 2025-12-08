import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/metrics', authenticate, (req, res) => {
  res.json({ totalEmployees: 150, presentToday: 142, onLeave: 5, newJoinees: 3, avgAttendance: 94.5 });
});

router.get('/employees', authenticate, (req, res) => {
  res.json({ total: 150, byDepartment: { Technology: 45, HR: 20, Finance: 30, Marketing: 25, Sales: 30 } });
});

router.get('/attendance', authenticate, (req, res) => {
  res.json({ present: 142, absent: 5, late: 3, workFromHome: 0, avgRate: 94.5 });
});

router.get('/performance', authenticate, (req, res) => {
  res.json({ highPerformers: 35, average: 85, needsImprovement: 30, avgRating: 4.1 });
});

router.get('/pending-approvals', authenticate, (req, res) => {
  res.json([
    { _id: 'appr-1', type: 'leave_request', employeeName: 'John Doe', date: '2025-12-08' },
    { _id: 'appr-2', type: 'salary_adjustment', employeeName: 'Jane Smith', date: '2025-12-07' },
  ]);
});

router.get('/activities', authenticate, (req, res) => {
  res.json([
    { _id: 'act-1', action: 'Employee joined', employee: 'New Hire', date: '2025-12-08' },
    { _id: 'act-2', action: 'Approval approved', employee: 'Manager', date: '2025-12-07' },
  ]);
});

router.get('/departments', authenticate, (req, res) => {
  res.json([
    { name: 'Technology', employees: 45, avgPerformance: 4.3 },
    { name: 'Human Resources', employees: 20, avgPerformance: 4.1 },
    { name: 'Finance', employees: 30, avgPerformance: 4.2 },
  ]);
});

export default router;
