const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedDemoUsers = async () => {
  try {
    // Connect to MongoDB
    console.log('🔄 Attempting to connect to MongoDB...', process.env.MONGODB_URI ? 'URI defined' : 'URI undefined');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
      heartbeatFrequencyMS: 2000
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing demo users
    await User.deleteMany({
      username: { $in: ['student123', 'admin', 'sysadmin'] }
    });

    // Demo users with proper validation
    const demoUsers = [
      {
        username: 'student123',
        email: 'student123@certledger.com',
        password: 'Password123!',
        role: 'student',
        isActive: true,
        isEmailVerified: true
      },
      {
        username: 'admin',
        email: 'admin@certledger.com',
        password: 'Admin123!',
        role: 'university_admin',
        institution: 'Test University',
        isActive: true,
        isEmailVerified: true
      },
      {
        username: 'sysadmin',
        email: 'sysadmin@certledger.com',
        password: 'Sysadmin123!',
        role: 'system_admin',
        isActive: true,
        isEmailVerified: true
      }
    ];

    // Insert demo users (triggers pre-save hashing)
    const createdUsers = await User.create(demoUsers);
    console.log('✅ Demo users created successfully (with hashed passwords):');
    
    createdUsers.forEach(user => {
      console.log(`- ${user.username} (${user.role})`);
    });

    // Test login validation
    console.log('\n🧪 Testing login credentials:');
    console.log('Student: student123 / Password123!');
    console.log('Admin: admin / Admin123!');
    console.log('System Admin: sysadmin / Sysadmin123!');

  } catch (error) {
    console.error('❌ Error seeding demo users:', error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seed script
seedDemoUsers();
