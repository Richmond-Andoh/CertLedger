const Certificate = require('../models/Certificate');
const User = require('../models/User');
const { getContract, createWallet, waitForTransaction, getTransactionStatus } = require('../config/blockchain');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// SHA-256 hashing function
const generateHash = (studentName, studentId, institution, qualification, issueDate, grade) => {
  const data = `${studentName}|${studentId}|${institution}|${qualification}|${issueDate}|${grade}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Certificate Issuance
const issueCertificate = async (req, res) => {
  try {
    const { studentName, studentId, institution, qualification, issueDate, grade } = req.body;
    
    // Validation
    if (!studentName || !studentId || !institution || !qualification || !issueDate || !grade) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'All certificate fields are required'
      });
    }

    // Check for duplicate in database first
    const existingCert = await Certificate.findByCertificateId(studentId);
    if (existingCert) {
      return res.status(409).json({
        error: 'Duplicate Certificate',
        message: 'Certificate with this ID already exists'
      });
    }

    // Generate SHA-256 hash
    const hash = generateHash(studentName, studentId, institution, qualification, issueDate, grade);

    // Get blockchain contract
    const contract = getContract();
    const wallet = createWallet(process.env.PRIVATE_KEY);

    // Check for duplicate hash on blockchain
    const duplicateCheck = await contract.checkDuplicateHash(hash);
    if (duplicateCheck) {
      // Log anomaly
      await createAnomalyRecord(studentId, 'duplicate_hash', 'Certificate hash already exists on blockchain');
      return res.status(409).json({
        error: 'Duplicate Hash',
        message: 'Certificate hash already exists on blockchain'
      });
    }

    // Issue certificate on blockchain
    const contractWithSigner = contract.connect(wallet);
    const tx = await contractWithSigner.issueCertificate(studentId, hash, institution);
    const receipt = await waitForTransaction(tx.hash);

    if (!receipt || receipt.status !== 1) {
      return res.status(500).json({
        error: 'Blockchain Transaction Failed',
        message: 'Failed to issue certificate on blockchain',
        transactionHash: tx.hash
      });
    }

    // Save to database
    const certificate = new Certificate({
      certificateId: studentId,
      hash,
      studentName,
      studentId,
      institution,
      qualification,
      issueDate: new Date(issueDate),
      grade,
      issuer: req.user._id,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      isActive: true
    });

    await certificate.save();

    // Auto-create student account
    const studentAccount = await createStudentAccount(studentId, studentName, tx.hash);

    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      data: {
        certificateId: studentId,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        studentCredentials: {
          username: studentId,
          temporaryPassword: studentAccount.temporaryPassword
        }
      }
    });

  } catch (error) {
    console.error('Certificate issuance error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to issue certificate'
    });
  }
};

// Certificate Verification
const verifyCertificate = async (req, res) => {
  try {
    const { studentName, studentId, institution, qualification, issueDate, grade } = req.body;
    
    // Validation
    if (!studentName || !studentId || !institution || !qualification || !issueDate || !grade) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'All certificate fields are required for verification'
      });
    }

    // Generate hash from provided data
    const hash = generateHash(studentName, studentId, institution, qualification, issueDate, grade);

    // Get blockchain contract
    const contract = getContract();

    // Verify on blockchain
    const [isValid, timestamp, blockchainInstitution] = await contract.verifyCertificate(studentId, hash);

    // Get certificate from database for additional details
    const certificate = await Certificate.findByCertificateId(studentId);
    
    if (!certificate) {
      return res.status(404).json({
        error: 'Certificate Not Found',
        message: 'No certificate found with this ID',
        isValid: false
      });
    }

    res.status(200).json({
      isValid,
      timestamp: new Date(timestamp * 1000).toISOString(),
      institution: blockchainInstitution,
      certificate: {
        studentName: certificate.studentName,
        studentId: certificate.studentId,
        institution: certificate.institution,
        qualification: certificate.qualification,
        issueDate: certificate.issueDate,
        grade: certificate.grade
      }
    });

  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify certificate'
    });
  }
};

// Get Certificate Details (for student portal)
const getCertificateDetails = async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    if (!certificateId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Certificate ID is required'
      });
    }

    // Get certificate from database
    const certificate = await Certificate.findByCertificateId(certificateId);
    
    if (!certificate) {
      return res.status(404).json({
        error: 'Certificate Not Found',
        message: 'No certificate found with this ID'
      });
    }

    // Verify ownership (student can only view their own certificates)
    if (req.user.role !== 'system_admin' && req.user.username !== certificateId) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You can only view your own certificates'
      });
    }

    res.status(200).json({
      success: true,
      data: certificate.toSafeObject()
    });

  } catch (error) {
    console.error('Get certificate details error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve certificate details'
    });
  }
};

// Get Issuance History (for university admin)
const getIssuanceHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const certificates = await Certificate.findRecent(parseInt(limit));
    const total = await Certificate.countDocuments({ issuer: req.user._id });
    
    res.status(200).json({
      success: true,
      data: certificates.map(cert => cert.toSafeObject()),
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get issuance history error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve issuance history'
    });
  }
};

// Helper function to create student account
const createStudentAccount = async (studentId, studentName, transactionHash) => {
  try {
    const temporaryPassword = generateTemporaryPassword();
    
    const student = new User({
      username: studentId,
      email: `${studentId.toLowerCase().replace(/\s+/g, '.')}@student.certledger.local`,
      password: temporaryPassword,
      tempPassword: temporaryPassword,
      transactionHash: transactionHash,
      role: 'student',
      institution: 'Auto-generated',
      isActive: true,
      isEmailVerified: true
    });

    await student.save();
    return { username: studentId, temporaryPassword };
  } catch (error) {
    console.error('Student account creation error:', error);
    throw error;
  }
};

// Helper function to generate temporary password
const generateTemporaryPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Helper function to create anomaly record
const createAnomalyRecord = async (certificateId, type, reason) => {
  try {
    const Anomaly = require('../models/Anomaly');
    const anomaly = new Anomaly({
      certificateId,
      type,
      reason,
      severity: 'high',
      reporter: 'System',
      reporterAddress: '0x000000000000000000000000000000000000000000',
      institution: 'System'
    });

    await anomaly.save();
  } catch (error) {
    console.error('Anomaly creation error:', error);
  }
};

module.exports = {
  issueCertificate,
  verifyCertificate,
  getCertificateDetails,
  getIssuanceHistory
};
