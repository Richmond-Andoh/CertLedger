const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createUsers() {
  try {
    console.log('🔄 Creating demo users...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Generate salt
    const salt = await bcrypt.genSalt(12);
    console.log('✅ Generated salt');
    
    // Hash passwords
    const studentPassword = await bcrypt.hash('Password123!', salt);
    const adminPassword = await bcrypt.hash('Admin123!', salt);
    const sysadminPassword = await bcrypt.hash('Sysadmin123!', salt);
    console.log('✅ Hashed passwords');
    
    // Delete existing demo users
    const deleteResult = await User.deleteMany({ 
      username: { $in: ['student123', 'admin', 'sysadmin'] } 
    });
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing users`);
    
    // Create new demo users
    const users = await User.create([
      {
        username: 'student123',
        email: 'student123@certledger.com',
        password: studentPassword,
        role: 'student',
        isActive: true,
        isEmailVerified: true
      },
      {
        username: 'admin',
        email: 'admin@certledger.com',
        password: adminPassword,
        role: 'university_admin',
        institution: 'Test University',
        isActive: true,
        isEmailVerified: true
      },
      {
        username: 'sysadmin',
        email: 'sysadmin@certledger.com',
        password: sysadminPassword,
        role: 'system_admin',
        isActive: true,
        isEmailVerified: true
      }
    ]);
    
    console.log('✅ Demo users created successfully:');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.role})`);
    });
    
    // Test password comparison
    console.log('\n🧪 Testing password authentication...');
    const testUser = await User.findOne({ username: 'student123' }).select('+password');
    
    try {
      const isMatch = await testUser.comparePassword('Password123!');
      console.log(`✅ Student password test: ${isMatch ? 'PASS' : 'FAIL'}`);
    } catch (error) {
      console.log('❌ Password test error:', error.message);
    }
    
    console.log('\n🎯 Ready for testing with:');
    console.log('Student: student123 / Password123!');
    console.log('Admin: admin / Admin123!');
    console.log('System Admin: sysadmin / Sysadmin123!');
    
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
createUsers();
