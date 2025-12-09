import express from 'express';
import Position from '../models/Position.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all positions for a company
router.get('/', authenticate, async (req, res) => {
  try {
    const positions = await Position.find({ company: req.user.company })
      .populate('reportsTo', 'title department positionId')
      .sort({ createdAt: -1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get position hierarchy/organizational structure
router.get('/hierarchy', authenticate, async (req, res) => {
  try {
    const positions = await Position.find({ company: req.user.company }).populate('reportsTo');
    
    // Build hierarchy
    const hierarchy = {};
    positions.forEach((pos) => {
      hierarchy[pos._id] = {
        ...pos.toObject(),
        subordinates: [],
      };
    });

    positions.forEach((pos) => {
      if (pos.reportsTo) {
        if (hierarchy[pos.reportsTo._id]) {
          hierarchy[pos.reportsTo._id].subordinates.push(pos._id);
        }
      }
    });

    res.json(Object.values(hierarchy));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single position
router.get('/:id', authenticate, async (req, res) => {
  try {
    const position = await Position.findById(req.params.id)
      .populate('reportsTo', 'title department positionId');
    if (!position) return res.status(404).json({ message: 'Position not found' });
    res.json(position);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create position (HR/Admin only)
router.post('/', authenticate, authorize(['hr', 'admin']), async (req, res) => {
  const { 
    title, 
    department, 
    description, 
    reportsTo, 
    isTopLevel,
    level, 
    grossSalary,
    salary_range_min, 
    salary_range_max,
    benefits,
    responsibilities,
    requirements,
    status
  } = req.body;

  try {
    // Validate required fields
    if (!title || !department) {
      return res.status(400).json({ message: 'Title and department are required' });
    }

    // Validate top-level position requirements
    if (isTopLevel && !grossSalary) {
      return res.status(400).json({ message: 'Gross salary is required for top-level positions (CEO, Chairman, etc.)' });
    }

    // Prevent circular reporting
    if (reportsTo) {
      const parentPosition = await Position.findById(reportsTo);
      if (!parentPosition) {
        return res.status(400).json({ message: 'Invalid reportsTo position' });
      }
    }

    const position = new Position({
      title,
      department,
      description,
      reportsTo: isTopLevel ? null : (reportsTo || null),
      isTopLevel: isTopLevel || false,
      level,
      grossSalary,
      salary_range_min,
      salary_range_max,
      benefits: benefits || [],
      responsibilities: responsibilities || [],
      requirements: requirements || [],
      status: status || 'active',
      company: req.user.company,
    });

    const savedPosition = await position.save();
    await savedPosition.populate('reportsTo', 'title department positionId');
    res.status(201).json(savedPosition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update position
router.put('/:id', authenticate, authorize(['hr', 'admin']), async (req, res) => {
  try {
    // Validate if updating to top-level without grossSalary
    if (req.body.isTopLevel && !req.body.grossSalary) {
      const existingPosition = await Position.findById(req.params.id);
      if (!existingPosition.grossSalary) {
        return res.status(400).json({ message: 'Gross salary is required for top-level positions' });
      }
    }

    // If setting isTopLevel to true, clear reportsTo
    if (req.body.isTopLevel) {
      req.body.reportsTo = null;
    }

    const position = await Position.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('reportsTo', 'title department positionId');

    if (!position) return res.status(404).json({ message: 'Position not found' });
    res.json(position);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete position
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);
    if (!position) return res.status(404).json({ message: 'Position not found' });
    res.json({ message: 'Position deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
