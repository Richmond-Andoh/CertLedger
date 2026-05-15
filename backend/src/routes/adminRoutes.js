const express = require('express');
const { authorizeIssuer, deauthorizeIssuer, toggleUserStatus, deleteUser, resetUserPassword, getAllUsers, getAnomalyReports, getDashboardStats } = require('../controllers/adminController');
const { authenticateToken, requireSystemAdmin } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { validateIssuerAuthorization } = require('../middleware/validation');

const router = express.Router();

// Authorize University Admin
router.post('/authorize-issuer',
  authenticateToken,
  requireSystemAdmin,
  validateRequest(validateIssuerAuthorization),
  authorizeIssuer
);

// Deauthorize University Admin
router.post('/deauthorize-issuer',
  authenticateToken,
  requireSystemAdmin,
  deauthorizeIssuer
);

// Reset User Password
router.post('/reset-password',
  authenticateToken,
  requireSystemAdmin,
  resetUserPassword
);

// Get All Users
router.get('/users',
  authenticateToken,
  requireSystemAdmin,
  getAllUsers
);

// Get Anomaly Reports
router.get('/anomalies',
  authenticateToken,
  requireSystemAdmin,
  getAnomalyReports
);

// Toggle User Status
router.patch('/toggle-status/:userId',
  authenticateToken,
  requireSystemAdmin,
  toggleUserStatus
);

// Delete User
router.delete('/user/:userId',
  authenticateToken,
  requireSystemAdmin,
  deleteUser
);

// Get Dashboard Stats
router.get('/dashboard',
  authenticateToken,
  requireSystemAdmin,
  getDashboardStats
);

module.exports = router;
