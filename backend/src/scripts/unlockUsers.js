const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const unlockDemoUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Reset demo users
    const result = await User.updateMany(
      { 
        username: { $in: ['student123', 'admin', 'sysadmin'] }
      },
      { 
        $set: { 
          loginAttempts: 0,
          lockUntil: undefined,
          isActive: true
        }
      }
    );

    console.log(`✅ Reset ${result.modifiedCount} demo users`);

    // Check user status
    const users = await User.find({ 
      username: { $in: ['student123', 'admin', 'sysadmin'] } 
    });

    console.log('\n📋 User Status:');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.role}) - Active: ${user.isActive} - Locked: ${user.isLocked() ? 'Yes' : 'No'}`);
    });

    console.log('\n🧪 Ready for testing with:');
    console.log('Student: student123 / Password123!');
    console.log('Admin: admin / Admin123!');
    console.log('System Admin: sysadmin / Sysadmin123!');

  } catch (error) {
    console.error('❌ Error unlocking users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run unlock script
unlockDemoUsers();
