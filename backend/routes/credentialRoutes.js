const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getAllCredentials,
  getCredential,
  setCredential,
  addCredentialRuntime,
  deleteCredential
} = require('../controllers/credentialController');

// Runtime credential addition (no auth required for initial setup)
router.post('/runtime', addCredentialRuntime);

// All other credential routes require authentication
router.use(auth);

// Get all credentials (admin only)
router.get('/', auth, getAllCredentials);

// Get a specific credential
router.get('/:key', auth, getCredential);

// Create or update a credential (admin only)
router.post('/', auth, setCredential);

// Update a specific credential (admin only)
router.put('/:key', auth, setCredential);

// Delete a credential (admin only)
router.delete('/:key', auth, deleteCredential);

module.exports = router;
