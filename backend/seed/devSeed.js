import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Company from '../models/Company.js';

const TEST_USERS = [
  { email: 'admin@pvara.com', firstName: 'Admin', lastName: 'User', role: 'admin', password: 'Admin@123' },
  { email: 'hr@pvara.com', firstName: 'HR', lastName: 'Exec', role: 'hr', password: 'HR@123' },
  { email: 'manager@pvara.com', firstName: 'Dept', lastName: 'Manager', role: 'manager', password: 'Manager@123' },
  { email: 'employee@pvara.com', firstName: 'Employee', lastName: 'User', role: 'employee', password: 'Employee@123' },
];

const seedDevData = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@pvara.com' });
  if (existingAdmin) return;

  const company = await Company.create({
    name: 'PVARA HRMS Demo',
    email: 'company@pvara.com',
    subscription_plan: 'free',
    status: 'active',
  });

  for (const u of TEST_USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    await User.create({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      password: hash,
      role: u.role,
      company: company._id,
      status: 'active',
    });
  }
};

export default seedDevData;
