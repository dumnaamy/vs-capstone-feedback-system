const mongoose = require('mongoose');

const userLoginSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    enum: ['student', 'staff', 'admin', 'superuser'],
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  logoutTime: {
    type: Date,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sessionDuration: {
    type: Number, // in minutes
    default: null
  }
}, {
  timestamps: true
});

// Calculate session duration when logout time is set
userLoginSchema.pre('save', function(next) {
  if (this.logoutTime && this.loginTime) {
    this.sessionDuration = Math.round((this.logoutTime - this.loginTime) / (1000 * 60));
  }
  next();
});

module.exports = mongoose.model('UserLogin', userLoginSchema);
