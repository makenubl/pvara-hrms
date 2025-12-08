import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  res.json([
    { _id: 'comp-1', type: 'data_protection', status: 'compliant', lastAudit: '2025-11-01' },
    { _id: 'comp-2', type: 'labor_laws', status: 'compliant', lastAudit: '2025-10-15' },
  ]);
});

router.get('/audits', authenticate, (req, res) => {
  res.json([{ _id: 'audit-1', status: 'completed', date: '2025-11-15', findings: 0 }]);
});

router.post('/audits', authenticate, (req, res) => {
  res.status(201).json({ success: true, data: { _id: `audit-${Date.now()}`, ...req.body } });
});

router.put('/audits/:id', authenticate, (req, res) => {
  res.json({ success: true, data: { _id: req.params.id, ...req.body } });
});

router.get('/certifications', authenticate, (req, res) => {
  res.json([{ _id: 'cert-1', name: 'ISO 9001', expiryDate: '2026-12-31', status: 'valid' }]);
});

router.put('/certifications/:id', authenticate, (req, res) => {
  res.json({ success: true, data: { _id: req.params.id, ...req.body } });
});

router.get('/status', authenticate, (req, res) => {
  res.json({ overall: 'compliant', score: 95, lastAudit: '2025-11-15' });
});

router.get('/violations', authenticate, (req, res) => {
  res.json([]);
});

export default router;
