const Feedback = require('../models/Feedback');

// Submit feedback controller
const submitFeedback = async (req, res) => {
  const { userId, rating, comments, category } = req.body;

  try {
    // For student feedback, we'll store the registration number directly
    // since it's not linked to a User document
    const feedback = new Feedback({
      userId: userId || req.user?.userId || 'anonymous', // Use from body, token, or default
      rating: rating || 5,
      comments: comments || '',
      category: category || 'academic'
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get feedback controller with enhanced data
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    
    // Process feedback data for better display
    const processedFeedback = feedback.map(fb => {
      let parsedComments = fb.comments;
      let studentInfo = {};
      
      // Try to parse student information from comments
      try {
        if (fb.comments && fb.comments.includes('Student:')) {
          const lines = fb.comments.split('\n');
          lines.forEach(line => {
            if (line.startsWith('Student:')) {
              const match = line.match(/Student:\s*(.+?)\s*\((.+?)\)/);
              if (match) {
                studentInfo.name = match[1].trim();
                studentInfo.regNo = match[2].trim();
              }
            } else if (line.startsWith('Email:')) {
              studentInfo.email = line.replace('Email:', '').trim();
            } else if (line.startsWith('Course:')) {
              studentInfo.course = line.replace('Course:', '').trim();
            } else if (line.startsWith('Year:')) {
              studentInfo.year = line.replace('Year:', '').trim();
            }
          });
        }
      } catch (e) {
        console.log('Error parsing comments:', e);
      }

      return {
        id: fb._id,
        userId: fb.userId,
        rating: fb.rating,
        comments: fb.comments,
        category: fb.category,
        createdAt: fb.createdAt,
        studentInfo: studentInfo,
        // For backward compatibility
        studentName: studentInfo.name || 'Unknown Student',
        teacherName: 'N/A', // Will be extracted from subjects if available
        feedback: fb.comments,
        timestamp: fb.createdAt
      };
    });

    res.json(processedFeedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedback
};
