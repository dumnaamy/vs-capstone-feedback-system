const express = require('express');
const { 
  login, 
  signup, 
  forgotPassword, 
  verifyOtp,   // 👈 add this
  resendOtp,
  resetPassword, 
  logout 
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/signup', signup);
router.post('/forgot-password', forgotPassword);
router.post('/resend-otp', resendOtp); 
router.post('/verify-otp', verifyOtp);   // 👈 NEW
router.post('/reset-password', resetPassword);
router.post('/logout', auth, logout);

module.exports = router;
