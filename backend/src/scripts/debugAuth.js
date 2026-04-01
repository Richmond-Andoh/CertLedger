const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const debugAuth = async () => {
  try {
    console.log('🔍 Debugging Authentication Process...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Check if student user exists
    const studentUser = await User.findOne({ username: 'student123' }).select('+password');
    console.log('📋 Student User Status:');
    console.log('- Found:', studentUser ? 'Yes' : 'No');
    
    if (!studentUser) {
      console.log('❌ Student user not found - creating new one...\n');
      
      // Create student user manually
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('Password123!', salt);
      
      const newStudent = new User({
        username: 'student123',
        email: 'student123@certledger.com',
        password: hashedPassword,
        role: 'student',
        isActive: true,
        isEmailVerified: true
      });
      
      await newStudent.save();
      console.log('✅ Student user created successfully\n');
      
      // Test the new user
      const testUser = await User.findOne({ username: 'student123' }).select('+password');
      console.log('🧪 Testing password comparison:');
      
      try {
        const isMatch = await testUser.comparePassword('Password123!');
        console.log('- Password match:', isMatch);
      } catch (error) {
        console.log('- Password comparison error:', error.message);
      }
      
    } else {
      console.log('- Username:', studentUser.username);
      console.log('- Role:', studentUser.role);
      console.log('- Active:', studentUser.isActive);
      console.log('- Locked:', studentUser.isLocked());
      console.log('- Login Attempts:', studentUser.loginAttempts);
      console.log('- Password exists:', !!studentUser.password);
      
      // Test password comparison
      console.log('\n🧪 Testing password comparison:');
      try {
        const isMatch = await studentUser.comparePassword('Password123!');
        console.log('- Password match:', isMatch);
        
        if (!isMatch) {
          console.log('\n🔧 Password mismatch - updating password...');
          const salt = await bcrypt.genSalt(12);
          const newHashedPassword = await bcrypt.hash('Password123!', salt);
          studentUser.password = newHashedPassword;
          studentUser.loginAttempts = 0;
          studentUser.lockUntil = undefined;
          await studentUser.save();
          
          console.log('✅ Password updated successfully');
          
          // Test again
          const newMatch = await studentUser.comparePassword('Password123!');
          console.log('- New password match:', newMatch);
        }
      } catch (error) {
        console.log('- Password comparison error:', error.message);
      }
    }

    // Check all demo users
    console.log('\n📋 All Demo Users Status:');
    const allUsers = await User.find({ 
      username: { $in: ['student123', 'admin', 'sysadmin'] } 
    });
    
    allUsers.forEach(user => {
      console.log(`- ${user.username} (${user.role}) - Active: ${user.isActive} - Locked: ${user.isLocked()}`);
    });

    console.log('\n🎯 Ready for testing with:');
    console.log('Student: student123 / Password123!');
    console.log('Admin: admin / Admin123!');
    console.log('System Admin: sysadmin / Sysadmin123!');

  } catch (error) {
    console.error('❌ Debug error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run debug script
debugAuth();
