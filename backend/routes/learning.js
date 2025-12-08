import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const courses = [
  { _id: 'course-1', title: 'React Fundamentals', category: 'Technology', status: 'active', enrolledCount: 15 },
  { _id: 'course-2', title: 'HR Best Practices', category: 'HR', status: 'active', enrolledCount: 12 },
  { _id: 'course-3', title: 'Financial Analysis', category: 'Finance', status: 'active', enrolledCount: 8 },
];

router.get('/courses', authenticate, (req, res) => {
  res.json(courses);
});

router.post('/courses', authenticate, (req, res) => {
  const newCourse = { _id: `course-${Date.now()}`, ...req.body };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

router.put('/courses/:id', authenticate, (req, res) => {
  const idx = courses.findIndex((c) => c._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Course not found' });
  courses[idx] = { ...courses[idx], ...req.body };
  res.json(courses[idx]);
});

router.delete('/courses/:id', authenticate, (req, res) => {
  const idx = courses.findIndex((c) => c._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Course not found' });
  courses.splice(idx, 1);
  res.json({ success: true });
});

router.get('/enrollments', authenticate, (req, res) => {
  res.json([
    { _id: 'enroll-1', courseId: 'course-1', employeeId: 'EMP001', status: 'in-progress', progress: 65 },
    { _id: 'enroll-2', courseId: 'course-2', employeeId: 'EMP002', status: 'in-progress', progress: 40 },
  ]);
});

router.post('/enrollments', authenticate, (req, res) => {
  res.status(201).json({ success: true, message: 'Enrolled', data: req.body });
});

router.post('/progress', authenticate, (req, res) => {
  res.json({ success: true, message: 'Lesson completed', data: req.body });
});

router.get('/certifications', authenticate, (req, res) => {
  res.json([{ _id: 'cert-1', title: 'React Professional', issueDate: '2025-11-15', employeeId: req.query.employeeId || null }]);
});

export default router;
