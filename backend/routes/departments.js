import express from 'express';
import Department from '../models/Department.js';
import User from '../models/User.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all departments for the company
router.get('/', authenticate, async (req, res) => {
  try {
    const companyId = req.user.company._id || req.user.company;
    
    const departments = await Department.find({ company: companyId })
      .populate('headOfDepartment', 'firstName lastName email')
      .sort({ name: 1 });

    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
});

// Create a new department (admin only)
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name, description, headOfDepartment } = req.body;
    const companyId = req.user.company._id || req.user.company;

    // Check if department already exists
    const existingDept = await Department.findOne({ 
      company: companyId, 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingDept) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    // Count employees in this department
    const employeeCount = await User.countDocuments({ 
      company: companyId, 
      department: name 
    });

    const department = new Department({
      name,
      description,
      headOfDepartment: headOfDepartment || null,
      company: companyId,
      employeeCount,
    });

    await department.save();
    
    const populated = await Department.findById(department._id)
      .populate('headOfDepartment', 'firstName lastName email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Failed to create department' });
  }
});

// Update a department (admin only)
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name, description, headOfDepartment, status } = req.body;
    const companyId = req.user.company._id || req.user.company;

    const department = await Department.findOne({ 
      _id: req.params.id, 
      company: companyId 
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if new name conflicts with existing department
    if (name && name !== department.name) {
      const existingDept = await Department.findOne({ 
        company: companyId, 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingDept) {
        return res.status(400).json({ message: 'Department name already exists' });
      }
    }

    // Update fields
    if (name) department.name = name;
    if (description !== undefined) department.description = description;
    if (headOfDepartment !== undefined) department.headOfDepartment = headOfDepartment || null;
    if (status) department.status = status;

    // Update employee count
    department.employeeCount = await User.countDocuments({ 
      company: companyId, 
      department: department.name 
    });

    await department.save();
    
    const populated = await Department.findById(department._id)
      .populate('headOfDepartment', 'firstName lastName email');

    res.json(populated);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Failed to update department' });
  }
});

// Delete a department (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const companyId = req.user.company._id || req.user.company;

    const department = await Department.findOne({ 
      _id: req.params.id, 
      company: companyId 
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if department has employees
    const employeeCount = await User.countDocuments({ 
      company: companyId, 
      department: department.name 
    });

    if (employeeCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete department with ${employeeCount} employee(s). Please reassign them first.` 
      });
    }

    await Department.deleteOne({ _id: req.params.id });

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Failed to delete department' });
  }
});

// Get department statistics
router.get('/stats/summary', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const companyId = req.user.company._id || req.user.company;
    
    const departments = await Department.find({ company: companyId });
    
    const stats = {
      total: departments.length,
      active: departments.filter(d => d.status === 'active').length,
      inactive: departments.filter(d => d.status === 'inactive').length,
      totalEmployees: departments.reduce((sum, d) => sum + d.employeeCount, 0),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching department stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

export default router;
