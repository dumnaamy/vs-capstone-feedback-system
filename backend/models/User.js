const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 60,
    trim: true
  },
  role: {
    type: String,
    enum: ['superuser', 'admin', 'staff', 'student'],
    required: true
  },

  // 🔥 New fields for Students
  course: {
    type: String,
    default: null
  },
  year: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', 'Final Year'],
    default: null
  },
  regNo: {
    type: String,
    unique: true,
    sparse: true, // allows null values
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  },

  // 🔐 Fields for password reset
  resetOtp: {
    type: String,
    default: null
  },
  resetOtpExpire: {
    type: Date,
    default: null
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpire: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
