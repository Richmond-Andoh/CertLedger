const express = require('express');
const { issueCertificate, verifyCertificate, getCertificateDetails, getIssuanceHistory } = require('../controllers/certificateController');
const { authenticateToken, requireUniversityAdmin, requireStudent } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { validateCertificateIssuance, validateCertificateVerification } = require('../middleware/validation');

const router = express.Router();

// Issue Certificate (University Admin only)
router.post('/issue',
  authenticateToken,
  requireUniversityAdmin,
  validateRequest(validateCertificateIssuance),
  issueCertificate
);

// Verify Certificate (Public endpoint)
router.post('/verify',
  validateRequest(validateCertificateVerification),
  verifyCertificate
);

// Get Certificate Details (Student only)
router.get('/:certificateId',
  authenticateToken,
  requireStudent,
  getCertificateDetails
);

// Get Issuance History (University Admin only)
router.get('/history',
  authenticateToken,
  requireUniversityAdmin,
  getIssuanceHistory
);

module.exports = router;
