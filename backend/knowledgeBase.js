// Comprehensive Knowledge Base for Shoolini University Student Feedback System Chatbot
// Covers basic, medium, and advanced questions with warm, proper replies

const knowledgeBase = {
  // Greetings (already handled separately, but included for completeness)
  'hi': "Hi! Welcome to Shoolini University's Feedback Assistant. I'm here to help you with the feedback form. What can I assist you with today?",
  'hello': "Hello! Great to see you. As Shoolini Assistant, I can guide you through the feedback process. How may I help?",
  'hey': "Hey there! Ready to tackle the feedback form? Ask me about courses, ratings, or anything academic!",
  'good morning': "Good morning! Hope you're having a great day at Shoolini. How can I help with your feedback?",
  'good afternoon': "Good afternoon! I'm here to assist with any questions about the feedback system.",
  'good evening': "Good evening! Evenings are perfect for reflecting on your studies. Need help with feedback?",

  // Login/Signup - Basic
  'how to login': "To log in, go to the login page, select your role (Student, Staff, or Admin), enter your email and password, then click 'Login'. If you forgot your password, use the 'Forgot Password' link.",
  'login not working': "If login isn't working, check your email and password. Ensure you're selecting the correct role. If issues persist, try resetting your password or contact support.",
  'signup': "For signup, choose your role, fill in your details (name, email, password), and submit. Students may need approval from admin.",
  'create account': "To create an account, go to the signup page for your role (Student, Staff, Admin), provide required info, and register. Check your email for verification if needed.",
  'forgot password': "Click 'Forgot Password' on the login page, enter your email, and follow the reset instructions sent to your email.",

  // Login/Signup - Medium
  'student login': "Students log in at /Student-Login with their registered email and password. If new, sign up first.",
  'staff login': "Staff use /Staff-Login. Enter email and password. Contact admin if access issues.",
  'admin login': "Admins log in at /Admin-Login. Use superuser credentials or assigned login.",
  'verification email': "After signup, check your email for a verification link. Click it to activate your account.",
  'account approval': "New student accounts may require admin approval. You'll be notified via email once approved.",

  // Login/Signup - Advanced
  'two factor auth': "The system supports TOTP for added security. Set it up in your profile after login.",
  'session timeout': "Sessions expire after inactivity. Log in again if timed out.",
  'multiple devices': "You can log in from multiple devices, but simultaneous use may cause issues.",
  'security tips': "Use strong passwords, don't share credentials, and log out after use for security.",

  // Feedback Form - Basic
  'how to fill feedback': "Start with your registration number (auto-filled), enter email and name, select course and year, then rate each subject's concept clarity with stars (1-5) and add suggestions.",
  'what is feedback form': "The feedback form lets you rate your subjects and provide suggestions to improve teaching and learning at Shoolini.",
  'feedback fields': "Fields include: registration number, email, name, course, year, subject ratings, and suggestions.",
  'submit feedback': "Fill all required fields, then click 'Submit Feedback'. You'll see a success message.",

  // Feedback Form - Medium
  'registration number': "Your registration number is pre-filled and read-only. It's your unique student ID.",
  'email and name': "Enter your current email and full name as per records.",
  'course selection': "Choose from B.Tech CSE AI, BBA, MBA, or BCA based on your program.",
  'year selection': "Select your current academic year (1-4 for B.Tech, 1-3 for BBA/BCA, 1-2 for MBA).",
  'subject ratings': "For each subject, rate concept clarity with 1-5 stars: 5 = excellent, 1 = needs improvement.",
  'suggestions': "Provide constructive ideas to improve the subject, like more examples or practical sessions.",

  // Feedback Form - Advanced
  'multiple subjects': "Rate all subjects listed for your course and year. Each has its own rating and suggestion field.",
  'feedback deadline': "Submit feedback within the given timeframe. Check announcements for deadlines.",
  'edit feedback': "Once submitted, feedback cannot be edited. Review carefully before submitting.",
  'anonymous feedback': "Feedback is not anonymous; it's linked to your account for authenticity.",
  'feedback impact': "Your feedback helps improve curriculum and teaching quality at Shoolini.",

  // Courses and Years - Basic
  'courses available': "Available courses: B.Tech CSE AI (4 years, tech-focused), BBA (3 years, business), MBA (2 years, management), BCA (3 years, computer applications).",
  'what is btech cse ai': "B.Tech CSE AI is a 4-year engineering program focusing on computer science with artificial intelligence specialization.",
  'what is bba': "BBA is a 3-year bachelor's in business administration, covering management and commerce.",
  'what is mba': "MBA is a 2-year master's in business administration for advanced management skills.",
  'what is bca': "BCA is a 3-year bachelor's in computer applications, focusing on software and computing.",

  // Courses and Years - Medium
  'course duration': "B.Tech: 4 years, BBA: 3 years, MBA: 2 years, BCA: 3 years.",
  'year meaning': "Year indicates your current semester group (e.g., Year 1 = first-year students).",
  'change course': "Course selection is based on your admission. Contact admin for changes.",
  'subjects per year': "Subjects vary by course and year. The form lists relevant ones for your selection.",

  // Courses and Years - Advanced
  'course curriculum': "Each course has a structured curriculum. Check university website or department for details.",
  'electives': "Some courses offer electives. Feedback helps in choosing future electives.",
  'internships': "Courses include practical training. Rate how well they prepare you.",
  'career prospects': "All courses lead to good careers. B.Tech in tech fields, BBA/MBA in business, BCA in IT.",

  // Ratings and Suggestions - Basic
  'how to rate': "Click stars (1-5) for concept clarity. Hover for descriptions.",
  'what to suggest': "Suggest improvements like more labs, better materials, or teaching methods.",
  'rating scale': "1 = Poor, 2 = Below Average, 3 = Average, 4 = Good, 5 = Excellent.",

  // Ratings and Suggestions - Medium
  'rating tips': "Be honest and constructive. Focus on learning experience.",
  'suggestion examples': "Examples: 'More group projects' or 'Clearer explanations of topics'.",
  'multiple ratings': "Rate each subject separately based on that teacher's performance.",

  // Ratings and Suggestions - Advanced
  'rating impact': "Ratings help identify strong/weak areas for faculty development.",
  'confidentiality': "Suggestions are reviewed by faculty anonymously.",
  'follow up': "High ratings get recognition; low ones prompt improvements.",

  // Submission - Basic
  'submit button': "Click 'Submit Feedback' after filling all fields.",
  'success message': "After submission, you'll see 'Feedback submitted successfully!'.",
  'confirmation': "No email confirmation yet, but check your dashboard.",

  // Submission - Medium
  'save draft': "Currently, no draft save. Fill and submit in one go.",
  'validation errors': "If errors, fix them (e.g., select course/year).",
  'resubmit': "Cannot resubmit. Ensure accuracy first time.",

  // Submission - Advanced
  'data storage': "Feedback is stored securely in the database for analysis.",
  'analytics': "Admins use aggregated data for improvements.",
  'privacy': "Data is protected per university policies.",

  // Dashboards - Basic
  'student dashboard': "Students see feedback form, submitted feedback, and profile.",
  'staff dashboard': "Staff view assigned subjects, student feedback, and reports.",
  'admin dashboard': "Admins manage users, view all feedback, generate reports.",

  // Dashboards - Medium
  'view feedback': "In dashboard, see your submitted feedback history.",
  'edit profile': "Update email, name, or password in profile section.",
  'notifications': "Check dashboard for announcements or updates.",

  // Dashboards - Advanced
  'reports': "Admins generate PDF/Excel reports on feedback trends.",
  'user management': "Admins add/edit/delete users, approve signups.",
  'analytics dashboard': "View charts on ratings, suggestions, course performance.",

  // Password Reset - Basic
  'reset password': "Go to Forgot Password, enter email, receive reset link.",
  'change password': "In profile, enter old and new password.",

  // Password Reset - Medium
  'reset link': "Click link in email, set new password.",
  'password requirements': "At least 8 characters, mix of letters/numbers.",

  // Password Reset - Advanced
  'security': "Passwords are hashed. Reset links expire in 1 hour.",
  'multiple resets': "Can request multiple times, but use latest link.",

  // General Help - Basic
  'help': "I'm here to help! Ask about login, feedback, courses, or anything.",
  'contact support': "For issues, email support@shoolini.edu or contact admin.",
  'about system': "This is Shoolini's Student Feedback System for continuous improvement.",

  // General Help - Medium
  'tutorials': "Check university portal for video tutorials on using the system.",
  'faq': "Common questions: login issues, form filling, submission.",
  'updates': "System updates announced via email or dashboard.",

  // General Help - Advanced
  'technical issues': "For bugs, clear cache, try different browser, or report to IT.",
  'accessibility': "System is mobile-friendly. Contact for accessibility needs.",
  'future features': "Planned: mobile app, advanced analytics, real-time chat.",
  'system architecture': "Built with React frontend, Node.js backend, MongoDB database.",

  // Sentiment-based responses (added for smarter replies)
  'frustrated': "I'm sorry you're feeling frustrated. Let me help resolve this. What's the issue?",
  'angry': "I understand you're upset. Please tell me what's wrong so I can assist.",
  'not working': "Sorry it's not working. Can you describe the problem in detail?",
  'bad experience': "I'm sorry for the bad experience. How can I make it better?",
  'great': "Glad to hear it's great! Is there anything else I can help with?",
  'excellent': "Excellent! Thank you for the positive feedback.",
  'love it': "I'm happy you love it! Let me know if you need more help.",

  // More variations and queries
  'i need help': "Of course! What do you need help with?",
  'confused': "No worries, I'm here to clarify. What's confusing you?",
  'stuck': "Let's get you unstuck. What step are you on?",
  'error': "An error? Please describe it so I can guide you.",
  'bug': "Reporting a bug? Note the steps and contact support.",
  'slow': "If it's slow, try refreshing or using a different device.",
  'thank you': "You're welcome! Happy to help.",
  'thanks': "No problem! Anything else?",
  'bye': "Goodbye! Have a great day at Shoolini.",
  'goodbye': "See you later! Keep up the good work.",
  'who are you': "I'm Shoolini Assistant, your AI helper for the feedback system.",
  'what can you do': "I can answer questions about login, feedback form, courses, ratings, dashboards, and more.",
  'how does it work': "The system collects student feedback to improve teaching and curriculum.",
  'is it secure': "Yes, all data is encrypted and stored securely.",
  'mobile app': "Mobile app is in development. For now, use the web version.",
  'export feedback': "Admins can export feedback data for analysis.",
  'feedback analysis': "Feedback is analyzed for trends and improvements.",
  'course change': "Contact admin for course change requests.",
  'year change': "Year is based on your enrollment. Contact admin if incorrect.",
  'subject list': "Subjects are listed based on your course and year selection.",
  'rating average': "Ratings are averaged for each subject and teacher.",
  'suggestion review': "Suggestions are reviewed by faculty for implementation.",
  'deadline extension': "Deadlines are set by admin. Contact for extensions if needed.",
  'feedback reminder': "Check dashboard for feedback submission reminders.",
  'profile update': "Update your profile in the dashboard settings.",
  'password strength': "Use strong passwords with uppercase, lowercase, numbers, and symbols.",
  'login attempts': "After 5 failed attempts, account may be locked temporarily.",
  'session expired': "Log in again if your session expired.",
  'browser compatibility': "Works best on Chrome, Firefox, Safari, Edge.",
  'internet connection': "Ensure stable internet for smooth operation.",
  'data backup': "All data is backed up regularly for safety.",
  'user roles': "Roles: Student (submit feedback), Staff (view feedback), Admin (manage system).",
  'permissions': "Permissions vary by role for security.",
  'notifications': "Receive emails for important updates.",
  'announcements': "Check dashboard for university announcements.",
  'events': "Upcoming events posted on the university website.",
  'library access': "Access library resources via university portal.",
  'exam schedule': "Check university website for exam schedules.",
  'results': "Results available on the student portal.",
  'grades': "Grades are posted after evaluation.",
  'certificates': "Download certificates from the student dashboard.",
  'transcripts': "Request transcripts from the admin office.",
  'fees payment': "Pay fees online via the university portal.",
  'scholarships': "Apply for scholarships through the admin.",
  'hostel': "Hostel facilities available. Contact admin for details.",
  'transport': "Transport services for commuting students.",
  'canteen': "Canteen open during university hours.",
  'sports': "Sports facilities for recreation.",
  'clubs': "Join student clubs for extracurricular activities.",
  'placements': "Placement cell assists with job opportunities.",
  'internships': "Internship opportunities through the university.",
  'research': "Research projects available for interested students.",
  'projects': "Final year projects supervised by faculty.",
  'thesis': "Thesis submission guidelines on the portal.",
  'alumni': "Connect with alumni for networking.",
  'mentorship': "Mentorship programs for guidance.",
  'counseling': "Counseling services for personal support.",
  'health': "Health center for medical assistance.",
  'emergency': "Emergency contacts: Security 123, Ambulance 456.",
  'rules': "Follow university rules and regulations.",
  'discipline': "Disciplinary actions for violations.",
  'complaints': "File complaints through the admin.",
  'suggestions system': "Use feedback form for system suggestions.",
  'improvements': "Continuous improvements based on feedback.",
  'updates': "System updates announced regularly.",
  'training': "Training sessions for new features.",
  'support team': "Support team available for assistance.",
  'contact info': "Email: support@shoolini.edu, Phone: 1800-123-456.",
  'office hours': "Support hours: 9 AM to 5 PM, Monday to Friday.",
  'response time': "Queries responded within 24 hours.",
  'escalation': "Escalate issues to higher management if needed.",
  'feedback on system': "Provide feedback on the system itself via the form.",

  // Default
  'default': "Hi! I'm Shoolini Assistant. I can help with login, feedback form, courses, ratings, dashboards, and more. What do you need?"
};

module.exports = { knowledgeBase };
