const express = require('express');
const router = express.Router();
const { auth, authorizeRole } = require('../middleware/auth');
const {
  getDashboardData,
  getUserLoginHistory,
  getAllLoginSessions,
  updateFeedback,
  deleteFeedback,
  getUserDetails,
  updateUserDetails,
  getSystemCredentials,
  getSystemStats,
  forceLogout,
  getActiveSessions
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(auth);
router.use(authorizeRole(['admin']));

// Dashboard data
router.get('/dashboard', getDashboardData);

// System statistics
router.get('/stats', getSystemStats);

// Login sessions
router.get('/logins', getAllLoginSessions);
router.get('/logins/:userId', getUserLoginHistory);

// Active sessions
router.get('/active-sessions', getActiveSessions);

// Force logout user
router.post('/logout/:userId', forceLogout);

// User management
router.get('/users/:userId', getUserDetails);
router.put('/users/:userId', updateUserDetails);

// Feedback management
router.put('/feedback/:feedbackId', updateFeedback);
router.delete('/feedback/:feedbackId', deleteFeedback);

// System credentials
router.get('/credentials', getSystemCredentials);

module.exports = router;
