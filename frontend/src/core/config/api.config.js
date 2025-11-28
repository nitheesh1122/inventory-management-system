/**
 * API Configuration
 * Centralized API endpoints and configuration
 */

const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5009/api",
  TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_CONFIG.BASE_URL}/auth/login`,
    REGISTER: `${API_CONFIG.BASE_URL}/auth/register`,
    ME: `${API_CONFIG.BASE_URL}/auth/me`,
    USERS: `${API_CONFIG.BASE_URL}/auth/users`,
  },
  
  // Products (Inventory)
  PRODUCTS: {
    BASE: `${API_CONFIG.BASE_URL}/products`,
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/products/${id}`,
    STOCK: (id) => `${API_CONFIG.BASE_URL}/products/${id}/stock`,
    LOW_STOCK: `${API_CONFIG.BASE_URL}/products/low-stock/check`,
    // Backward compatibility
    INVENTORY: `${API_CONFIG.BASE_URL}/inventory`,
  },
  
  // Sales
  SALES: {
    BASE: `${API_CONFIG.BASE_URL}/sales`,
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/sales/${id}`,
    // Backward compatibility
    BILLING: `${API_CONFIG.BASE_URL}/billing`,
  },
  
  // Suppliers
  SUPPLIERS: {
    BASE: `${API_CONFIG.BASE_URL}/suppliers`,
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/suppliers/${id}`,
  },
  
  // Analytics
  ANALYTICS: {
    SALES: `${API_CONFIG.BASE_URL}/analytics/sales`,
    INVENTORY: `${API_CONFIG.BASE_URL}/analytics/inventory`,
    DASHBOARD: `${API_CONFIG.BASE_URL}/analytics/dashboard`,
  },
  
  // Health
  HEALTH: `${API_CONFIG.BASE_URL}/health`,
};

export default API_CONFIG;

