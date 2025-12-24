import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthTest = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div style={{ padding: '20px', marginTop: '100px' }}>
      <h2>Auth Status Test</h2>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <button onClick={() => console.log('Auth state:', { isAuthenticated, user })}>
        Log Auth State
      </button>
      {isAuthenticated && (
        <button onClick={logout} style={{ marginLeft: '10px' }}>
          Logout
        </button>
      )}
    </div>
  );
};

export default AuthTest;
