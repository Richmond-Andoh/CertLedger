const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (userId, role, expiresIn = '24h') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'your-super-secret-jwt-secret-key',
    { expiresIn }
  );
};

// User Registration (System Admin only)
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, institution } = req.body;
    
    // Only system admin can register new users
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Only system admin can register new users'
      });
    }

    // Validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Username, email, password, and role are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByUsername(username) || await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User Exists',
        message: 'Username or email already exists'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password, // Will be hashed by pre-save middleware
      role,
      institution: institution || 'Not specified',
      isActive: true
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register user'
    });
  }
};

// User Login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Username and password are required'
      });
    }

    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        error: 'Account Locked',
        message: 'Account is temporarily locked due to failed login attempts',
        lockUntil: user.lockUntil
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to authenticate user'
    });
  }
};

// Student Password Change (First Login)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { certificateId } = req.params;
    
    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Current password and new password are required'
      });
    }

    // Get student
    const student = await User.findByUsername(certificateId);
    if (!student) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'Student account not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await student.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Current password is incorrect'
      });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'New password must be at least 8 characters long'
      });
    }

    // Update password
    student.password = newPassword; // Will be hashed by pre-save middleware
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to change password'
    });
  }
};

// Logout
const logoutUser = async (req, res) => {
  try {
    // In a stateless JWT implementation, logout is handled client-side
    // by removing the token from client storage
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to logout'
    });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.toSafeObject()
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user profile'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  logoutUser,
  getUserProfile
};
