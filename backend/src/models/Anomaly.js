const mongoose = require('mongoose');

const anomalySchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['duplicate_hash', 'rate_spike', 'incomplete_record', 'suspicious_activity'],
    trim: true
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  reporter: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  reporterAddress: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    trim: true,
    maxlength: 100
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: String,
    trim: true
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
anomalySchema.index({ certificateId: 1 });
anomalySchema.index({ type: 1 });
anomalySchema.index({ severity: 1 });
anomalySchema.index({ createdAt: -1 });

// Static methods
anomalySchema.statics.findByCertificateId = function(certificateId) {
  return this.find({ certificateId }).sort({ createdAt: -1 });
};

anomalySchema.statics.findByType = function(type) {
  return this.find({ type }).sort({ createdAt: -1 });
};

anomalySchema.statics.findBySeverity = function(severity) {
  return this.find({ severity }).sort({ createdAt: -1 });
};

anomalySchema.statics.findUnresolved = function() {
  return this.find({ resolved: false }).sort({ createdAt: -1 });
};

anomalySchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        latest: { $max: '$createdAt' }
      }
    },
    {
      $group: {
        _id: '$severity',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance methods
anomalySchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

anomalySchema.methods.resolve = function(resolvedBy) {
  this.resolved = true;
  this.resolvedAt = new Date();
  this.resolvedBy = resolvedBy;
  return this.save();
};

module.exports = mongoose.model('Anomaly', anomalySchema);
