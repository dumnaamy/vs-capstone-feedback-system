const mongoose = require('mongoose');
const Credential = require('../models/Credential');
const bcrypt = require('bcryptjs');
const { config } = require('../config');

// Initialize credentials in database
const initCredentials = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');

    // Initialize credentials from environment variables
    const credentials = [
      {
        key: 'MONGODB_URI',
        value: process.env.MONGODB_URI || config.mongodb.uri,
        description: 'MongoDB connection string',
        isEncrypted: false
      },
      {
        key: 'JWT_SECRET',
        value: process.env.JWT_SECRET || config.jwt.secret,
        description: 'JWT secret key for token signing',
        isEncrypted: false
      }
    ];

    // Add any additional credentials you want to store
    const additionalCredentials = [
      // Add your custom credentials here
      // Example:
      // {
      //   key: 'API_KEY',
      //   value: 'your-api-key-here',
      //   description: 'External API key',
      //   isEncrypted: true
      // }
    ];

    credentials.push(...additionalCredentials);

    // Save credentials to database
    for (const cred of credentials) {
      let finalValue = cred.value;
      
      // Encrypt if needed
      if (cred.isEncrypted) {
        const salt = await bcrypt.genSalt(10);
        finalValue = await bcrypt.hash(cred.value, salt);
      }

      await Credential.findOneAndUpdate(
        { key: cred.key },
        {
          value: finalValue,
          description: cred.description,
          isEncrypted: cred.isEncrypted,
          updatedAt: Date.now()
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log(`✓ Credential '${cred.key}' saved to database`);
    }

    console.log('\n✅ All credentials initialized successfully!');
    console.log('\nYou can now manage credentials through the API:');
    console.log('- GET /api/credentials - List all credentials');
    console.log('- POST /api/credentials - Add/update credential');
    console.log('- DELETE /api/credentials/:key - Delete credential');

  } catch (error) {
    console.error('Error initializing credentials:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the initialization
if (require.main === module) {
  initCredentials();
}

module.exports = initCredentials;
