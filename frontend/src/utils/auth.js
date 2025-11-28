/**
 * Auth Utilities
 * Authentication helper functions
 */

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

/**
 * Get authentication token
 * @returns {string|null} JWT token
 */
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

/**
 * Set user data
 * @param {Object} user - User object
 */
export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};

/**
 * Get user data
 * @returns {Object|null} User object
 */
export const getUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} Is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Check if user is admin
 * @returns {boolean} Is admin
 */
export const isAdmin = () => {
  const user = getUser();
  return user && user.role === "admin";
};

/**
 * Check if user is staff
 * @returns {boolean} Is staff
 */
export const isStaff = () => {
  const user = getUser();
  return user && user.role === "staff";
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
