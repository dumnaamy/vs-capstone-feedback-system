import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import StudentProtectedRoute from "./utils/StudentProtectedRoute";

// Import your components/pages
import Home from "./pages/Home";
import FeedbackForm from "./pages/FeedbackForm";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/Notfound";
import ElegantNavbar from "./ElegantNavbar-fixed";
import StaffDashboard from "./pages/StaffDashboard";

// Login pages
import LoginSelection from "./pages/LoginSelection";
import StaffLogin from "./pages/StaffLogin";
import AdminLogin from "./pages/AdminLogin";
import StaffSignUp from "./pages/StaffSignUp";
import AdminSignUp from "./pages/AdminSignUp";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About-us";
import StudentLogin from "./pages/Student-Login";
import StudentForgotPassword from "./pages/StudentForgotPassword";

// Styles
import "./ElegantNavbar.css";
import "./styles/UnifiedTheme.css"
import "./ElegantNavbar.css";
import "./pages/Home.css";
import "./pages/FeedbackForm-3D.css";
import "./pages/AdminDashboard.css";
import "./pages/AdminLogin.css";
import "./pages/StaffLogin.css";
import "./pages/LoginSelection.css";
import "./pages/StaffDashboard.css";
import "./pages/StaffSignUp.css";
import "./pages/AdminSignUp.css";
import "./pages/ForgotPassword.css";
import "./pages/About-us.css"
import "./pages/Student-Login.css"
import "./pages/StudentForgotPassword.css"


function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <div className="app-container">
            <ElegantNavbar />
            <MainContent />
          </div>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

// Main Content Component
function MainContent() {
  const { isExpanded } = useSidebar();
  
  return (
    <main className={`main-content ${isExpanded ? 'sidebar-expanded' : ''}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/feedback" element={
          <StudentProtectedRoute>
            <FeedbackForm />
          </StudentProtectedRoute>
        } />

        {/* Login selection & individual logins */}
        <Route path="/Student-Login" element={<StudentLogin />} />
        <Route path="/Student-Forgot-Password" element={<StudentForgotPassword />} />


        <Route path="/login-selection" element={<LoginSelection />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/staff-signup" element={<StaffSignUp />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        
        {/* Admin login & signup */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignUp />} />
        
        {/* Forgot password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
