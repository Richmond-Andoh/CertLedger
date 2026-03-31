const { body, validationResult } = require('express-validator');

// Certificate issuance validation
const validateCertificateIssuance = [
  body('studentName')
    .notEmpty()
    .withMessage('Student name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Student name must be between 2 and 100 characters')
    .trim(),
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Student ID must be between 3 and 50 characters')
    .trim(),
  body('institution')
    .notEmpty()
    .withMessage('Institution name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Institution name must be between 3 and 100 characters')
    .trim(),
  body('qualification')
    .notEmpty()
    .withMessage('Qualification is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Qualification must be between 3 and 100 characters')
    .trim(),
  body('issueDate')
    .notEmpty()
    .withMessage('Issue date is required')
    .isISO8601()
    .withMessage('Issue date must be a valid date')
    .toDate(),
  body('grade')
    .notEmpty()
    .withMessage('Grade is required')
    .isIn(['First Class', 'Second Class Upper', 'Second Class Lower', 'Third Class', 'Pass', 'Distinction', 'Merit'])
    .withMessage('Grade must be a valid classification')
    .trim()
];

// Certificate verification validation
const validateCertificateVerification = [
  body('studentName')
    .notEmpty()
    .withMessage('Student name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Student name must be between 2 and 100 characters')
    .trim(),
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Student ID must be between 3 and 50 characters')
    .trim(),
  body('institution')
    .notEmpty()
    .withMessage('Institution name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Institution name must be between 3 and 100 characters')
    .trim(),
  body('qualification')
    .notEmpty()
    .withMessage('Qualification is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Qualification must be between 3 and 100 characters')
    .trim(),
  body('issueDate')
    .notEmpty()
    .withMessage('Issue date is required')
    .isISO8601()
    .withMessage('Issue date must be a valid date')
    .toDate(),
  body('grade')
    .notEmpty()
    .withMessage('Grade is required')
    .isIn(['First Class', 'Second Class Upper', 'Second Class Lower', 'Third Class', 'Pass', 'Distinction', 'Merit'])
    .withMessage('Grade must be a valid classification')
    .trim()
];

// User registration validation
const validateUserRegistration = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .trim(),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['system_admin', 'university_admin'])
    .withMessage('Role must be system_admin or university_admin')
    .trim(),
  body('institution')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Institution name must be less than 100 characters')
    .trim()
];

// User login validation
const validateUserLogin = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .trim()
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .trim(),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .trim()
];

// Issuer authorization validation
const validateIssuerAuthorization = [
  body('issuerAddress')
    .notEmpty()
    .withMessage('Issuer address is required')
    .isEthereumAddress()
    .withMessage('Please provide a valid Ethereum address')
    .trim(),
  body('institution')
    .notEmpty()
    .withMessage('Institution name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Institution name must be between 3 and 100 characters')
    .trim()
];

// Validation middleware
const validateRequest = (validationRules) => {
  return (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return next();
    }
    
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Request validation failed',
      details: formattedErrors
    });
  };
};

module.exports = {
  validateCertificateIssuance,
  validateCertificateVerification,
  validateUserRegistration,
  validateUserLogin,
  validatePasswordChange,
  validateIssuerAuthorization,
  validateRequest
};
