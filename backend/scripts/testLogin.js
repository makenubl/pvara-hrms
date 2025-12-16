import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pvara-hrms';

async function testLogin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const email = 'ahmad.raza@pvara.gov.pk';
    const testPassword = '123';

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found:', email);
      await mongoose.connection.close();
      return;
    }

    console.log('✅ User found:');
    console.log('  Email:', user.email);
    console.log('  Name:', user.name || `${user.firstName} ${user.lastName}`);
    console.log('  Role:', user.role);
    console.log('  Designation:', user.designation);
    console.log('  Hashed Password:', user.password);

    // Test password
    const isMatch = await bcryptjs.compare(testPassword, user.password);
    console.log('\nPassword Test:');
    console.log('  Testing password:', testPassword);
    console.log('  Match result:', isMatch ? '✅ CORRECT' : '❌ INCORRECT');

    // Test with other common passwords
    const testPasswords = ['123', 'password', 'admin', '123456'];
    console.log('\nTrying multiple passwords:');
    for (const pwd of testPasswords) {
      const match = await bcryptjs.compare(pwd, user.password);
      console.log(`  ${pwd}: ${match ? '✅' : '❌'}`);
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testLogin();
