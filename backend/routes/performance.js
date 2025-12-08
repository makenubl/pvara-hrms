import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get(['/reviews', '/:employeeId/reviews'], authenticate, (req, res) => {
  res.json([
    { _id: 'rev-1', employeeId: req.params.employeeId || 'EMP001', rating: 4.5, reviewer: 'Manager', date: '2025-11-15', comments: 'Excellent performance' },
  ]);
});

router.post('/reviews', authenticate, (req, res) => {
  res.status(201).json({ success: true, data: { _id: `rev-${Date.now()}`, ...req.body } });
});

router.put('/reviews/:id', authenticate, (req, res) => {
  res.json({ success: true, data: { _id: req.params.id, ...req.body } });
});

router.delete('/reviews/:id', authenticate, (req, res) => {
  res.json({ success: true, message: 'Review deleted', reviewId: req.params.id });
});

router.get(['/metrics', '/:employeeId/metrics'], authenticate, (req, res) => {
  res.json([
    { metric: 'Productivity', value: 85, target: 80 },
    { metric: 'Quality', value: 90, target: 85 },
  ]);
});

router.get(['/ratings', '/:employeeId/ratings'], authenticate, (req, res) => {
  res.json({ overall: 4.2, teamwork: 4.0, communication: 4.5 });
});

router.get(['/goals', '/:employeeId/goals'], authenticate, (req, res) => {
  res.json([
    { _id: 'goal-1', title: 'Complete React Course', status: 'in-progress', progress: 75 },
    { _id: 'goal-2', title: 'Improve Code Quality', status: 'in-progress', progress: 60 },
  ]);
});

export default router;
