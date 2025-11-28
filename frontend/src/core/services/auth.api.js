/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import apiClient from "./api.client";
import { API_ENDPOINTS } from "../config/api.config";

export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} { user, token }
   */
  login: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} { user, token }
   */
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Get current user
   * @returns {Promise<Object>} User object
   */
  getMe: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  /**
   * Get all users (Admin only)
   * @returns {Promise<Array>} Users array
   */
  getUsers: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.USERS);
    return response.data;
  },
};

export default authAPI;

