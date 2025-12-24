const { getCredentialValue, verifyCredential } = require('../controllers/credentialController');

class CredentialService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get a credential value with caching
  async getCredential(key, useCache = true) {
    if (useCache && this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.value;
      }
      this.cache.delete(key);
    }

    const value = await getCredentialValue(key);
    
    if (value && useCache) {
      this.cache.set(key, {
        value,
        timestamp: Date.now()
      });
    }

    return value;
  }

  // Verify an encrypted credential
  async verifyCredential(key, plainValue) {
    return await verifyCredential(key, plainValue);
  }

  // Get MongoDB URI from database or fallback to env
  async getMongoDBUri() {
    try {
      const dbUri = await this.getCredential('MONGODB_URI');
      return dbUri || process.env.MONGODB_URI || 'mongodb+srv://guptayush689:sh81Ega1QUQ3Y52E@ayush.cddfsfv.mongodb.net/?retryWrites=true&w=majority&appName=Ayush';
    } catch (error) {
      // If database is not available, use environment variable or default
      console.log('Using fallback MongoDB URI');
      return process.env.MONGODB_URI || 'mongodb+srv://guptayush689:sh81Ega1QUQ3Y52E@ayush.cddfsfv.mongodb.net/?retryWrites=true&w=majority&appName=Ayush';
    }
  }

  // Get JWT Secret from database or fallback to env
  async getJWTSecret() {
    try {
      const jwtSecret = await this.getCredential('JWT_SECRET');
      return jwtSecret || process.env.JWT_SECRET || '767542f2102ea8624aed85dc3c9b97685d059982c09811dd8bb9467122f9d7427d47113420687885feff2abfbc848380701880907505c7664e94e07365d8ec02';
    } catch (error) {
      // If database is not available, use environment variable or default
      console.log('Using fallback JWT Secret');
      return process.env.JWT_SECRET || '767542f2102ea8624aed85dc3c9b97685d059982c09811dd8bb9467122f9d7427d47113420687885feff2abfbc848380701880907505c7664e94e07365d8ec02';
    }
  }

  // Get any other credential
  async getCustomCredential(key, defaultValue = null) {
    const value = await this.getCredential(key);
    return value || defaultValue;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Clear specific cache entry
  clearCacheEntry(key) {
    this.cache.delete(key);
  }
}

// Create singleton instance
const credentialService = new CredentialService();

module.exports = credentialService;
