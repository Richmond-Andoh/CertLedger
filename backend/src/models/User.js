const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    required: true,
    enum: ['system_admin', 'university_admin', 'student'],
    default: 'student'
  },
  institution: {
    type: String,
    trim: true,
    maxlength: 100
  },
  tempPassword: {
    type: String,
    trim: true
  },
  transactionHash: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  versionKey: '_version'
});

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ institution: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Static methods
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username.toLowerCase(), isActive: true });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

userSchema.statics.findByRole = function(role) {
  return this.find({ role: role, isActive: true });
};

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    if (!this.password) {
      throw new Error('Password field is not selected or is undefined');
    }
    if (!candidatePassword) {
      throw new Error('Candidate password is undefined');
    }
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error.message);
    throw error;
  }
};

userSchema.methods.isLocked = function() {
  // Account locking disabled for now
  return false;
};

userSchema.methods.incrementLoginAttempts = function() {
  this.loginAttempts += 1;
  // Locking logic removed for now
  return this.save();
};

userSchema.methods.resetLoginAttempts = function() {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 3600000; // 1 hour
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
