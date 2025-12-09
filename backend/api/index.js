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

// Initialize DB connection and seed
let dbInitialized = false;
const initDB = async () => {
  if (dbInitialized) return;
  try {
    await connectDB();
    console.log('[Vercel] DB connected, running seed...');
    await seedDevData();
    console.log('[Vercel] Seed complete');
    dbInitialized = true;
  } catch (err) {
    console.error('[Vercel] Init error:', err);
    throw err;
  }
};

// Initialize on module load
initDB().catch(console.error);

// Middleware
app.use(cors({
  origin: [
    'https://pvara.team',
    'https://www.pvara.team',
    'https://pvara-hrms-prod-v2.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Ensure DB is initialized before handling requests
app.use(async (req, res, next) => {
  try {
    await initDB();
    next();
  } catch (err) {
    console.error('[Vercel] DB init failed:', err);
    res.status(500).json({ message: 'Database initialization failed' });
  }
});

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

// Manual seed endpoint for debugging
app.post('/api/seed', async (req, res) => {
  try {
    await initDB();
    await seedDevData();
    res.json({ message: 'Seed completed successfully' });
  } catch (err) {
    console.error('[Seed endpoint] Error:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

export default app;
