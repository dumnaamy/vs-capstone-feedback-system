import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Notfound.css'; // Import your CSS file

export default function NotFound() {
  return (
    <div className="notfound-container">
      <h3 className="notfound-title">404 - Page Not Found</h3>
      <p className="notfound-text">Oops! The page you're looking for doesn't exist.</p>
    </div>
  );
}
