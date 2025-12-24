import React, { useEffect, useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, 
  FaSpinner, 
  FaUsers, 
  FaComments, 
  FaUserShield,
  FaUserGraduate,
  FaUserTie,
  FaStar,
  FaEye,
  FaEdit,
  FaTrash,
  FaKey,
  FaChartBar,
  FaClock,
  FaDesktop,
  FaMobile,
  FaGlobe,
  FaSearch,
  FaFilter,
  FaDownload
} from 'react-icons/fa';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/admin-login');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching dashboard data...');
      const response = await api.get('/api/admin/dashboard');
      console.log('Dashboard response:', response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(`Failed to fetch dashboard data: ${error.message}`);
      if (error.response?.status === 401) {
        logout();
        navigate('/admin-login');
      }
    } finally {
      setLoading(false);
    }
  }, [logout, navigate, isAuthenticated]);

  useEffect(() => {
    console.log('AdminDashboard mounted, isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [fetchDashboardData, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const handleUpdateFeedback = async (feedbackId, updates) => {
    try {
      await api.put(`/api/admin/feedback/${feedbackId}`, updates);
      fetchDashboardData();
      setShowFeedbackModal(false);
      setEditingFeedback(null);
    } catch (error) {
      console.error("Error updating feedback:", error);
      alert('Failed to update feedback');
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await api.delete(`/api/admin/feedback/${feedbackId}`);
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert('Failed to delete feedback');
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await api.put(`/api/admin/users/${userId}`, updates);
      fetchDashboardData();
      setShowUserModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert('Failed to update user');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserShield className="text-danger" />;
      case 'staff':
        return <FaUserTie className="text-primary" />;
      case 'student':
        return <FaUserGraduate className="text-success" />;
      default:
        return <FaUserGraduate className="text-muted" />;
    }
  };

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return <FaGlobe />;
    if (userAgent.includes('Mobile')) return <FaMobile />;
    if (userAgent.includes('Desktop')) return <FaDesktop />;
    return <FaGlobe />;
  };

  const viewFeedbackDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowFeedbackModal(true);
  };

  const viewUserDetails = async (user) => {
    try {
      const response = await api.get(`/api/admin/users/${user._id}`);
      setSelectedUser(response.data);
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert('Failed to fetch user details');
    }
  };

  const filteredUsers = dashboardData?.users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  }) || [];

  const filteredFeedback = dashboardData?.recentLogins?.filter(feedback => {
    return feedback.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           feedback.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const renderOverviewTab = () => (
    <div className="row">
      {/* Statistics Cards */}
      <div className="col-md-3 mb-4">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{dashboardData?.users?.length || 0}</h4>
                <p className="mb-0">Total Users</p>
              </div>
              <FaUsers size={40} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-3 mb-4">
        <div className="card bg-success text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{dashboardData?.totalFeedback || 0}</h4>
                <p className="mb-0">Total Feedback</p>
              </div>
              <FaComments size={40} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-3 mb-4">
        <div className="card bg-warning text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{dashboardData?.activeSessions?.length || 0}</h4>
                <p className="mb-0">Active Sessions</p>
              </div>
              <FaClock size={40} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-3 mb-4">
        <div className="card bg-info text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{dashboardData?.recentLogins?.length || 0}</h4>
                <p className="mb-0">Recent Logins</p>
              </div>
              <FaKey size={40} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5><FaClock className="me-2" />Recent Login Activity</h5>
          </div>
          <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {dashboardData?.recentLogins?.slice(0, 10).map((login, index) => (
              <div key={login._id || index} className="d-flex align-items-center mb-3 p-2 border-bottom">
                <div className="me-3">
                  {getRoleIcon(login.userRole)}
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold">{login.userName}</div>
                  <small className="text-muted">
                    {login.userEmail} • {new Date(login.loginTime).toLocaleString()}
                  </small>
                </div>
                <div className="text-end">
                  <small className="text-muted">
                    {getDeviceIcon(login.userAgent)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5><FaChartBar className="me-2" />User Statistics</h5>
          </div>
          <div className="card-body">
            {dashboardData?.userStats?.map((stat, index) => (
              <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-secondary">{stat._id}</span>
                <span className="fw-bold">{stat.count} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div>
      {/* Search and Filter */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text"><FaSearch /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-outline-primary" onClick={fetchDashboardData}>
            <FaDownload className="me-2" />Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-responsive shadow rounded-3">
        <table className="table table-hover table-striped">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>
                  <div className="d-flex align-items-center">
                    {getRoleIcon(user.role)}
                    <div className="ms-2">
                      <strong>{user.name}</strong>
                      {user.username && (
                        <>
                          <br />
                          <small className="text-muted">@{user.username}</small>
                        </>
                      )}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge bg-${user.role === 'admin' ? 'danger' : user.role === 'staff' ? 'primary' : 'success'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {new Date(user.createdAt).toLocaleDateString()}
                  <br />
                  <small className="text-muted">
                    {new Date(user.createdAt).toLocaleTimeString()}
                  </small>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => viewUserDetails(user)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-warning me-1"
                    onClick={() => {
                      setEditingUser(user);
                      setShowUserModal(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFeedbackTab = () => (
    <div>
      {/* Search */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text"><FaSearch /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <button className="btn btn-outline-primary" onClick={fetchDashboardData}>
            <FaDownload className="me-2" />Refresh
          </button>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="table-responsive shadow rounded-3">
        <table className="table table-hover table-striped">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Rating</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData?.recentLogins?.map((feedback, index) => (
              <tr key={feedback._id || index}>
                <td>{index + 1}</td>
                <td>
                  <div>
                    <strong>{feedback.userName || 'Unknown User'}</strong>
                    <br />
                    <small className="text-muted">
                      {feedback.userEmail}
                    </small>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < (feedback.rating || 0) ? 'text-warning' : 'text-muted'}
                        size={14}
                      />
                    ))}
                    <span className="ms-2 small">({feedback.rating || 0}/5)</span>
                  </div>
                </td>
                <td>
                  <span className={`badge bg-${(feedback.category || 'academic') === 'academic' ? 'primary' : 'secondary'}`}>
                    {feedback.category || 'academic'}
                  </span>
                </td>
                <td>
                  {new Date(feedback.loginTime).toLocaleDateString()}
                  <br />
                  <small className="text-muted">
                    {new Date(feedback.loginTime).toLocaleTimeString()}
                  </small>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => viewFeedbackDetails(feedback)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-warning me-1"
                    onClick={() => {
                      setEditingFeedback(feedback);
                      setShowFeedbackModal(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteFeedback(feedback._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFeedbackModal = () => {
    if (!showFeedbackModal || !selectedFeedback) {
      return null;
    }

    const feedback = editingFeedback || selectedFeedback;

    return (
      <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editingFeedback ? 'Edit Feedback' : 'Feedback Details'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setEditingFeedback(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              {editingFeedback ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleUpdateFeedback(feedback._id, {
                    rating: parseInt(formData.get('rating')),
                    category: formData.get('category'),
                    comments: formData.get('comments')
                  });
                }}>
                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <select name="rating" className="form-select" defaultValue={feedback.rating || 5}>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select name="category" className="form-select" defaultValue={feedback.category || 'academic'}>
                      <option value="academic">Academic</option>
                      <option value="facility">Facility</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comments</label>
                    <textarea
                      name="comments"
                      className="form-control"
                      rows="4"
                      defaultValue={feedback.comments || ''}
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      setShowFeedbackModal(false);
                      setEditingFeedback(null);
                    }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-6">
                      <h6>User Information</h6>
                      <p><strong>Name:</strong> {feedback.userName || 'Unknown'}</p>
                      <p><strong>Email:</strong> {feedback.userEmail || 'N/A'}</p>
                      <p><strong>Role:</strong> {feedback.userRole || 'N/A'}</p>
                      <p><strong>IP Address:</strong> {feedback.ipAddress || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Session Information</h6>
                      <p><strong>Login Time:</strong> {new Date(feedback.loginTime).toLocaleString()}</p>
                      <p><strong>Device:</strong> {getDeviceIcon(feedback.userAgent)} {feedback.userAgent?.substring(0, 50)}...</p>
                      <p><strong>Active:</strong> {feedback.isActive ? 'Yes' : 'No'}</p>
                      {feedback.sessionDuration && (
                        <p><strong>Duration:</strong> {feedback.sessionDuration} minutes</p>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowFeedbackModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => setEditingFeedback(feedback)}
                    >
                      <FaEdit className="me-2" />Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUserModal = () => {
    if (!showUserModal || !selectedUser) {
      return null;
    }

    const user = editingUser || selectedUser;

    return (
      <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editingUser ? 'Edit User' : 'User Details'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              {editingUser ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleUpdateUser(user.user._id, {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    username: formData.get('username'),
                    role: formData.get('role')
                  });
                }}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      name="name"
                      type="text"
                      className="form-control"
                      defaultValue={user.user.name}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      defaultValue={user.user.email}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      name="username"
                      type="text"
                      className="form-control"
                      defaultValue={user.user.username || ''}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select name="role" className="form-select" defaultValue={user.user.role}>
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      setShowUserModal(false);
                      setEditingUser(null);
                    }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-6">
                      <h6>User Information</h6>
                      <p><strong>Name:</strong> {user.user.name}</p>
                      <p><strong>Email:</strong> {user.user.email}</p>
                      <p><strong>Username:</strong> {user.user.username || 'N/A'}</p>
                      <p><strong>Role:</strong> {user.user.role}</p>
                      <p><strong>Created:</strong> {new Date(user.user.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Login History</h6>
                      {user.loginHistory?.slice(0, 5).map((login, index) => (
                        <div key={login._id || index} className="mb-2 p-2 border rounded">
                          <small>
                            <strong>{new Date(login.loginTime).toLocaleString()}</strong><br />
                            IP: {login.ipAddress || 'N/A'}<br />
                            Device: {login.userAgent?.substring(0, 30)}...
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowUserModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => setEditingUser(user)}
                    >
                      <FaEdit className="me-2" />Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <FaSpinner className="spinner-border text-primary" role="status" />
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mt-5 text-center">
        <p>Please log in to view this page.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/admin-login')}>
          Go to Login
        </button>
      </div>
    );
  }

  // Additional check for admin role (in case someone bypasses the ProtectedRoute)
  if (user && user.role !== 'admin') {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Access Denied</h4>
          <p>You do not have permission to access the admin dashboard.</p>
          <p>Please contact an administrator if you believe this is an error.</p>
        </div>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="admin-dashboard-container container-fluid mt-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="dashboard-title">
            <FaUserShield className="me-2" />
            Enhanced Admin Dashboard
          </h2>
          <button className="btn btn-danger" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4" id="adminTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartBar className="me-2" />
              Overview
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FaUsers className="me-2" />
              User Management ({dashboardData?.users?.length || 0})
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              <FaComments className="me-2" />
              Login Sessions ({dashboardData?.recentLogins?.length || 0})
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content" id="adminTabContent">
          {/* Overview Tab */}
          <div className={`tab-pane fade ${activeTab === 'overview' ? 'show active' : ''}`}>
            {renderOverviewTab()}
          </div>

          {/* Users Tab */}
          <div className={`tab-pane fade ${activeTab === 'users' ? 'show active' : ''}`}>
            {renderUsersTab()}
          </div>

          {/* Feedback Tab */}
          <div className={`tab-pane fade ${activeTab === 'feedback' ? 'show active' : ''}`}>
            {renderFeedbackTab()}
          </div>
        </div>
      </div>

      {renderFeedbackModal()}
      {renderUserModal()}
    </>
  );
}