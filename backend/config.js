// Configuration - All sensitive data should be set via environment variables

const config = {
  port: process.env.PORT || 8000,
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  email: {
    smtpEmail: process.env.SMTP_EMAIL,
    smtpPassword: process.env.SMTP_PASSWORD
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY
  }
};

module.exports = { config };
