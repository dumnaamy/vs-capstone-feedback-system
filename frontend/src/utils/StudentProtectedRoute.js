import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const StudentProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if student is authenticated
  const studentToken = localStorage.getItem('studentToken');
  const studentRegNo = localStorage.getItem('studentRegNo');
  
  if (!studentToken || !studentRegNo) {
    // Redirect to student login if not authenticated
    return <Navigate to="/Student-Login" state={{ from: location }} replace />;
  }

  return children;
};

export default StudentProtectedRoute;
