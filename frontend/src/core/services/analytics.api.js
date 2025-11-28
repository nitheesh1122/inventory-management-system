/**
 * Analytics API Service
 * Handles all analytics-related API calls
 */

import apiClient from "./api.client";
import { API_ENDPOINTS } from "../config/api.config";

export const analyticsAPI = {
  /**
   * Get sales analytics
   * @param {Object} params - Query parameters (startDate, endDate)
   * @returns {Promise<Object>} Sales analytics
   */
  getSales: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.SALES, { params });
    return response.data;
  },

  /**
   * Get inventory analytics
   * @returns {Promise<Object>} Inventory analytics
   */
  getInventory: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.INVENTORY);
    return response.data;
  },

  /**
   * Get dashboard analytics (combined)
   * @param {Object} params - Query parameters (startDate, endDate)
   * @returns {Promise<Object>} Dashboard analytics
   */
  getDashboard: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARD, { params });
    return response.data;
  },
};

export default analyticsAPI;

