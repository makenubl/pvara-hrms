import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get(['/records', '/:employeeId'], authenticate, (req, res) => {
  const sample = [
    { _id: 'pay-1', employeeId: 'EMP001', month: 12, year: 2025, baseSalary: 120000, deductions: 15000, netSalary: 105000, status: 'processed' },
    { _id: 'pay-2', employeeId: 'EMP002', month: 12, year: 2025, baseSalary: 85000, deductions: 10000, netSalary: 75000, status: 'processed' },
  ];
  const filtered = req.params.employeeId ? sample.filter((p) => p.employeeId === req.params.employeeId) : sample;
  res.json(filtered);
});

router.post('/generate', authenticate, (req, res) => {
  res.json({ success: true, message: 'Payroll generated', data: req.body });
});

router.post('/:payrollId/process', authenticate, (req, res) => {
  res.json({ success: true, message: 'Payroll processed', payrollId: req.params.payrollId, data: req.body });
});

router.get('/:employeeId/salary-structure', authenticate, (req, res) => {
  res.json({ baseSalary: 100000, allowances: 5000, deductions: 5000, employeeId: req.params.employeeId });
});

router.put('/:employeeId/salary-structure', authenticate, (req, res) => {
  res.json({ success: true, message: 'Salary structure updated', employeeId: req.params.employeeId, data: req.body });
});

router.get(['/deductions', '/:payrollId/deductions'], authenticate, (req, res) => {
  res.json({ tax: 5000, insurance: 3000, pension: 2000 });
});

router.get(['/benefits', '/:employeeId/benefits'], authenticate, (req, res) => {
  res.json({ health: 2000, retirement: 3000, vacation: 1500 });
});

router.get('/:payrollId/payslip', authenticate, (req, res) => {
  res.json({ success: true, message: 'Payslip generated', payrollId: req.params.payrollId });
});

export default router;
