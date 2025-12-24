// src/components/pages/StudentLogin.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "../api";
import { FaUserGraduate, FaExclamationCircle, FaUser, FaLock, FaSpinner } from 'react-icons/fa';
import PasswordInput from "../components/PasswordInput";
import "./Student-Login.css";

const StudentLogin = () => {
    const [form, setForm] = useState({ reg_no: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if student is already authenticated on component mount
    useEffect(() => {
        const studentToken = localStorage.getItem('studentToken');
        const studentRegNo = localStorage.getItem('studentRegNo');
        if (studentToken && studentRegNo) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Use the standard auth endpoint with username (registration number)
            const response = await api.post("/api/auth/login", {
                identifier: form.reg_no,  // Use identifier field for username/email
                password: form.password
            });

            localStorage.setItem("studentToken", response.data.token);
            localStorage.setItem("studentRegNo", form.reg_no);

            // Navigate to the intended destination or feedback form
            const from = location.state?.from?.pathname || "/feedback";
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.error || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleLogout = () => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentRegNo");
        setIsAuthenticated(false);
    };

    if (isAuthenticated) {
        return (
            <div className="student-login-container card-container">
                <div className="student-login-card card-panel">
                    <div className="alert-message alert-success">
                        <FaExclamationCircle />
                        <p>You are already logged in as <b>{localStorage.getItem("studentRegNo")}</b>.</p>
                        <div className="d-flex justify-content-center gap-2 mt-3">
                            <button
                                className="button-primary btn-sm"
                                onClick={() => navigate("/feedback")}
                            >
                                Go to Feedback
                            </button>
                            <button
                                className="button-primary button-danger-style btn-sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="student-login-container card-container">
            <div className="student-login-card card-panel">
                <div className="text-center mb-4">
                    <FaUserGraduate className="login-icon" />
                    <h2 className="card-title">Student Feedback Portal</h2>
                    <p className="card-subtitle">Login with your Registration Number</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert-message alert-danger" role="alert">
                            <FaExclamationCircle /> {error}
                        </div>
                    )}
                    
                    {/* Username/RegNo input with icon */}
                    <div className="form-group input-with-icon ">
                        <FaUser className="input-icon mx-2" />
                        <input
                            type="text"
                            name="reg_no"
                            placeholder="Enter Registration Number"
                            value={form.reg_no}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    
                    {/* Password input with icon */}
                    <div className="form-group input-with-icon">
                        <FaLock className="input-icon mx-2" />
                        <PasswordInput
                            name="password"
                            placeholder="Enter Password"
                            value={form.password}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <button type="submit" className={`button-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                        {loading ? <FaSpinner className="spinner" /> : "Login"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="forgot">
                        Forgot Password? <Link to="/student-forgot-password" className="text-link">Reset here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;