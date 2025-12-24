const Credential = require('../models/Credential');
const bcrypt = require('bcryptjs');

// Get all credentials
const getAllCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find({}, { value: 0 }); // Don't return actual values
    res.json(credentials);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific credential by key
const getCredential = async (req, res) => {
  try {
    const { key } = req.params;
    const credential = await Credential.findOne({ key });
    
    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }
    
    res.json({
      key: credential.key,
      description: credential.description,
      isEncrypted: credential.isEncrypted,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create or update a credential
const setCredential = async (req, res) => {
  try {
    const { key, value, description, isEncrypted = false } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({ message: 'Key and value are required' });
    }
    
    let finalValue = value;
    
    // Encrypt the value if requested
    if (isEncrypted) {
      const salt = await bcrypt.genSalt(10);
      finalValue = await bcrypt.hash(value, salt);
    }
    
    // Use upsert to create or update
    const credential = await Credential.findOneAndUpdate(
      { key },
      { 
        value: finalValue, 
        description, 
        isEncrypted,
        updatedAt: Date.now()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );
    
    res.json({
      message: 'Credential saved successfully',
      key: credential.key,
      description: credential.description,
      isEncrypted: credential.isEncrypted
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add credential during runtime (no auth required for initial setup)
const addCredentialRuntime = async (req, res) => {
  try {
    const { key, value, description, isEncrypted = false } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({ message: 'Key and value are required' });
    }
    
    let finalValue = value;
    
    // Encrypt the value if requested
    if (isEncrypted) {
      const salt = await bcrypt.genSalt(10);
      finalValue = await bcrypt.hash(value, salt);
    }
    
    // Use upsert to create or update
    const credential = await Credential.findOneAndUpdate(
      { key },
      { 
        value: finalValue, 
        description, 
        isEncrypted,
        updatedAt: Date.now()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );
    
    res.json({
      message: 'Credential added successfully',
      key: credential.key,
      description: credential.description,
      isEncrypted: credential.isEncrypted
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a credential
const deleteCredential = async (req, res) => {
  try {
    const { key } = req.params;
    const credential = await Credential.findOneAndDelete({ key });
    
    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }
    
    res.json({ message: 'Credential deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get credential value (for internal use)
const getCredentialValue = async (key) => {
  try {
    const credential = await Credential.findOne({ key });
    return credential ? credential.value : null;
  } catch (error) {
    console.error('Error getting credential value:', error);
    return null;
  }
};

// Verify encrypted credential
const verifyCredential = async (key, plainValue) => {
  try {
    const credential = await Credential.findOne({ key });
    
    if (!credential || !credential.isEncrypted) {
      return false;
    }
    
    return await bcrypt.compare(plainValue, credential.value);
  } catch (error) {
    console.error('Error verifying credential:', error);
    return false;
  }
};

module.exports = {
  getAllCredentials,
  getCredential,
  setCredential,
  addCredentialRuntime,
  deleteCredential,
  getCredentialValue,
  verifyCredential
};
