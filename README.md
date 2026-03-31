# 🚀 CertLedger Backend API

## 📋 **Complete Production-Ready Backend**

A secure, scalable, and production-ready Node.js backend API that connects to your deployed smart contract.

## ✅ **Features Implemented**

### **🔐 Security**
- JWT-based authentication with role-based access control
- Input validation and sanitization against XSS, NoSQL injection
- Rate limiting to prevent abuse
- Helmet.js for security headers
- CORS configuration for cross-origin requests
- Password hashing with bcrypt
- Account lockout after failed attempts

### **🔗 Blockchain Integration**
- Ethereum smart contract integration via ethers.js
- SHA-256 hashing for certificate integrity
- Transaction monitoring and confirmation
- Gas optimization and error handling
- Sepolia testnet deployment ready

### **📊 Database**
- MongoDB with Mongoose ODM
- Optimized indexes for performance
- Data validation and schema enforcement
- Graceful connection handling
- Automatic student account creation

### **🎯 API Endpoints**

#### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (admin only)
- `POST /api/auth/change-password/:certificateId` - Password change
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

#### **Certificate Management**
- `POST /api/certificates/issue` - Issue new certificate (admin)
- `POST /api/certificates/verify` - Verify certificate (public)
- `GET /api/certificates/:certificateId` - Get certificate details (student)
- `GET /api/certificates/history` - Get issuance history (admin)

#### **Administration**
- `POST /api/admin/authorize-issuer` - Authorize university admin
- `POST /api/admin/deauthorize-issuer` - Deauthorize university admin
- `POST /api/admin/reset-student-password` - Reset student password
- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/anomalies` - Get anomaly reports (admin)
- `GET /api/admin/dashboard` - Get dashboard statistics (admin)

#### **System**
- `GET /health` - Health check endpoint

## 🛠️ **Tech Stack**

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18+
- **Database:** MongoDB with Mongoose 7.5+
- **Blockchain:** Ethereum + ethers.js 5.7+
- **Authentication:** JWT + bcrypt
- **Security:** Helmet, CORS, rate limiting, input validation
- **Validation:** express-validator

## 📁 **Project Structure**

```
src/
├── app.js                 # Main Express application
├── server.js              # Server startup and database connection
├── config/
│   ├── database.js       # MongoDB connection
│   └── blockchain.js     # Blockchain configuration
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── certificateController.js # Certificate operations
│   └── adminController.js     # Admin operations
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── validation.js        # Input validation
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User schema and methods
│   ├── Certificate.js       # Certificate schema
│   └── Anomaly.js           # Anomaly tracking
└── routes/
    ├── authRoutes.js         # Authentication routes
    ├── certificateRoutes.js  # Certificate routes
    └── adminRoutes.js         # Admin routes
```

## 🚀 **Getting Started**

### **1. Environment Setup**
```bash
# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### **2. Environment Variables**
Required environment variables are in `.env.example` file.

### **3. Database Setup**
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in .env
```

### **4. API Testing**
```bash
# Run tests
npm test

# Start with nodemon for development
npm run dev
```

## 🔒 **Security Features**

- **Input Validation:** All endpoints validate and sanitize inputs
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **CORS Protection:** Configurable allowed origins
- **SQL Injection Prevention:** Mongoose ODM protection
- **XSS Protection:** Input sanitization and output encoding
- **Password Security:** bcrypt hashing with salt rounds
- **JWT Security:** Token-based authentication with expiration
- **Account Lockout:** Temporary lock after failed attempts

## 📊 **Performance Features**

- **Database Indexes:** Optimized queries for certificate lookup
- **Connection Pooling:** MongoDB connection pooling
- **Caching:** JWT tokens for session management
- **Compression:** Response compression for faster transfers
- **Monitoring:** Request logging and error tracking

## 🎯 **Production Deployment**

The backend is production-ready with:
- ✅ Error handling and logging
- ✅ Graceful shutdown handling
- ✅ Environment-based configuration
- ✅ Security headers and CORS
- ✅ Rate limiting and DDoS protection
- ✅ Database connection resilience
- ✅ Blockchain transaction monitoring

## 📝 **API Documentation Format**

All endpoints return consistent JSON responses:
```json
{
  "success": true|false,
  "message": "Human-readable message",
  "data": {...},  // Optional: response data
  "error": "error-code",  // Optional: error type
  "details": [...],     // Optional: validation errors
  "timestamp": "2023-...",
  "pagination": {...}  // Optional: for list endpoints
}
```

## 🎉 **Ready for Frontend Integration**

This backend provides all APIs needed for your React frontend:
- Certificate issuance and verification
- Multi-role authentication
- Student portal access
- Admin dashboard functionality
- Real-time anomaly detection

**Backend development complete!** Ready for frontend integration.
