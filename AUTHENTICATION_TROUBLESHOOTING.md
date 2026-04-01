# 🔧 **Authentication Troubleshooting Guide**

## ❌ **Problem:**
```
{
  "username": "student123",
  "password": "Password123!"
}

{
    "error": "Authentication Failed",
    "message": "Invalid credentials"
}
```

## 🔍 **Root Causes & Solutions**

### **1. Demo Users Not Created**
**Problem:** Seed script didn't run successfully
**Solution:** Manually create users

#### **Manual User Creation:**
```bash
cd backend
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config();

async function createUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Create student user
  const salt = await bcrypt.genSalt(12);
  const studentPassword = await bcrypt.hash('Password123!', salt);
  const adminPassword = await bcrypt.hash('Admin123!', salt);
  const sysadminPassword = await bcrypt.hash('Sysadmin123!', salt);
  
  await User.deleteMany({ username: { \$in: ['student123', 'admin', 'sysadmin'] } });
  
  await User.create([
    { username: 'student123', email: 'student123@certledger.com', password: studentPassword, role: 'student', isActive: true, isEmailVerified: true },
    { username: 'admin', email: 'admin@certledger.com', password: adminPassword, role: 'university_admin', institution: 'Test University', isActive: true, isEmailVerified: true },
    { username: 'sysadmin', email: 'sysadmin@certledger.com', password: sysadminPassword, role: 'system_admin', isActive: true, isEmailVerified: true }
  ]);
  
  console.log('✅ Demo users created successfully');
  await mongoose.disconnect();
}

createUsers().catch(console.error);
"
```

### **2. Backend Not Running**
**Problem:** Backend server not started
**Solution:** Start backend server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 CertLedger Backend Server
📡 Server running on port 8000
🗄️  MongoDB connected
⛓️  Blockchain connected
```

### **3. MongoDB Connection Issues**
**Problem:** Database not connected
**Solution:** Check MongoDB connection

```bash
cd backend
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));
"
```

### **4. Password Hash Mismatch**
**Problem:** Password hash doesn't match
**Solution:** Reset user passwords

```bash
cd backend
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config();

async function resetPasswords() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const user = await User.findOne({ username: 'student123' }).select('+password');
  if (user) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash('Password123!', salt);
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    console.log('✅ Student password reset');
  }
  
  await mongoose.disconnect();
}

resetPasswords().catch(console.error);
"
```

## 🧪 **Step-by-Step Testing**

### **Step 1: Verify Backend Running**
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-03-31T09:30:00.000Z",
  "uptime": 123.456
}
```

### **Step 2: Create Demo Users**
```bash
cd backend
node src/scripts/debugAuth.js
```

### **Step 3: Test Login**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "student123", "password": "Password123!"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "student123",
    "role": "student",
    "email": "student123@certledger.com"
  }
}
```

## 🔍 **Debugging Commands**

### **Check User Status:**
```bash
cd backend
node -e "
const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const user = await User.findOne({ username: 'student123' }).select('+password');
  console.log('User exists:', !!user);
  if (user) {
    console.log('Active:', user.isActive);
    console.log('Locked:', user.isLocked());
    console.log('Password exists:', !!user.password);
  }
  await mongoose.disconnect();
}).catch(console.error);
"
```

### **Test Password Comparison:**
```bash
cd backend
node -e "
const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const user = await User.findOne({ username: 'student123' }).select('+password');
  if (user) {
    try {
      const match = await user.comparePassword('Password123!');
      console.log('Password match:', match);
    } catch (err) {
      console.log('Password error:', err.message);
    }
  }
  await mongoose.disconnect();
}).catch(console.error);
"
```

## 🚨 **Common Issues**

### **Issue 1: Port 8000 Already in Use**
```bash
# Kill process on port 8000
sudo fuser -k 8000/tcp
# Or
lsof -ti:8000 | xargs kill -9
```

### **Issue 2: MongoDB Connection Failed**
```bash
# Check .env file
cat backend/.env

# Verify MongoDB URI format
# Should be: mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

### **Issue 3: Missing Dependencies**
```bash
cd backend
npm install
```

### **Issue 4: Environment Variables Missing**
```bash
cd backend
cp .env.example .env
# Edit .env with proper values
```

## 🎯 **Quick Fix Script**

### **Complete Reset:**
```bash
#!/bin/bash
echo "🔄 Complete Authentication Reset..."

# 1. Kill any process on port 8000
sudo fuser -k 8000/tcp 2>/dev/null

# 2. Clear MongoDB demo users
cd backend
node -e "
const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.deleteMany({ username: { \$in: ['student123', 'admin', 'sysadmin'] } });
  console.log('✅ Cleared demo users');
  await mongoose.disconnect();
}).catch(console.error);
"

# 3. Create fresh demo users
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const salt = await bcrypt.genSalt(12);
  
  await User.create([
    { username: 'student123', email: 'student123@certledger.com', password: await bcrypt.hash('Password123!', salt), role: 'student', isActive: true, isEmailVerified: true },
    { username: 'admin', email: 'admin@certledger.com', password: await bcrypt.hash('Admin123!', salt), role: 'university_admin', institution: 'Test University', isActive: true, isEmailVerified: true },
    { username: 'sysadmin', email: 'sysadmin@certledger.com', password: await bcrypt.hash('Sysadmin123!', salt), role: 'system_admin', isActive: true, isEmailVerified: true }
  ]);
  
  console.log('✅ Demo users created');
  await mongoose.disconnect();
}).catch(console.error);
"

echo "✅ Reset complete! Start backend with: npm run dev"
```

## 🎉 **Expected Result After Fix**

After running the troubleshooting steps:

1. ✅ **Backend running** on port 8000
2. ✅ **Demo users created** with correct passwords
3. ✅ **Login working** for all user types
4. ✅ **Tokens generated** for API testing

**Test login should return:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "student123",
    "role": "student"
  }
}
```

**Run the manual user creation script if automated scripts aren't working!** 🚀
