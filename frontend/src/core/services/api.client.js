/**
 * API Client
 * Axios instance with interceptors for authentication and error handling
 */

import axios from "axios";
import API_CONFIG from "../config/api.config";
import { getAuthToken, logout } from "../../utils/auth";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 (unauthorized) - logout user
      if (error.response.status === 401) {
        logout();
      }
      
      // Handle other errors
      const errorMessage = error.response.data?.message || error.response.data?.error || "An error occurred";
      return Promise.reject(new Error(errorMessage));
    }
    
    // Network error
    if (error.request) {
      return Promise.reject(new Error("Network error. Please check your connection."));
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

