const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkPasswords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({ 
      username: { $in: ['student123', 'admin', 'sysadmin'] } 
    }).select('+password');
    
    console.log('--- User Passwords ---');
    users.forEach(user => {
      const isHashed = user.password && user.password.startsWith('$2');
      console.log(`${user.username}: ${isHashed ? 'HASHED' : 'PLAIN TEXT'} (${user.password ? user.password.substring(0, 10) + '...' : 'NONE'})`);
      console.log(`Locked until: ${user.lockUntil}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPasswords();
