# 🧪 **Postman API Testing Guide**

## 🚀 **Setup Instructions**

### **1. Environment Setup**
- **Base URL:** `http://localhost:8000`
- **Content-Type:** `application/json`
- **Port:** 8000 (Backend running)

### **2. Start Backend**
```bash
cd backend && npm run dev
```

## 📋 **API Endpoints Testing**

### **🔐 Authentication Endpoints**

#### **POST /api/auth/register**
```json
// Body
{
  "username": "testuser123",
  "password": "password123",
  "role": "student"
}

// Expected Response
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "username": "testuser123",
    "role": "student"
  }
}
```

#### **POST /api/auth/login**
```json
// Body
{
  "username": "student123",
  "password": "password123"
}

// Expected Response
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

### **📜 Certificate Endpoints**

#### **POST /api/certificates/issue**
```json
// Headers: Authorization: Bearer <token>
// Body
{
  "studentName": "John Doe",
  "studentId": "STU001",
  "institution": "Test University",
  "qualification": "Computer Science",
  "issueDate": "2024-01-15",
  "grade": "First Class"
}

// Expected Response
{
  "success": true,
  "message": "Certificate issued successfully",
  "data": {
    "studentName": "John Doe",
    "studentId": "STU001",
    "transactionHash": "0x1234567890abcdef...",
    "blockNumber": 12345,
    "studentCredentials": {
      "username": "STU001",
      "temporaryPassword": "temp123456"
    }
  }
}
```

#### **POST /api/certificates/verify**
```json
// Body
{
  "studentName": "John Doe",
  "studentId": "STU001",
  "institution": "Test University",
  "qualification": "Computer Science",
  "issueDate": "2024-01-15",
  "grade": "First Class"
}

// Expected Response
{
  "success": true,
  "isValid": true,
  "message": "Certificate verified successfully",
  "data": {
    "studentName": "John Doe",
    "studentId": "STU001",
    "institution": "Test University",
    "verificationDate": "2024-01-15T10:30:00.000Z"
  }
}
```

#### **GET /api/certificates/details/:studentId**
```json
// Headers: Authorization: Bearer <token>
// URL: http://localhost:8000/api/certificates/details/STU001

// Expected Response
{
  "success": true,
  "data": {
    "studentName": "John Doe",
    "studentId": "STU001",
    "institution": "Test University",
    "qualification": "Computer Science",
    "grade": "First Class",
    "issueDate": "2024-01-15",
    "transactionHash": "0x1234567890abcdef...",
    "blockNumber": 12345
  }
}
```

### **👥 Admin Endpoints**

#### **POST /api/admin/authorize-issuer**
```json
// Headers: Authorization: Bearer <sysadmin_token>
// Body
{
  "institution": "Test University",
  "address": "0x1234567890abcdef...",
  "role": "admin"
}

// Expected Response
{
  "success": true,
  "message": "Issuer authorized successfully"
}
```

#### **GET /api/admin/dashboard**
```json
// Headers: Authorization: Bearer <sysadmin_token>
// Expected Response
{
  "success": true,
  "data": {
    "overview": {
      "totalCertificates": 150,
      "totalUsers": 75,
      "activeUsers": 45,
      "recentAnomalies": 2
    },
    "userStats": {
      "student": 50,
      "admin": 20,
      "system_admin": 5
    },
    "anomalyStats": {
      "duplicate_certificates": 1,
      "unauthorized_access": 1,
      "blockchain_mismatch": 0
    }
  }
}
```

#### **GET /api/admin/users**
```json
// Headers: Authorization: Bearer <sysadmin_token>
// URL: http://localhost:8000/api/admin/users?page=1&limit=10

// Expected Response
{
  "success": true,
  "data": {
    "users": [
      {
        "username": "student123",
        "role": "student",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 75
    }
  }
}
```

## 🧪 **Test Scenarios**

### **Scenario 1: Complete Certificate Flow**
1. **Register Student:** `POST /api/auth/register`
2. **Login Student:** `POST /api/auth/login`
3. **Login Admin:** `POST /api/auth/login` (admin credentials)
4. **Issue Certificate:** `POST /api/certificates/issue`
5. **Verify Certificate:** `POST /api/certificates/verify`
6. **View Certificate:** `GET /api/certificates/details/:studentId`

### **Scenario 2: Admin Management**
1. **Login System Admin:** `POST /api/auth/login` (sysadmin)
2. **Authorize University:** `POST /api/admin/authorize-issuer`
3. **View Dashboard:** `GET /api/admin/dashboard`
4. **View Users:** `GET /api/admin/users`

### **Scenario 3: Error Testing**
1. **Invalid Login:** Wrong credentials
2. **Duplicate Registration:** Same username
3. **Invalid Certificate:** Non-existent certificate
4. **Unauthorized Access:** Missing/invalid token

## 🎯 **Demo Credentials**

| Role | Username | Password | Test Purpose |
|-------|----------|----------|-------------|
| Student | student123 | password123 | Student operations |
| Admin | admin | admin123 | Certificate issuance |
| System Admin | sysadmin | sysadmin123 | System management |

## 📊 **Expected Results**

### **Success Criteria:**
- ✅ **200 OK** for successful operations
- ✅ **201 Created** for new resources
- ✅ **JWT Token** returned on login
- ✅ **Blockchain transaction** hash returned
- ✅ **Proper error messages** for failures

### **Error Handling:**
- ✅ **400 Bad Request** for invalid input
- ✅ **401 Unauthorized** for missing/invalid token
- ✅ **403 Forbidden** for insufficient permissions
- ✅ **404 Not Found** for non-existent resources
- ✅ **500 Server Error** for internal issues

## 🔧 **Postman Collection Setup**

### **1. Create Collection**
- Name: "CertLedger API"
- Base URL: `http://localhost:8000`

### **2. Set Variables**
```
base_url = http://localhost:8000
student_token = <login_response_token>
admin_token = <login_response_token>
sysadmin_token = <login_response_token>
```

### **3. Test Order**
1. **Health Check:** `GET /health`
2. **Register:** `POST /api/auth/register`
3. **Login (All Roles):** `POST /api/auth/login`
4. **Issue Certificate:** `POST /api/certificates/issue`
5. **Verify Certificate:** `POST /api/certificates/verify`
6. **Admin Operations:** `POST /api/admin/*`

## 🎉 **Testing Complete**

Run through all endpoints and verify:
- ✅ **Response codes** are correct
- ✅ **Data formats** match expected
- ✅ **Error handling** works properly
- ✅ **Authentication** functions correctly
- ✅ **Blockchain integration** works

**All endpoints should be fully functional!** 🚀
