const express = require('express');
const { registerUser, loginUser, changePassword, logoutUser, getUserProfile } = require('../controllers/authController');
const { authenticateToken, requireSystemAdmin } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { validateUserRegistration, validateUserLogin, validatePasswordChange } = require('../middleware/validation');

const router = express.Router();

// User Registration (System Admin only)
router.post('/register',
  authenticateToken,
  requireSystemAdmin,
  validateRequest(validateUserRegistration),
  registerUser
);

// User Login (Public endpoint)
router.post('/login',
  validateRequest(validateUserLogin),
  loginUser
);

// Change Password (Student first login)
router.post('/change-password/:certificateId',
  authenticateToken,
  validateRequest(validatePasswordChange),
  changePassword
);

// Logout
router.post('/logout',
  authenticateToken,
  logoutUser
);

// Get User Profile
router.get('/profile',
  authenticateToken,
  getUserProfile
);

module.exports = router;
