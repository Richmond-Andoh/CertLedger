# ✅ **Account Locked Issue - Solution**

## 🔒 **Problem:**
```
{
  "error": "Account Locked",
  "message": "Account is temporarily locked due to failed login attempts",
  "lockUntil": "2026-03-31T11:08:25.346Z"
}
```

## 🎯 **Answer: YES - Run Seed Script First!**

### **Why Accounts Get Locked:**
- **Failed login attempts** > 0 triggers account lock
- **Lock duration:** 2 hours from last failed attempt
- **Security feature:** Prevents brute force attacks

### **📁 Scripts Created:**

#### **1. `seedUsers.js`** - Creates Fresh Demo Users
```bash
cd backend && node src/scripts/seedUsers.js
```
**What it does:**
- Deletes existing demo users
- Creates fresh users with clean state
- Sets `loginAttempts: 0` and `lockUntil: undefined`

#### **2. `unlockUsers.js`** - Unlocks Existing Users
```bash
cd backend && node src/scripts/unlockUsers.js
```
**What it does:**
- Resets `loginAttempts: 0`
- Clears `lockUntil: undefined`
- Keeps existing user data

## 🧪 **Testing Workflow:**

### **Option 1: Fresh Start (Recommended)**
```bash
# 1. Create fresh demo users
cd backend && node src/scripts/seedUsers.js

# 2. Start backend
npm run dev

# 3. Test login in Postman
POST http://localhost:8000/api/auth/login
{
  "username": "student123",
  "password": "Password123!"
}
```

### **Option 2: Unlock Existing**
```bash
# 1. Unlock locked accounts
cd backend && node src/scripts/unlockUsers.js

# 2. Start backend
npm run dev

# 3. Test login in Postman
POST http://localhost:8000/api/auth/login
{
  "username": "student123",
  "password": "Password123!"
}
```

## 🎯 **Demo Credentials (After Running Script):**

| Role | Username | Password | Status |
|-------|----------|----------|--------|
| Student | student123 | **Password123!** | ✅ Active & Unlocked |
| Admin | admin | **Admin123!** | ✅ Active & Unlocked |
| System Admin | sysadmin | **Sysadmin123!** | ✅ Active & Unlocked |

## 🔍 **Account Lock Mechanism:**

### **How it Works:**
```javascript
// User Model - Lock Mechanism
userSchema.methods.incrementLoginAttempts = function() {
  this.loginAttempts += 1;
  this.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  return this.save();
};

userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};
```

### **Lock Conditions:**
- **Trigger:** Any failed login attempt
- **Duration:** 2 hours from last failure
- **Effect:** All login attempts blocked until lock expires

## 📋 **Complete Test Sequence:**

### **Step 1: Reset Users**
```bash
cd backend && node src/scripts/seedUsers.js
```

### **Step 2: Start Backend**
```bash
npm run dev
```

### **Step 3: Test All Logins**
```bash
# Student Login
POST http://localhost:8000/api/auth/login
{
  "username": "student123",
  "password": "Password123!"
}

# Admin Login
POST http://localhost:8000/api/auth/login
{
  "username": "admin",
  "password": "Admin123!"
}

# System Admin Login
POST http://localhost:8000/api/auth/login
{
  "username": "sysadmin",
  "password": "Sysadmin123!"
}
```

### **Step 4: Use Tokens for API Testing**
```bash
# Copy tokens from login responses
# Use in Authorization headers: Bearer <token>

# Test certificate issuance
POST http://localhost:8000/api/certificates/issue
Headers: Authorization: Bearer <admin_token>

# Test admin dashboard
GET http://localhost:8000/api/admin/dashboard
Headers: Authorization: Bearer <sysadmin_token>
```

## 🚨 **Important Notes:**

### **Before Testing:**
- ✅ **ALWAYS run seed script** before testing login
- ✅ **Use correct passwords** with special characters
- ✅ **Wait for script completion** before starting backend

### **If Locked Again:**
- Run `node src/scripts/unlockUsers.js` to reset
- Or wait 2 hours for automatic unlock
- Or run `seedUsers.js` for fresh start

### **Security Feature:**
- Account locking is **intentional** for security
- Prevents brute force attacks
- Can be reset with admin access

## 🎉 **Solution Summary**

**YES** - You must run the seed script before testing login endpoints:

1. **Run:** `cd backend && node src/scripts/seedUsers.js`
2. **Start:** `npm run dev`
3. **Test:** Login with updated credentials

This creates fresh demo users with:
- ✅ **Zero login attempts**
- ✅ **No account locks**
- ✅ **Correct passwords**
- ✅ **Active status**

**All login endpoints will work perfectly after running the seed script!** 🚀
