require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/database');
const { initializeBlockchain } = require('./config/blockchain');

// Initialize database connection
connectDB().then(() => {
  // Initialize blockchain connection
  const blockchainReady = initializeBlockchain();
  if (!blockchainReady) {
    console.error('❌ Failed to initialize blockchain connection');
    process.exit(1);
  }
  
  // Start the Express app
  const app = require('./app');
  const PORT = process.env.PORT || 8000;

  const server = app.listen(PORT, () => {
    console.log(`🚀 CertLedger API Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Contract: ${process.env.CONTRACT_ADDRESS}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => process.exit(0));
  });

}).catch(error => {
  console.error('❌ Failed to connect to MongoDB:', error);
  process.exit(1);
});
