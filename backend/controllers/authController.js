// backend/controllers/authController.js
const User = require('../models/User');
const UserLogin = require('../models/UserLogin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const credentialService = require('../services/credentialService');
const crypto = require('crypto');
const { sendEmail } = require('../services/emailService'); // ✅ email sender

// ====================== LOGIN ======================
const login = async (req, res) => {
  const { email, username, identifier, password } = req.body;

  try {
    let query;
    if (email) query = { email };
    else if (username) query = { username };
    else if (identifier) query = { $or: [{ email: identifier }, { username: identifier }] };
    else return res.status(400).json({ message: 'Email or username is required' });

    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const jwtSecret = await credentialService.getJWTSecret();
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });

    // track login
    try {
      const loginSession = new UserLogin({
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        userRole: user.role,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      });
      await loginSession.save();
    } catch (err) {
      console.error('Error tracking login session:', err);
    }

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ====================== SIGNUP ======================
const signup = async (req, res) => {
  const { name, email, username, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) return res.status(400).json({ message: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      username,
      password: hashedPassword,
      role: role || 'student',
    });

    await user.save();

    const jwtSecret = await credentialService.getJWTSecret();
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ====================== FORGOT PASSWORD FLOW ======================

// util store (in-memory)
global.otpStore = global.otpStore || {};
const OTP_EXPIRY_MS = 5 * 60 * 1000;

// Forgot password (generate OTP)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = crypto.randomBytes(32).toString('hex');

    global.otpStore[email] = {
      otp,
      resetToken,
      expires: Date.now() + OTP_EXPIRY_MS,
    };

    await sendEmail(email, 'Your OTP', `Your OTP is ${otp}. It expires in 5 minutes.`);

    return res.json({ message: 'OTP sent successfully', resetToken });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ error: 'Failed to send OTP email' });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = crypto.randomBytes(32).toString('hex');

    global.otpStore[email] = {
      otp,
      resetToken,
      expires: Date.now() + OTP_EXPIRY_MS,
    };

    await sendEmail(email, 'Your new OTP', `Your new OTP is ${otp}. It expires in 5 minutes.`);

    return res.json({ message: 'OTP resent successfully', resetToken });
  } catch (err) {
    console.error('resendOtp error:', err);
    return res.status(500).json({ error: 'Failed to resend OTP email' });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { otp, token } = req.body;
    if (!otp || !token) return res.status(400).json({ error: 'OTP and token required' });

    const entryKey = Object.keys(global.otpStore).find(
      k => global.otpStore[k].resetToken === token
    );
    if (!entryKey) return res.status(400).json({ error: 'Invalid or expired token' });

    const entry = global.otpStore[entryKey];
    if (Date.now() > entry.expires) {
      delete global.otpStore[entryKey];
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (entry.otp !== otp) return res.status(400).json({ error: 'Incorrect OTP' });

    entry.verified = true;

    return res.json({ message: 'OTP verified' });
  } catch (err) {
    console.error('verifyOtp error:', err);
    return res.status(500).json({ error: 'OTP verification failed' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ error: 'Token and new password required' });

    const entryKey = Object.keys(global.otpStore).find(
      k => global.otpStore[k].resetToken === token
    );
    if (!entryKey) return res.status(400).json({ error: 'Invalid or expired token' });

    const entry = global.otpStore[entryKey];
    if (Date.now() > entry.expires) {
      delete global.otpStore[entryKey];
      return res.status(400).json({ error: 'Token expired' });
    }

    if (!entry.verified) return res.status(400).json({ error: 'OTP not verified' });

    const user = await User.findOne({ email: entryKey });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    delete global.otpStore[entryKey];

    return res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ error: 'Password reset failed' });
  }
};

// ====================== LOGOUT ======================
const logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    const activeSession = await UserLogin.findOne({
      userId,
      isActive: true,
    }).sort({ loginTime: -1 });

    if (!activeSession) return res.status(400).json({ message: 'No active session found' });

    activeSession.logoutTime = new Date();
    activeSession.isActive = false;
    await activeSession.save();

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ====================== EXPORTS ======================
module.exports = {
  login,
  signup,
  forgotPassword,
  resendOtp,
  verifyOtp,
  resetPassword,
  logout,
};
