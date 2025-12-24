import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import "./AdminSignUp.css"; // We'll update this CSS to match the new theme
import { FaUserPlus, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import PasswordInput from "../components/PasswordInput";

const AdminSignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    admin_id: "",
    department: "",
    phone: ""
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.admin_id.trim()) newErrors.admin_id = "Admin ID is required.";
    if (!formData.department.trim()) newErrors.department = "Department is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    setSuccessMessage("");
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await api.post('/admin/register/', registrationData);
      setSuccessMessage(response.data.message);
      
      setTimeout(() => {
        navigate('/admin-login');
      }, 2000);
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed. Please try again.";
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-signup-container card-container">
      <div className="admin-signup-card card-panel">
        <div className="admin-signup-header">
          <FaUserPlus className="signup-icon" />
          <h1 className="admin-signup-title">Admin Registration</h1>
          <p className="admin-signup-subtitle">Create your admin account</p>
        </div>
        
        {successMessage && (
          <div className="alert-message alert-success">
            <FaCheckCircle />
            {successMessage}
          </div>
        )}
        
        {errors.general && (
          <div className="alert-message alert-danger">
            <FaExclamationCircle />
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="admin-signup-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="first_name"
                className={`form-input ${errors.first_name ? 'error' : ''}`}
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && <span className="error-text">{errors.first_name}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="last_name"
                className={`form-input ${errors.last_name ? 'error' : ''}`}
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && <span className="error-text">{errors.last_name}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input
              type="text"
              name="username"
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Admin ID *</label>
            <input
              type="text"
              name="admin_id"
              className={`form-input ${errors.admin_id ? 'error' : ''}`}
              placeholder="Enter your admin ID"
              value={formData.admin_id}
              onChange={handleChange}
              required
            />
            {errors.admin_id && <span className="error-text">{errors.admin_id}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Department *</label>
            <input
              type="text"
              name="department"
              className={`form-input ${errors.department ? 'error' : ''}`}
              placeholder="Enter your department"
              value={formData.department}
              onChange={handleChange}
              required
            />
            {errors.department && <span className="error-text">{errors.department}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Password *</label>
            <PasswordInput
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <PasswordInput
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          
          <button
            type="submit"
            className={`button-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="signup-footer text-center mt-4 pt-4 border-top">
          <p>Already have an account? <Link to="/admin-login" className="text-link">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUp;