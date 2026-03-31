const User = require('../models/User');
const Anomaly = require('../models/Anomaly');
const { getContract, createWallet } = require('../config/blockchain');

// Authorize University Admin
const authorizeIssuer = async (req, res) => {
  try {
    const { issuerAddress, institution } = req.body;
    
    // Only system admin can authorize issuers
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Only system admin can authorize university administrators'
      });
    }

    // Validation
    if (!issuerAddress || !institution) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Issuer address and institution name are required'
      });
    }

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(issuerAddress)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid Ethereum address format'
      });
    }

    // Get blockchain contract
    const contract = getContract();
    const wallet = createWallet(process.env.PRIVATE_KEY);

    // Authorize on blockchain
    const tx = await contract.authorizeIssuer(issuerAddress, institution);
    const receipt = await waitForTransaction(tx.hash);

    if (!receipt || receipt.status !== 1) {
      return res.status(500).json({
        error: 'Blockchain Transaction Failed',
        message: 'Failed to authorize issuer on blockchain',
        transactionHash: tx.hash
      });
    }

    // Create user record
    const user = new User({
      username: `admin_${Date.now()}`,
      email: `${issuerAddress}@admin.certledger.local`,
      password: 'tempPassword123', // Will be hashed by pre-save middleware
      role: 'university_admin',
      institution,
      isActive: true,
      isEmailVerified: true
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'University admin authorized successfully',
      data: {
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        issuerAddress,
        institution,
        userId: user._id
      }
    });

  } catch (error) {
    console.error('Authorize issuer error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to authorize university admin'
    });
  }
};

// Deauthorize University Admin
const deauthorizeIssuer = async (req, res) => {
  try {
    const { issuerId } = req.body;
    
    // Only system admin can deauthorize issuers
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Only system admin can deauthorize university administrators'
      });
    }

    // Validation
    if (!issuerId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Issuer ID is required'
      });
    }

    // Find and deactivate user
    const user = await User.findById(issuerId);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'University admin not found'
      });
    }

    if (user.role !== 'university_admin') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'User is not a university admin'
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'University admin deauthorized successfully'
    });

  } catch (error) {
    console.error('Deauthorize issuer error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to deauthorize university admin'
    });
  }
};

// Reset Student Password
const resetStudentPassword = async (req, res) => {
  try {
    const { studentId } = req.body;
    
    // Only system admin can reset passwords
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Only system admin can reset student passwords'
      });
    }

    // Validation
    if (!studentId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Student ID is required'
      });
    }

    // Find student
    const student = await User.findByUsername(studentId);
    if (!student) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'Student not found'
      });
    }

    if (student.role !== 'student') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'User is not a student'
      });
    }

    // Generate new temporary password
    const crypto = require('crypto');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Update password
    student.password = newPassword; // Will be hashed by pre-save middleware
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student password reset successfully',
      data: {
        username: student.username,
        temporaryPassword: newPassword
      }
    });

  } catch (error) {
    console.error('Reset student password error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to reset student password'
    });
  }
};

// Get All Users (System Admin)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: users.map(user => user.toSafeObject()),
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve users'
    });
  }
};

// Get Anomaly Reports
const getAnomalyReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, severity, type } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (severity) query.severity = severity;
    if (type) query.type = type;
    
    const anomalies = await Anomaly.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Anomaly.countDocuments(query);
    const anomalyStats = await Anomaly.getStats();
    
    res.status(200).json({
      success: true,
      data: anomalies.map(anomaly => anomaly.toSafeObject()),
      anomalyStats,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get anomaly reports error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve anomaly reports'
    });
  }
};

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    // Get various statistics
    const totalCertificates = await require('../models/Certificate').countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAnomalies = await Anomaly.countDocuments();
    const recentAnomalies = await Anomaly.findUnresolved();
    const anomalyStats = await Anomaly.getStats();
    
    // Get user counts by role
    const userStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCertificates,
          totalUsers,
          totalAnomalies,
          activeUsers: await User.countDocuments({ isActive: true }),
          recentAnomalies: recentAnomalies.length
        },
        userStats: userStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        anomalyStats: anomalyStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve dashboard statistics'
    });
  }
};

// Helper function for transaction waiting
const waitForTransaction = async (txHash, timeout = 60000) => {
  try {
    const { getProvider } = require('../config/blockchain');
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash, timeout);
    return receipt;
  } catch (error) {
    console.error('Transaction confirmation error:', error.message);
    throw error;
  }
};

module.exports = {
  authorizeIssuer,
  deauthorizeIssuer,
  resetStudentPassword,
  getAllUsers,
  getAnomalyReports,
  getDashboardStats
};
