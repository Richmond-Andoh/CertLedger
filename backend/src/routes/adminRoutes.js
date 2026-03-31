const express = require('express');
const { authorizeIssuer, deauthorizeIssuer, resetStudentPassword, getAllUsers, getAnomalyReports, getDashboardStats } = require('../controllers/adminController');
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

// Reset Student Password
router.post('/reset-student-password',
  authenticateToken,
  requireSystemAdmin,
  resetStudentPassword
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

// Get Dashboard Stats
router.get('/dashboard',
  authenticateToken,
  requireSystemAdmin,
  getDashboardStats
);

module.exports = router;
