const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    index: true
  },
  hash: {
    type: String,
    required: true,
    trim: true,
    minlength: 64,
    maxlength: 64,
    index: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  studentId: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  institution: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  qualification: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  issueDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return !value || value <= new Date();
      },
      message: 'Issue date cannot be in the future'
    }
  },
  grade: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'First Class',
      'Second Class Upper',
      'Second Class Lower',
      'Third Class',
      'Pass',
      'Distinction',
      'Merit'
    ]
  },
  issuer: {
    type: String,
    required: true,
    trim: true,
    ref: 'User'
  },
  transactionHash: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
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

// Indexes for better performance
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ hash: 1 });
certificateSchema.index({ studentId: 1 });
certificateSchema.index({ institution: 1 });
certificateSchema.index({ createdAt: -1 });

// Static methods
certificateSchema.statics.findByCertificateId = function(certificateId) {
  return this.findOne({ certificateId: certificateId.toUpperCase(), isActive: true });
};

certificateSchema.statics.findByStudentId = function(studentId) {
  return this.findOne({ studentId: studentId.toUpperCase(), isActive: true });
};

certificateSchema.statics.findByHash = function(hash) {
  return this.findOne({ hash: hash, isActive: true });
};

certificateSchema.statics.findRecent = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('issuer', 'username email role');
};

// Instance methods
certificateSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Certificate', certificateSchema);
