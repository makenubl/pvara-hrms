import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Company from '../models/Company.js';
import dotenv from 'dotenv';

dotenv.config();

const pvaraEmployees = [
  // Admin users
  { firstName: 'Salman', lastName: 'Yousafi', email: 'salman.yousafi@pvara.gov.pk', role: 'admin', designation: 'Deputy Secretary', department: 'Team Law, Rules, Interagency Coordination' },
  { firstName: 'Sumera', lastName: 'Azam', email: 'sumera.azam@pvara.gov.pk', role: 'admin', designation: 'SSP, Director FIA', department: 'Team Law, Rules, Interagency Coordination' },
  { firstName: 'Sheraz', lastName: 'Hussain', email: 'sheraz.hussain@pvara.gov.pk', role: 'admin', designation: 'Vice President Bank Alfalah', department: 'Team Licensing and Regulation' },
  { firstName: 'Adnan', lastName: 'Nazir', email: 'adnan.nazir@pvara.gov.pk', role: 'admin', designation: 'Joint Secretary', department: 'Overall Supervision' },
  { firstName: 'Najia', lastName: 'Obaid', email: 'najia.obaid@pvara.gov.pk', role: 'admin', designation: 'Additional Director SECP', department: 'Team Licensing and Regulation' },
  { firstName: 'Zain', lastName: 'Imtiaz Saeed', email: 'zain.saeed@pvara.gov.pk', role: 'admin', designation: 'Assistant Accountant General', department: 'Procurement and Accounts' },
  
  // Regular employees
  { firstName: 'Sadaqat', lastName: 'Ali', email: 'sadaqat.ali@pvara.gov.pk', role: 'employee', designation: 'Director to Chairperson PVARA', department: 'Chairperson Office' },
  { firstName: 'Qamar', lastName: 'Iqbal', email: 'qamar.iqbal@pvara.gov.pk', role: 'employee', designation: 'Protocol Officer PVARA', department: 'Chairperson Office' },
  { firstName: 'M.', lastName: 'Umar', email: 'm.umar@pvara.gov.pk', role: 'employee', designation: 'PS to Chairperson PVARA', department: 'Chairperson Office' },
  { firstName: 'Muhammad', lastName: 'Riaz', email: 'muhammad.riaz@pvara.gov.pk', role: 'employee', designation: 'PS to JS PVARA', department: 'Overall Supervision' },
  { firstName: 'Faisal', lastName: 'Idrees', email: 'faisal.idrees@pvara.gov.pk', role: 'employee', designation: 'Deputy Secretary (DS)', department: 'Admin & HR' },
  { firstName: 'Ijaz', lastName: 'Akbar', email: 'ijaz.akbar@pvara.gov.pk', role: 'employee', designation: 'Assistant Engineer', department: 'Admin & HR' },
  { firstName: 'Muhammad', lastName: 'Azam Khan', email: 'azam.khan@pvara.gov.pk', role: 'employee', designation: 'Receptionist', department: 'Admin & HR' },
  { firstName: 'Muhammad', lastName: 'Khurshid', email: 'muhammad.khurshid@pvara.gov.pk', role: 'employee', designation: 'Deputy Director PPRA', department: 'Procurement and Accounts' },
  { firstName: 'Ali', lastName: 'Shan', email: 'ali.shan@pvara.gov.pk', role: 'employee', designation: 'Programmer', department: 'Procurement and Accounts' },
  { firstName: 'Ghulam Ali', lastName: 'Shah', email: 'ghulam.shah@pvara.gov.pk', role: 'employee', designation: 'Assistant', department: 'Procurement and Accounts' },
  { firstName: 'Khurram', lastName: 'Bashir', email: 'khurram.bashir@pvara.gov.pk', role: 'employee', designation: 'Software Engineer, NITB', department: 'IT and Software Functions' },
  { firstName: 'Amjad', lastName: 'Iqbal Rao', email: 'amjad.rao@pvara.gov.pk', role: 'employee', designation: 'Additional Joint Director SECP', department: 'Team Licensing and Regulation' },
  { firstName: 'Umair', lastName: 'Ahmad', email: 'umair.ahmad@pvara.gov.pk', role: 'employee', designation: 'Additional Joint Director', department: 'Team Licensing and Regulation' },
  { firstName: 'Muhammad', lastName: 'Babar', email: 'muhammad.babar@pvara.gov.pk', role: 'employee', designation: 'Deputy Director, SBP', department: 'Team Licensing and Regulation' },
  { firstName: 'Zaid', lastName: 'Ahmed', email: 'zaid.ahmed@pvara.gov.pk', role: 'employee', designation: 'Deputy Director, SBP', department: 'Team Licensing and Regulation' },
];

const seedPVARAEmployees = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pvara-hrms');
    console.log('Connected to MongoDB');

    // Find or create PVARA company
    let company = await Company.findOne({ name: 'PVARA' });
    
    if (!company) {
      company = new Company({
        name: 'PVARA',
        email: 'info@pvara.gov.pk',
        subscription_plan: 'enterprise',
        description: 'Pakistan Virtual Assets Regulatory Authority',
      });
      await company.save();
      console.log('Created PVARA company');
    }

    // Default password: 123
    const defaultPassword = await bcrypt.hash('123', 10);

    let createdCount = 0;
    let updatedCount = 0;

    for (const employee of pvaraEmployees) {
      const existingUser = await User.findOne({ email: employee.email });
      
      if (existingUser) {
        // Update existing user
        existingUser.designation = employee.designation;
        existingUser.department = employee.department;
        existingUser.role = employee.role;
        existingUser.company = company._id;
        existingUser.status = 'active';
        await existingUser.save();
        updatedCount++;
        console.log(`Updated: ${employee.firstName} ${employee.lastName}`);
      } else {
        // Create new user
        const newUser = new User({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          password: defaultPassword,
          role: employee.role,
          designation: employee.designation,
          department: employee.department,
          company: company._id,
          status: 'active',
          requirePasswordChange: true, // Flag to force password change on first login
        });
        await newUser.save();
        createdCount++;
        console.log(`Created: ${employee.firstName} ${employee.lastName} (${employee.email})`);
      }
    }

    console.log('\n=== SEEDING COMPLETE ===');
    console.log(`Created: ${createdCount} employees`);
    console.log(`Updated: ${updatedCount} employees`);
    console.log('Total employees:', pvaraEmployees.length);
    console.log('\nDefault password for all users: 123');
    console.log('\nAdmin users (can manage departments and assign tasks):');
    console.log('- Salman Yousafi (salman.yousafi@pvara.gov.pk)');
    console.log('- Sumera Azam (sumera.azam@pvara.gov.pk)');
    console.log('- Sheraz Hussain (sheraz.hussain@pvara.gov.pk)');
    console.log('- Adnan Nazir (adnan.nazir@pvara.gov.pk)');
    console.log('- Najia Obaid (najia.obaid@pvara.gov.pk)');
    console.log('- Zain Imtiaz Saeed (zain.saeed@pvara.gov.pk)');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedPVARAEmployees();
