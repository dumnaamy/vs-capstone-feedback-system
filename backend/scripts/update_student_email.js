const mongoose = require('mongoose');
const User = require('../models/User');
const { config } = require('../config');

async function updateStudentEmail() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');

    // Find the student by username
    const student = await User.findOne({ username: 'GF202215719' });
    if (!student) {
      console.log('Student not found with username: GF202215719');
      return;
    }

    // Update the email
    student.email = 'guptayush689@gmail.com';
    await student.save();
    console.log('Student email updated successfully:', student.email);

  } catch (error) {
    console.error('Error updating student email:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

updateStudentEmail();
