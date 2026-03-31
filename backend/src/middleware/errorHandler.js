const mongoose = require('mongoose');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      error: 'Validation Error',
      message,
      details: Object.keys(err.errors).map(key => ({
        field: err.errors[key].path,
        message: err.errors[key].message,
        value: err.errors[key].value
      }))
    };
    return res.status(400).json(error);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    error = {
      error: 'Duplicate Entry',
      message: `${field} already exists: ${value}`,
      field,
      value
    };
    return res.status(409).json(error);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error = {
      error: 'Invalid Data Format',
      message: 'Invalid data format provided',
      details: err.message
    };
    return res.status(400).json(error);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    error = {
      error: 'Authentication Error',
      message: 'Invalid or expired token',
      details: err.message
    };
    return res.status(401).json(error);
  }

  // Blockchain transaction errors
  if (err.message && err.message.includes('revert')) {
    error = {
      error: 'Blockchain Transaction Failed',
      message: 'Smart contract execution failed',
      details: err.message
    };
    return res.status(400).json(error);
  }

  // Default error
  const statusCode = error.statusCode || 500;
  error.timestamp = new Date().toISOString();
  error.stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(statusCode).json(error);
};

// 404 handler
const notFoundHandler = (req, res) => {
  const error = {
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  };
  
  res.status(404).json(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
