const mongoose = require('mongoose');
const User = require('../models/User');
const { config } = require('../config');

async function listUsers() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name email username role regNo');
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- Name: ${user.name}, Email: ${user.email}, Username: ${user.username}, Role: ${user.role}, RegNo: ${user.regNo || 'N/A'}`);
    });

    if (users.length === 0) {
      console.log('No users found in the database.');
    }

  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

listUsers();
