import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pvara-hrms';

async function cleanupDemoAccounts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define accounts to delete (demo/test accounts without proper names)
    const accountsToDelete = [
      'admin@pvara.com',
      'admin2@pvara.com',
      'admin6@pvara.com',  // Duplicate Salman Yousafi
      'demo@pvara.com',
      'test@pvara.com',
      'user@pvara.com',
      'fgdfgdfc@pvara.com'  // Test account Ahmad Maken
    ];

    // Get all users to see what we have
    const allUsers = await User.find({}).select('email name firstName lastName designation role');
    console.log('\n=== CURRENT USERS ===');
    allUsers.forEach(user => {
      const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
      console.log(`- ${user.email} | ${displayName} | ${user.designation || 'N/A'} | Role: ${user.role}`);
    });

    // Delete demo accounts
    const deleteResult = await User.deleteMany({
      email: { $in: accountsToDelete }
    });

    console.log(`\n✅ Deleted ${deleteResult.deletedCount} demo accounts`);

    // Show remaining users
    const remainingUsers = await User.find({}).select('email name firstName lastName designation role').sort({ role: -1, email: 1 });
    
    console.log('\n=== REMAINING USERS ===');
    const admins = remainingUsers.filter(u => u.role === 'admin');
    const employees = remainingUsers.filter(u => u.role === 'employee');

    console.log(`\nTotal Users: ${remainingUsers.length}`);
    console.log(`Admins: ${admins.length}`);
    console.log(`Employees: ${employees.length}`);

    console.log('\n--- ADMIN USERS ---');
    admins.forEach(user => {
      const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
      console.log(`✓ ${user.email} - ${displayName} (${user.designation || 'Admin'})`);
    });

    console.log('\n--- EMPLOYEE USERS ---');
    employees.forEach(user => {
      const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
      console.log(`  ${user.email} - ${displayName} (${user.designation || 'Employee'})`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupDemoAccounts();
