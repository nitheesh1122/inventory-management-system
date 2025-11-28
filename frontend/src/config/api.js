// API Configuration
const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5009/api",
    TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_CONFIG.BASE_URL}/auth/login`,
    REGISTER: `${API_CONFIG.BASE_URL}/auth/register`,
    ME: `${API_CONFIG.BASE_URL}/auth/me`,
    USERS: `${API_CONFIG.BASE_URL}/auth/users`,
    
    // Inventory
    INVENTORY: `${API_CONFIG.BASE_URL}/inventory`,
    INVENTORY_ITEM: (id) => `${API_CONFIG.BASE_URL}/inventory/${id}`,
    INVENTORY_STOCK: (id) => `${API_CONFIG.BASE_URL}/inventory/${id}/stock`,
    LOW_STOCK: `${API_CONFIG.BASE_URL}/inventory/low-stock/check`,
    
    // Sales
    SALES: `${API_CONFIG.BASE_URL}/sales`,
    SALES_ITEM: (id) => `${API_CONFIG.BASE_URL}/sales/${id}`,
    
    // Billing (backward compatibility)
    BILLING: `${API_CONFIG.BASE_URL}/billing`,
    BILLING_ITEM: (id) => `${API_CONFIG.BASE_URL}/billing/${id}`,
    
    // Suppliers
    SUPPLIERS: `${API_CONFIG.BASE_URL}/suppliers`,
    SUPPLIER_ITEM: (id) => `${API_CONFIG.BASE_URL}/suppliers/${id}`,
    
    // Analytics
    ANALYTICS_SALES: `${API_CONFIG.BASE_URL}/analytics/sales`,
    ANALYTICS_INVENTORY: `${API_CONFIG.BASE_URL}/analytics/inventory`,
    ANALYTICS_DASHBOARD: `${API_CONFIG.BASE_URL}/analytics/dashboard`,
    
    // Health
    HEALTH: `${API_CONFIG.BASE_URL}/health`,
};

export default API_CONFIG;

