/**
 * Routes Configuration
 * Application route paths
 */

export const ROUTES = {
  // Public
  LOGIN: '/login',
  
  // Protected
  HOME: '/',
  DASHBOARD: '/dashboard',
  INVENTORY: '/inventory',
  PRODUCTS: '/products',
  SALES: '/sales',
  BILLING: '/billing',
  SUPPLIERS: '/suppliers',
  ANALYTICS: '/analytics',
  USERS: '/users', // Admin only - User/Staff Management
  SETTINGS: '/settings',
  PROFILE: '/profile',
  
  // Worker/Staff
  WORKER: '/worker',
  
  // Error
  NOT_FOUND: '/404',
};

export default ROUTES;
