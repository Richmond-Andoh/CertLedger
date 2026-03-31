const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'No token provided'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'Token format is invalid'
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-super-secret-jwt-secret-key'
    );

    if (!decoded) {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'Token is invalid'
      });
    }

    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'User not found or inactive'
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'Token is invalid'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// System admin middleware
const requireSystemAdmin = authorizeRole('system_admin');

// University admin middleware
const requireUniversityAdmin = authorizeRole('university_admin');

// Student middleware
const requireStudent = authorizeRole('student');

// University admin or system admin middleware
const requireAdmin = authorizeRole('university_admin', 'system_admin');

module.exports = {
  authenticateToken,
  authorizeRole,
  requireSystemAdmin,
  requireUniversityAdmin,
  requireStudent,
  requireAdmin
};
