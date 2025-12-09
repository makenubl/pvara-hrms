// Vercel serverless entry point (ESM)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';

import authRoutes from '../routes/auth.js';
import employeeRoutes from '../routes/employees.js';
import positionRoutes from '../routes/positions.js';
import approvalRoutes from '../routes/approvals.js';
import attendanceRoutes from '../routes/attendance.js';
import payrollRoutes from '../routes/payroll.js';
import learningRoutes from '../routes/learning.js';
import performanceRoutes from '../routes/performance.js';
import recruitmentRoutes from '../routes/recruitment.js';
import complianceRoutes from '../routes/compliance.js';
import dashboardRoutes from '../routes/dashboard.js';
import analyticsRoutes from '../routes/analytics.js';
import seedDevData from '../seed/devSeed.js';

dotenv.config();

const app = express();

// Connect to DB and seed (await connection before seeding)
(async () => {
  try {
    await connectDB();
    console.log('[Vercel] DB connected, running seed...');
    await seedDevData();
    console.log('[Vercel] Seed complete');
  } catch (err) {
    console.error('[Vercel] Init error:', err);
  }
})();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
