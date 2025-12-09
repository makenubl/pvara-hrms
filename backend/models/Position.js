import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema(
  {
    positionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      required: [true, 'Position title is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    reportsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Position',
      default: null,
    },
    isTopLevel: {
      type: Boolean,
      default: false,
      // True for CEO, Chairman, or any position that doesn't report to anyone
    },
    level: {
      type: String,
      enum: ['executive', 'senior', 'mid', 'junior'],
      default: 'mid',
    },
    grossSalary: {
      type: Number,
      min: [0, 'Gross salary cannot be negative'],
      // Required for top-level positions, optional for others
    },
    salary_range_min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative'],
    },
    salary_range_max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative'],
    },
    benefits: [{
      type: String,
      trim: true,
    }],
    responsibilities: [{
      type: String,
      trim: true,
    }],
    requirements: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
    },
    employeeCount: {
      type: Number,
      default: 0,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
);

// Generate unique position ID before saving
positionSchema.pre('save', async function (next) {
  if (!this.positionId) {
    const count = await mongoose.model('Position').countDocuments({ company: this.company });
    const companyCode = 'POS';
    this.positionId = `${companyCode}-${String(count + 1).padStart(4, '0')}`;
  }
  
  // If isTopLevel is true, reportsTo must be null
  if (this.isTopLevel) {
    this.reportsTo = null;
  }
  
  next();
});

// Validate that top-level positions have gross salary
positionSchema.pre('validate', function (next) {
  if (this.isTopLevel && !this.grossSalary) {
    this.invalidate('grossSalary', 'Gross salary is required for top-level positions');
  }
  next();
});

export default mongoose.model('Position', positionSchema);
