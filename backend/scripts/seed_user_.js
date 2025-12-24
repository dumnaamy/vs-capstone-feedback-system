/* eslint-disable no-console */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const config = require('../config');
const User = require('../models/User');

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI || config.mongodb.uri;
  await mongoose.connect(mongoUri);
}

async function upsertUser({ name, email, username, password, role, regNo }) {
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (existing) {
    existing.name = name || existing.name;
    existing.username = username || existing.username;
    existing.role = role || existing.role;
    existing.password = hashedPassword;
    if (role === 'student' && regNo) {
      existing.regNo = regNo;
    }
    await existing.save();
    console.log(`Updated existing ${role} user: ${email}`);
    return existing;
  }

  const userData = { name, email, username, password: hashedPassword, role };
  if (role === 'student' && regNo) {
    userData.regNo = regNo;
  }
  const user = new User(userData);
  await user.save();
  console.log(`Created ${role} user: ${email}`);
  return user;
}

async function run() {
  try {
    await connectToDatabase();

    const usersToSeed = [
      {
        role: 'superuser',
        name: process.env.SUPERUSER_NAME || 'Super User',
        email: process.env.SUPERUSER_EMAIL || 'superuser@example.com',
        username: process.env.SUPERUSER_USERNAME || 'superuser',
        password: process.env.SUPERUSER_PASSWORD || 'ChangeMe!123'
      },
      {
        role: 'admin',
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        username: process.env.ADMIN_USERNAME || 'AD202222',
        password: process.env.ADMIN_PASSWORD || 'admin12344'
      },
      {
        role: 'staff',
        name: process.env.STAFF_NAME || 'Staff Member',
        email: process.env.STAFF_EMAIL || 'staff@example.com',
        username: process.env.STAFF_USERNAME || 'staff',
        password: process.env.STAFF_PASSWORD || 'ChangeMe!123'
      },
      {
        role: 'student',
        name: process.env.STUDENT_NAME || 'Ayush',
        email: process.env.STUDENT_EMAIL || 'guptayush689@gmail.com',
        username: process.env.STUDENT_USERNAME || 'GF202215719',
        password: process.env.STUDENT_PASSWORD || 'ayush12344',
        regNo: process.env.STUDENT_USERNAME || 'GF202215719'
      },
      // Student 2
      {
        role: 'student',
        name: 'Rahul Sharma',
        email: 'rahul8@shooliniuniversity.com',
        username: 'GF202215720',
        password: 'rahul12344',
        regNo: 'GF202215720'
  },
  // Student 3
  {
    role: 'student',
    name: 'Priya Singh',
    email: 'priya9@shooliniuniversity.com',
    username: 'GF202215721',
    password: 'priya12344',
    regNo: 'GF202215721'
  },
  // Student 4
  {
    role: 'student',
    name: 'Anish',
    email: 'anish10@shooliniuniversity.com',
    username: 'GF202215722',
    password: 'anish12344',
    regNo: 'GF202215722'
  },
  // Student 5
  {
    role: 'student',
    name: 'Simran Kaur',
    email: 'simran11@shooliniuniversity.com',
    username: 'GF202215723',
    password: 'simran12344',
    regNo: 'GF202215723'
  },
  // Student 6
  {
    role: 'student',
    name: 'Rohit Mehta',
    email: 'rohit12@shooliniuniversity.com',
    username: 'GF202215724',
    password: 'rohit12344',
    regNo: 'GF202215724'
  },
  // Student 7
  {
    role: 'student',
    name: 'Neha Gupta',
    email: 'neha13@shooliniuniversity.com',
    username: 'GF202215725',
    password: 'neha12344',
    regNo: 'GF202215725'
  },
  // Student 8
  {
    role: 'student',
    name: 'Vikram Thakur',
    email: 'vikram14@shooliniuniversity.com',
    username: 'GF202215726',
    password: 'vikram12344',
    regNo: 'GF202215726'
  },
  // Student 9
  {
    role: 'student',
    name: 'Kritika Sharma',
    email: 'kritika15@shooliniuniversity.com',
    username: 'GF202215727',
    password: 'kritika12344',
    regNo: 'GF202215727'
  },
  // Student 10
  {
    role: 'student',
    name: 'Arjun Kapoor',
    email: 'arjun16@shooliniuniversity.com',
    username: 'GF202215728',
    password: 'arjun12344',
    regNo: 'GF202215728'
  }

    ];

    for (const userData of usersToSeed) {
      if (!userData.password || userData.password.length < 6) {
        throw new Error(`${userData.role} password must be at least 6 characters`);
      }
      await upsertUser(userData);
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
