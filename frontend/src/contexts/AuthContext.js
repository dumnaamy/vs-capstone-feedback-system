import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import jwtDecode from 'jwt-decode';   // ✅ Correct import (default export)
import { api } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkTokenValidity = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
      
      if (response.status !== 200) throw new Error('Failed to refresh token');
      
      localStorage.setItem('accessToken', response.data.access);
      return true;
    } catch (err) {
      console.error('Token refresh error:', err);
      return false;
    }
  };

  // ✅ Wrapped in useCallback to avoid ESLint warnings
  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (token && checkTokenValidity(token)) {
      setIsAuthenticated(true);
      setUser(jwtDecode(token));
    } else {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const newToken = localStorage.getItem('accessToken');
        setIsAuthenticated(true);
        setUser(jwtDecode(newToken));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);  // no deps → safe

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);  // ✅ no warning now

  const login = async (userData) => {
    try {
      // Store the token - backend returns it as 'token' property
      if (userData.token) {
        localStorage.setItem('accessToken', userData.token);
      }
      
      // Decode the token to get user information including role
      const decodedUser = jwtDecode(userData.token);
      setUser(decodedUser);
      setIsAuthenticated(true);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      logout,
      setIsAuthenticated, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
