import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, assignedTo, project, priority } = req.query;
    const filter = { company: req.user.company };

    // Non-admin users can only see their own tasks
    if (req.user.role !== 'admin') {
      filter.assignedTo = req.user._id;
    } else if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (status) filter.status = status;
    if (project) filter.project = project;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'firstName lastName email designation department')
      .populate('assignedBy', 'firstName lastName email')
      .populate('updates.addedBy', 'firstName lastName')
      .sort({ deadline: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get task by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email designation department')
      .populate('assignedBy', 'firstName lastName email')
      .populate('updates.addedBy', 'firstName lastName');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to this task
    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new task (admin only)
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      project,
      department,
      priority,
      status,
      deadline,
      capacity,
    } = req.body;

    // Verify assigned user exists and belongs to same company
    const assignedUser = await User.findOne({ _id: assignedTo, company: req.user.company });
    if (!assignedUser) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      project,
      department: department || assignedUser.department,
      priority: priority || 'medium',
      status: status || 'pending',
      deadline,
      capacity: capacity || 0,
      company: req.user.company,
    });

    const savedTask = await task.save();
    const populatedTask = await Task.findById(savedTask._id)
      .populate('assignedTo', 'firstName lastName email designation department')
      .populate('assignedBy', 'firstName lastName email');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    const isAssignee = task.assignedTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAssignee && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      title,
      description,
      assignedTo,
      project,
      department,
      priority,
      status,
      progress,
      deadline,
      capacity,
      blocker,
    } = req.body;

    // Admin can update all fields
    if (isAdmin) {
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (project !== undefined) task.project = project;
      if (department !== undefined) task.department = department;
      if (priority !== undefined) task.priority = priority;
      if (deadline !== undefined) task.deadline = deadline;
      if (capacity !== undefined) task.capacity = capacity;
    }

    // Both admin and assignee can update status, progress, and blocker
    if (status !== undefined) task.status = status;
    if (progress !== undefined) task.progress = progress;
    if (blocker !== undefined) task.blocker = blocker;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'firstName lastName email designation department')
      .populate('assignedBy', 'firstName lastName email');

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add update to task
router.post('/:id/updates', authenticate, async (req, res) => {
  try {
    const { message, progress, status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    const isAssignee = task.assignedTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAssignee && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.updates.push({
      message,
      addedBy: req.user._id,
      progress,
      status,
    });

    // Update task progress and status if provided
    if (progress !== undefined) task.progress = progress;
    if (status !== undefined) task.status = status;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'firstName lastName email designation department')
      .populate('assignedBy', 'firstName lastName email')
      .populate('updates.addedBy', 'firstName lastName');

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete task (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks statistics
router.get('/stats/summary', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { company: req.user.company } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgProgress: { $avg: '$progress' },
        },
      },
    ]);

    const totalTasks = await Task.countDocuments({ company: req.user.company });
    const overdueTasks = await Task.countDocuments({
      company: req.user.company,
      deadline: { $lt: new Date() },
      status: { $nin: ['completed', 'cancelled'] },
    });

    res.json({
      total: totalTasks,
      overdue: overdueTasks,
      byStatus: stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
