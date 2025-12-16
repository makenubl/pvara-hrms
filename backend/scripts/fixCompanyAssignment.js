import mongoose from 'mongoose';
import User from '../models/User.js';
import Company from '../models/Company.js';
import dotenv from 'dotenv';

dotenv.config();

const fixCompanyAssignment = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pvara-hrms');
    console.log('Connected to MongoDB');

    // Get all companies
    const companies = await Company.find({});
    console.log('\n=== COMPANIES ===');
    companies.forEach(c => console.log(`- ${c.name} (ID: ${c._id})`));

    // Get the first company (the one you're logged into)
    const mainCompany = companies[0];
    console.log(`\nUsing company: ${mainCompany.name} (${mainCompany._id})`);

    // Update all PVARA email users to this company
    const pvaraEmails = [
      'salman.yousafi@pvara.gov.pk',
      'sumera.azam@pvara.gov.pk',
      'sheraz.hussain@pvara.gov.pk',
      'adnan.nazir@pvara.gov.pk',
      'najia.obaid@pvara.gov.pk',
      'zain.saeed@pvara.gov.pk',
      'sadaqat.ali@pvara.gov.pk',
      'qamar.iqbal@pvara.gov.pk',
      'm.umar@pvara.gov.pk',
      'muhammad.riaz@pvara.gov.pk',
      'faisal.idrees@pvara.gov.pk',
      'ijaz.akbar@pvara.gov.pk',
      'azam.khan@pvara.gov.pk',
      'muhammad.khurshid@pvara.gov.pk',
      'ali.shan@pvara.gov.pk',
      'ghulam.shah@pvara.gov.pk',
      'khurram.bashir@pvara.gov.pk',
      'amjad.rao@pvara.gov.pk',
      'umair.ahmad@pvara.gov.pk',
      'muhammad.babar@pvara.gov.pk',
      'zaid.ahmed@pvara.gov.pk',
    ];

    const result = await User.updateMany(
      { email: { $in: pvaraEmails } },
      { $set: { company: mainCompany._id } }
    );

    console.log(`\nUpdated ${result.modifiedCount} PVARA users to company: ${mainCompany.name}`);

    // Show final count
    const totalUsers = await User.countDocuments({ company: mainCompany._id });
    console.log(`Total users in ${mainCompany.name}: ${totalUsers}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixCompanyAssignment();
