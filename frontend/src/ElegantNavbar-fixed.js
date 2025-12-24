import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useSidebar } from './contexts/SidebarContext';
import Logo from './assets/Shoolini-University_logo-750x750.png';
import { api } from './api';

// Import icons from a professional library
import { 
    FiHome, 
    FiMessageSquare, 
    FiUser, 
    FiLogOut, 
    FiInfo, 
    FiLogIn, 
    FiMenu, 
    FiSearch 
} from 'react-icons/fi';

import './ElegantNavbar.css';

function ElegantNavbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const { isExpanded, toggleSidebar, closeSidebar } = useSidebar();

    const studentToken = localStorage.getItem('studentToken');
    const studentRegNo = localStorage.getItem('studentRegNo');
    const isStudentAuthenticated = !!(studentToken && studentRegNo);

    // This search is now for universal, non-dashboard search.
    const handleUniversalSearch = async (e) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) {
            showToast("Search query cannot be empty.");
            return;
        }
        
        showToast(`Searching for "${trimmedQuery}"...`);
        
        try {
            // Making an API call to a hypothetical search endpoint
            const response = await api.get(`/search?query=${trimmedQuery}`);
            navigate(`/search-results?query=${trimmedQuery}`, { state: { searchResults: response.data } });
        } catch (error) {
            console.error("Search failed:", error);
            showToast("Search failed. Please try again later.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        closeSidebar();
        showToast('Logged out successfully');
    };

    const handleStudentLogout = () => {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentRegNo');
        navigate('/');
        closeSidebar();
        showToast('Student logged out successfully');
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(''), 3000);
    };

    const renderNavLink = (to, label, IconComponent) => (
        <Link
            to={to}
            title={label}
            className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}
            onClick={() => { closeSidebar(); showToast(`${label} page opened`); }}
        >
            <IconComponent className="sidebar-icon" />
            {isExpanded && <span className="sidebar-text">{label}</span>}
        </Link>
    );

    return (
        <>
            <header className="top-navbar">
                <div className="top-navbar-left">
                    <button
                        className="sidebar-toggle-btn"
                        onClick={toggleSidebar}
                        title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                        aria-label="Toggle sidebar"
                        aria-expanded={isExpanded}
                        aria-controls="sidebar"
                    >
                        <FiMenu className="toggle-icon" />
                    </button>
                    <Link className="top-navbar-logo" to="/" title="Student Feedback Home">
                        <img src={Logo} alt="Shoolini University Logo" className="logo-image" />
                        <span className="logo-text">STUDENT<span className="logo-accent">FEEDBACK</span></span>
                    </Link>
                </div>
                
                <div className="top-navbar-right">
                    {/* New: Search bar is now a permanent part of the top nav */}
                    <div className="top-navbar-search-bar">
                        <form onSubmit={handleUniversalSearch}>
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="search-submit-btn" aria-label="Run search">
                                <FiSearch />
                            </button>
                        </form>
                    </div>

                    {isAuthenticated ? (
                        <button 
                            className="top-navbar-logout"
                            onClick={handleLogout}
                            title="Logout"
                            aria-label="Logout"
                        >
                            <FiLogOut />
                        </button>
                    ) : isStudentAuthenticated ? (
                        <button 
                            className="top-navbar-logout"
                            onClick={handleStudentLogout}
                            title="Student Logout"
                            aria-label="Student Logout"
                        >
                            <FiLogOut />
                        </button>
                    ) : (
                        <Link to="/login-selection" className="top-navbar-login" title="Login" onClick={() => showToast('Login page opened')}>
                            <FiLogIn />
                        </Link>
                    )}
                </div>
            </header>

            <nav id="sidebar" className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
                <div className="sidebar-content">
                    {renderNavLink('/', 'Home', FiHome)}
                    {isStudentAuthenticated ? (
                        renderNavLink('/feedback', 'Feedback', FiMessageSquare)
                    ) : (
                        renderNavLink('/student-login', 'Student Login', FiMessageSquare)
                    )}
                    {isAuthenticated ? (
                        <>
                            {renderNavLink('/admin', 'Admin Dashboard', FiUser)}
                        </>
                    ) : (
                        <>
                            {renderNavLink('/about', 'About Us', FiInfo)}
                        </>
                    )}
                </div>
            </nav>

            {isExpanded && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
            
            {toast && (
                <div className="simple-toast" role="status" aria-live="polite">{toast}</div>
            )}
        </>
    );
}

export default ElegantNavbar;