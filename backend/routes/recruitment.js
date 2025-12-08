import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/jobs', authenticate, (req, res) => {
  res.json([
    { _id: 'job-1', title: 'Senior Developer', department: 'Technology', status: 'open', applicants: 8 },
    { _id: 'job-2', title: 'HR Specialist', department: 'Human Resources', status: 'open', applicants: 5 },
  ]);
});

router.post('/jobs', authenticate, (req, res) => {
  res.status(201).json({ _id: `job-${Date.now()}`, ...req.body });
});

router.put('/jobs/:id', authenticate, (req, res) => {
  res.json({ _id: req.params.id, ...req.body });
});

router.delete('/jobs/:id', authenticate, (req, res) => {
  res.json({ success: true });
});

router.get('/applications', authenticate, (req, res) => {
  res.json([
    { _id: 'app-1', jobId: 'job-1', candidateName: 'Alice Johnson', status: 'pending', appliedDate: '2025-12-05' },
  ]);
});

router.put('/applications/:id', authenticate, (req, res) => {
  res.json({ success: true, applicationId: req.params.id, status: req.body.status });
});

router.get('/candidates', authenticate, (req, res) => {
  res.json([
    { _id: 'cand-1', name: 'Alice Johnson', position: 'Senior Developer', status: 'interview-scheduled', rating: 4.5 },
  ]);
});

router.post('/interviews', authenticate, (req, res) => {
  res.status(201).json({ success: true, message: 'Interview scheduled', data: req.body });
});

export default router;
