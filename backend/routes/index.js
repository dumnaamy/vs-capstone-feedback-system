const express = require('express');
const authRoutes = require('./authRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const userRoutes = require('./userRoutes');
const credentialRoutes = require('./credentialRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// Use route modules
router.use('/auth', authRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/users', userRoutes);
router.use('/credentials', credentialRoutes);
router.use('/admin', adminRoutes);


module.exports = router;
