# 🚀 **Final Authentication Fix - Step by Step**

## ⚡ **Quick Solution (Run These Commands):**

### **Step 1: Kill Everything on Port 8000**
```bash
sudo fuser -k 8000/tcp 2>/dev/null || echo "Port 8000 clear"
```

### **Step 2: Create Demo Users (Manual Script)**
```bash
cd backend
cat > createUsers.js << 'EOF'
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config();

async function createUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const salt = await bcrypt.genSalt(12);
    
    await User.deleteMany({ username: { $in: ['student123', 'admin', 'sysadmin'] } });
    
    await User.create([
      { username: 'student123', email: 'student123@certledger.com', password: await bcrypt.hash('Password123!', salt), role: 'student', isActive: true, isEmailVerified: true },
      { username: 'admin', email: 'admin@certledger.com', password: await bcrypt.hash('Admin123!', salt), role: 'university_admin', institution: 'Test University', isActive: true, isEmailVerified: true },
      { username: 'sysadmin', email: 'sysadmin@certledger.com', password: await bcrypt.hash('Sysadmin123!', salt), role: 'system_admin', isActive: true, isEmailVerified: true }
    ]);
    
    console.log('✅ Demo users created successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}
createUsers();
EOF

node createUsers.js
```

### **Step 3: Start Backend Server**
```bash
cd backend
npm run dev
```

### **Step 4: Test Login (New Terminal)**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "student123", "password": "Password123!"}'
```

## 🧪 **Expected Results:**

### **After Step 2:**
```
Connected to MongoDB
✅ Demo users created successfully
```

### **After Step 3:**
```
🚀 CertLedger Backend Server
📡 Server running on port 8000
🗄️  MongoDB connected
⛓️  Blockchain connected
```

### **After Step 4:**
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

## 🔍 **If Still Failing - Debug Mode:**

### **Check Backend Status:**
```bash
curl http://localhost:8000/health
```

### **Check MongoDB Connection:**
```bash
cd backend
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB OK'))
  .catch(err => console.log('❌ MongoDB error:', err.message));
"
```

### **Check User Creation:**
```bash
cd backend
node -e "
const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const users = await User.find({ username: { \$in: ['student123', 'admin', 'sysadmin'] } });
  console.log('Users found:', users.length);
  users.forEach(u => console.log('- ' + u.username + ' (' + u.role + ')'));
  await mongoose.disconnect();
}).catch(console.error);
"
```

## 🎯 **Postman Testing Credentials:**

| Role | Username | Password |
|-------|----------|----------|
| Student | student123 | **Password123!** |
| Admin | admin | **Admin123!** |
| System Admin | sysadmin | **Sysadmin123!** |

## 📋 **Complete Test Sequence:**

### **1. Student Login:**
```json
POST http://localhost:8000/api/auth/login
{
  "username": "student123",
  "password": "Password123!"
}
```

### **2. Admin Login:**
```json
POST http://localhost:8000/api/auth/login
{
  "username": "admin",
  "password": "Admin123!"
}
```

### **3. System Admin Login:**
```json
POST http://localhost:8000/api/auth/login
{
  "username": "sysadmin",
  "password": "Sysadmin123!"
}
```

### **4. Issue Certificate (use admin token):**
```json
POST http://localhost:8000/api/certificates/issue
Headers: Authorization: Bearer <admin_token>
{
  "studentName": "John Doe",
  "studentId": "STU001",
  "institution": "Test University",
  "qualification": "Computer Science",
  "issueDate": "2024-01-15",
  "grade": "First Class"
}
```

### **5. Verify Certificate:**
```json
POST http://localhost:8000/api/certificates/verify
{
  "studentName": "John Doe",
  "studentId": "STU001",
  "institution": "Test University",
  "qualification": "Computer Science",
  "issueDate": "2024-01-15",
  "grade": "First Class"
}
```

## 🚨 **Troubleshooting:**

### **If Backend Won't Start:**
```bash
cd backend
npm install
npm run dev
```

### **If MongoDB Connection Fails:**
```bash
# Check .env file
cat backend/.env

# Should contain:
MONGODB_URI=mongodb+srv://cert_user:Cert12345@certledger.bhvnw6k.mongodb.net/?appName=certLedger
PORT=8000
```

### **If Login Still Fails:**
```bash
# Reset everything
cd backend
cat > resetAll.js << 'EOF'
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config');

async function resetAll() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Clear all users
  await User.deleteMany({});
  
  // Create fresh users
  const salt = await bcrypt.genSalt(12);
  
  await User.create([
    { username: 'student123', email: 'student123@certledger.com', password: await bcrypt.hash('Password123!', salt), role: 'student', isActive: true, isEmailVerified: true },
    { username: 'admin', email: 'admin@certledger.com', password: await bcrypt.hash('Admin123!', salt), role: 'university_admin', institution: 'Test University', isActive: true, isEmailVerified: true },
    { username: 'sysadmin', email: 'sysadmin@certledger.com', password: await bcrypt.hash('Sysadmin123!', salt), role: 'system_admin', isActive: true, isEmailVerified: true }
  ]);
  
  console.log('✅ Complete reset done');
  await mongoose.disconnect();
}
resetAll();
EOF

node resetAll.js
```

## 🎉 **Success Indicators:**

✅ **Backend starts without errors**
✅ **Health endpoint returns 200 OK**
✅ **Login returns success with token**
✅ **Certificate operations work**
✅ **All user roles can authenticate**

**Follow the step-by-step commands above - this should fix all authentication issues!** 🚀
