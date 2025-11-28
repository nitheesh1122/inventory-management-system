import axios from "axios";
import API_CONFIG, { API_ENDPOINTS } from "../config/api";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 (unauthorized) - logout user
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post(API_ENDPOINTS.LOGIN, credentials),
    register: (userData) => api.post(API_ENDPOINTS.REGISTER, userData),
    getMe: () => api.get(API_ENDPOINTS.ME),
    getUsers: () => api.get(API_ENDPOINTS.USERS),
};

// Inventory API
export const inventoryAPI = {
    getAll: (params) => api.get(API_ENDPOINTS.INVENTORY, { params }),
    getById: (id) => api.get(API_ENDPOINTS.INVENTORY_ITEM(id)),
    create: (data) => api.post(API_ENDPOINTS.INVENTORY, data),
    update: (id, data) => api.put(API_ENDPOINTS.INVENTORY_ITEM(id), data),
    delete: (id) => api.delete(API_ENDPOINTS.INVENTORY_ITEM(id)),
    updateStock: (id, data) => api.put(API_ENDPOINTS.INVENTORY_STOCK(id), data),
    checkLowStock: () => api.get(API_ENDPOINTS.LOW_STOCK),
};

// Sales API
export const salesAPI = {
    getAll: (params) => api.get(API_ENDPOINTS.SALES, { params }),
    getById: (id) => api.get(API_ENDPOINTS.SALES_ITEM(id)),
    create: (data) => api.post(API_ENDPOINTS.SALES, data),
    delete: (id) => api.delete(API_ENDPOINTS.SALES_ITEM(id)),
};

// Billing API (backward compatibility)
export const billingAPI = {
    getAll: () => api.get(API_ENDPOINTS.BILLING),
    getById: (id) => api.get(API_ENDPOINTS.BILLING_ITEM(id)),
    create: (data) => api.post(API_ENDPOINTS.BILLING, data),
    delete: (id) => api.delete(API_ENDPOINTS.BILLING_ITEM(id)),
};

// Suppliers API
export const suppliersAPI = {
    getAll: () => api.get(API_ENDPOINTS.SUPPLIERS),
    getById: (id) => api.get(API_ENDPOINTS.SUPPLIER_ITEM(id)),
    create: (data) => api.post(API_ENDPOINTS.SUPPLIERS, data),
    update: (id, data) => api.put(API_ENDPOINTS.SUPPLIER_ITEM(id), data),
    delete: (id) => api.delete(API_ENDPOINTS.SUPPLIER_ITEM(id)),
};

// Analytics API
export const analyticsAPI = {
    getSales: (params) => api.get(API_ENDPOINTS.ANALYTICS_SALES, { params }),
    getInventory: () => api.get(API_ENDPOINTS.ANALYTICS_INVENTORY),
    getDashboard: (params) => api.get(API_ENDPOINTS.ANALYTICS_DASHBOARD, { params }),
};

export default api;

