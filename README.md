# VS Capstone - Feedback System

A comprehensive feedback management system for Shoolini University built with modern web technologies. This capstone project features role-based authentication, interactive feedback forms, AI-powered chatbot, and comprehensive dashboards for students, staff, and administrators.

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication**: Separate login systems for Students, Staff, and Administrators
- **Interactive Feedback Forms**: Dynamic 3D-styled feedback collection with subject-wise ratings
- **AI-Powered Chatbot**: OpenAI-integrated chatbot with sentiment analysis for student queries
- **Comprehensive Dashboards**: Role-specific dashboards with analytics and management tools
- **Email Notifications**: Automated email service for password resets and notifications

### Technical Features
- **JWT Authentication**: Secure token-based authentication system
- **Responsive Design**: Bootstrap-powered responsive UI with custom CSS
- **Real-time Data**: MongoDB integration for efficient data management
- **RESTful API**: Well-structured Express.js API with proper error handling

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern React with hooks and functional components
- **React Router**: Client-side routing for single-page application
- **Axios**: HTTP client for API communication
- **Bootstrap 5**: Responsive CSS framework
- **React Icons**: Icon library for enhanced UI
- **React Spring**: Animation library for smooth transitions

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing for security
- **Nodemailer**: Email service integration
- **OpenAI API**: AI-powered chatbot functionality
- **Sentiment Analysis**: Natural language processing for feedback analysis

### Development Tools
- **VS Code**: Primary IDE for development
- **Git**: Version control system
- **Nodemon**: Development server with auto-restart
- **Postman**: API testing and documentation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key
- Email account for notifications (Gmail recommended)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vs-capstone
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Environment Variables**
   Create a `.env` file in the backend directory with:
   ```
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   OPENAI_API_KEY=your_openai_api_key
   ```

## 🎯 Usage

1. **Student Access**: Login as student to submit feedback and interact with chatbot
2. **Staff Access**: Login as staff to view assigned feedback and manage responses
3. **Admin Access**: Login as admin to manage users, view analytics, and system administration

## 📁 Project Structure

```
vs-capstone/
├── backend/                 # Express.js server
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   ├── middleware/         # Custom middleware
│   └── scripts/            # Utility scripts
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── styles/         # Global styles
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
└── scripts/                # Setup scripts
```

## 🤝 Contributing

This is a capstone project showcasing full-stack development skills with modern technologies.

## 📄 License

MIT License - feel free to use this project for learning and reference.

## 👨‍💻 Author

Ayush Gupta - Capstone Project for VS Code Integrated Development
