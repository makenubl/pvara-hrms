import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Company from '../models/Company.js';
import dotenv from 'dotenv';

dotenv.config();

const addNewAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pvara-hrms');
    console.log('Connected to MongoDB');

    // Get the main company (first one)
    const companies = await Company.find({});
    const mainCompany = companies[0];
    console.log(`Using company: ${mainCompany.name} (${mainCompany._id})`);

    // Delete all other companies except the first one
    if (companies.length > 1) {
      const otherCompanyIds = companies.slice(1).map(c => c._id);
      await Company.deleteMany({ _id: { $in: otherCompanyIds } });
      console.log(`Deleted ${companies.length - 1} extra companies`);
    }

    // Rename company to PVARA if needed
    if (mainCompany.name !== 'PVARA') {
      mainCompany.name = 'PVARA';
      mainCompany.email = 'info@pvara.gov.pk';
      await mainCompany.save();
      console.log('Renamed company to PVARA');
    }

    const defaultPassword = await bcrypt.hash('123', 10);

    const newAdmins = [
      {
        firstName: 'Ahmad',
        lastName: 'Raza',
        email: 'ahmad.raza@pvara.gov.pk',
        password: defaultPassword,
        role: 'admin',
        designation: 'Chief Technology Officer (CTO)',
        department: 'Technology & Innovation',
        company: mainCompany._id,
        status: 'active',
        requirePasswordChange: true,
      },
      {
        firstName: 'Bilal',
        lastName: 'Saqib',
        email: 'bilal.saqib@pvara.gov.pk',
        password: defaultPassword,
        role: 'admin',
        designation: 'Chairperson',
        department: 'Executive Office',
        company: mainCompany._id,
        status: 'active',
        requirePasswordChange: true,
      },
    ];

    for (const admin of newAdmins) {
      const existing = await User.findOne({ email: admin.email });
      if (existing) {
        existing.role = 'admin';
        existing.designation = admin.designation;
        existing.department = admin.department;
        existing.company = mainCompany._id;
        existing.status = 'active';
        await existing.save();
        console.log(`✅ Updated: ${admin.firstName} ${admin.lastName} (${admin.email}) - ${admin.designation}`);
      } else {
        const newUser = new User(admin);
        await newUser.save();
        console.log(`✅ Created: ${admin.firstName} ${admin.lastName} (${admin.email}) - ${admin.designation}`);
      }
    }

    // Ensure all users belong to the main company
    await User.updateMany({}, { $set: { company: mainCompany._id } });

    const totalUsers = await User.countDocuments({ company: mainCompany._id });
    const totalAdmins = await User.countDocuments({ company: mainCompany._id, role: 'admin' });

    console.log('\n=== SUMMARY ===');
    console.log(`Company: ${mainCompany.name}`);
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Total Admins: ${totalAdmins}`);
    console.log('\nDefault password for all users: 123');

    console.log('\n=== ALL ADMIN USERS ===');
    const admins = await User.find({ role: 'admin', company: mainCompany._id });
    admins.forEach(admin => {
      console.log(`- ${admin.firstName} ${admin.lastName} (${admin.email}) - ${admin.designation || 'Admin'}`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addNewAdmins();
