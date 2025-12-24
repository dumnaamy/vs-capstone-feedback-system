const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { auth, authorizeRole } = require('../middleware/auth');
const User = require('../models/User'); // ✅ needed for fetching students

const router = express.Router();

// ------------------ User routes ------------------
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

// ------------------ Admin routes for user management ------------------
router.get('/all', auth, authorizeRole(['admin']), getAllUsers);
router.put('/role', auth, authorizeRole(['admin']), updateUserRole);
router.delete('/:userId', auth, authorizeRole(['admin']), deleteUser);

// ------------------ Student routes ------------------
// ✅ Fetch all students (staff or admin can use this)
router.get('/students', auth, authorizeRole(['admin', 'staff']), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email username course year regNo emailVerified createdAt'); // only required fields

    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
});

module.exports = router;
