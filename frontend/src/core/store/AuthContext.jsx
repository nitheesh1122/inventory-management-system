/**
 * Authentication Context
 * Global authentication state management
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services';
import { setAuthToken, setUser, getUser, isAuthenticated } from '../../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = getUser();
          setUserState(userData);
          
          // Verify token is still valid
          const response = await authAPI.getMe();
          if (response.status === 'success') {
            setUserState(response.user);
            setUser(response.user);
          }
        } catch (err) {
          // Token invalid, clear auth
          setAuthToken(null);
          setUser(null);
          setUserState(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<void>}
   */
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      if (response.status === 'success') {
        setAuthToken(response.token);
        setUser(response.user);
        setUserState(response.user);
        return response.user;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setUserState(null);
    window.location.href = '/login';
  };

  /**
   * Register user
   * @param {Object} userData - User registration data
   * @returns {Promise<void>}
   */
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.status === 'success') {
        setAuthToken(response.token);
        setUser(response.user);
        setUserState(response.user);
        return response.user;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

