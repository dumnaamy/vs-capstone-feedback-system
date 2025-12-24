const express = require('express');
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');
const { auth, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Feedback routes - allow student submissions without strict auth
router.post('/', submitFeedback); // Remove authenticateToken for now
router.get('/', auth, getFeedback); // Remove role restriction for now

module.exports = router;
// Search feedback by query
router.get("/search", async (req, res) => {
  const query = req.query.query; // e.g. /feedback/search?query=good
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const results = await Feedback.find({
      message: { $regex: query, $options: "i" }, // case-insensitive regex
    });

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
