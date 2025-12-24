const User = require('../models/User');
const Feedback = require('../models/Feedback');
const UserLogin = require('../models/UserLogin');
const Credential = require('../models/Credential');

// Get comprehensive admin dashboard data
const getDashboardData = async (req, res) => {
  try {
    // Get all users with their login history
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    // Get recent login sessions
    const recentLogins = await UserLogin.find()
      .populate('userId', 'name email role')
      .sort({ loginTime: -1 })
      .limit(50);
    
    // Get feedback statistics
    const totalFeedback = await Feedback.countDocuments();
    const feedbackByCategory = await Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Get user statistics
    const userStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    // Get active sessions
    const activeSessions = await UserLogin.find({ isActive: true })
      .populate('userId', 'name email role')
      .sort({ loginTime: -1 });

    res.json({
      users,
      recentLogins,
      totalFeedback,
      feedbackByCategory,
      userStats,
      activeSessions
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user login history
const getUserLoginHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const logins = await UserLogin.find({ userId })
      .sort({ loginTime: -1 })
      .limit(100);
    
    res.json(logins);
  } catch (error) {
    console.error('Login history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all login sessions
const getAllLoginSessions = async (req, res) => {
  try {
    const { page = 1, limit = 50, role, active } = req.query;
    
    let query = {};
    if (role) query.userRole = role;
    if (active !== undefined) query.isActive = active === 'true';
    
    const logins = await UserLogin.find(query)
      .populate('userId', 'name email role')
      .sort({ loginTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await UserLogin.countDocuments(query);
    
    res.json({
      logins,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Login sessions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update feedback
const updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { rating, comments, category } = req.body;
    
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    if (rating !== undefined) feedback.rating = rating;
    if (comments !== undefined) feedback.comments = comments;
    if (category !== undefined) feedback.category = category;
    
    await feedback.save();
    
    res.json({ message: 'Feedback updated successfully', feedback });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    
    const feedback = await Feedback.findByIdAndDelete(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user with detailed information
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's login history
    const loginHistory = await UserLogin.find({ userId })
      .sort({ loginTime: -1 })
      .limit(20);
    
    // Get user's feedback
    const userFeedback = await Feedback.find({ userId: user.email })
      .sort({ createdAt: -1 });
    
    res.json({
      user,
      loginHistory,
      userFeedback
    });
  } catch (error) {
    console.error('User details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user details
const updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, username, role } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (username) user.username = username;
    if (role && ['student', 'staff', 'admin'].includes(role)) user.role = role;
    
    await user.save();
    
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get system credentials (admin only)
const getSystemCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find({}, { value: 0 }); // Don't return actual values
    res.json(credentials);
  } catch (error) {
    console.error('Get credentials error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get system statistics
const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    const totalLogins = await UserLogin.countDocuments();
    const activeSessions = await UserLogin.countDocuments({ isActive: true });
    
    // Get recent activity
    const recentActivity = await UserLogin.find()
      .populate('userId', 'name email role')
      .sort({ loginTime: -1 })
      .limit(10);
    
    // Get feedback by date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentFeedback = await Feedback.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    res.json({
      totalUsers,
      totalFeedback,
      totalLogins,
      activeSessions,
      recentFeedback,
      recentActivity
    });
  } catch (error) {
    console.error('System stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Force logout a user (admin only)
const forceLogout = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all active sessions for this user
    const activeSessions = await UserLogin.find({
      userId: userId,
      isActive: true
    });

    if (activeSessions.length === 0) {
      return res.status(400).json({ message: 'No active sessions found for this user' });
    }

    // Log out all active sessions
    const logoutTime = new Date();
    for (const session of activeSessions) {
      session.logoutTime = logoutTime;
      session.isActive = false;
      await session.save();
    }

    res.json({ 
      message: `Successfully logged out ${activeSessions.length} active session(s)`,
      sessionsLoggedOut: activeSessions.length
    });
  } catch (error) {
    console.error('Force logout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all active sessions (admin only)
const getActiveSessions = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const activeSessions = await UserLogin.find({ isActive: true })
      .populate('userId', 'name email role')
      .sort({ loginTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await UserLogin.countDocuments({ isActive: true });
    
    res.json({
      activeSessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get active sessions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};
