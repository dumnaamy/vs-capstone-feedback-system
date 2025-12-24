// src/components/pages/LoginSelection.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';
import "./LoginSelection.css";

const LoginSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="login-selection-container card-container">
            <h1 className="login-title">Choose Your Login Type</h1>
            <div className="login-card-container">
                <div className="login-card" onClick={() => navigate("/staff-login")}>
                    <FaChalkboardTeacher className="login-icon" />
                    <h2>Staff Login</h2>
                    <p>Access staff feedback and reports</p>
                </div>

                <div className="login-card" onClick={() => navigate("/admin-login")}>
                    <FaUserShield className="login-icon" />
                    <h2>Admin Login</h2>
                    <p>Manage feedback and system settings</p>
                </div>
            </div>
        </div>
    );
};

export default LoginSelection;