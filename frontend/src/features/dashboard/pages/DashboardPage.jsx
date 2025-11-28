/**
 * Dashboard Page
 * Admin dashboard with analytics and overview
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  Inventory as InventoryIcon,
  ShoppingCart as SalesIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { analyticsAPI, productsAPI } from '../../../core/services';
import { formatCurrency, formatDate, formatNumber } from '../../../core/utils/formatters';
import Loading from '../../../shared/ui/Loading';
import EmptyState from '../../../shared/ui/EmptyState';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range for last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const [analyticsRes, lowStockRes] = await Promise.all([
        analyticsAPI.getDashboard({
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        }),
        productsAPI.getLowStock(),
      ]);

      setAnalytics(analyticsRes.data.analytics);
      setLowStockItems(lowStockRes.data.products || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!analytics) {
    return <EmptyState title="No data available" message="Dashboard data is not available yet." />;
  }

  const sales = analytics.sales || {};
  const inventory = analytics.inventory || {};

  // Chart data
  const salesData = {
    labels: sales.dailyBreakdown?.slice(-7).map(d => formatDate(d.date, 'short')) || [],
    datasets: [
      {
        label: 'Daily Sales',
        data: sales.dailyBreakdown?.slice(-7).map(d => d.revenue) || [],
        backgroundColor: 'rgba(25, 118, 210, 0.8)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 2,
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(sales.categoryStats || {}),
    datasets: [
      {
        data: Object.values(sales.categoryStats || {}).map(cat => cat.revenue),
        backgroundColor: [
          '#1976d2',
          '#2e7d32',
          '#ed6c02',
          '#d32f2f',
          '#9c27b0',
          '#0288d1',
        ],
      },
    ],
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's your inventory overview.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {formatCurrency(sales.totalRevenue || 0)}
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'success.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Sales
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {sales.totalSales || 0}
                  </Typography>
                </Box>
                <SalesIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Products
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {inventory.totalItems || 0}
                  </Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'warning.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Low Stock
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {inventory.lowStockCount || 0}
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Trend (Last 7 Days)
              </Typography>
              {salesData.labels.length > 0 ? (
                <Line
                  data={salesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
              ) : (
                <EmptyState title="No sales data" message="No sales data available for the selected period." />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales by Category
              </Typography>
              {categoryData.labels.length > 0 ? (
                <Pie
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                  }}
                />
              ) : (
                <EmptyState title="No category data" message="No category sales data available." />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="warning.main">
              ⚠️ Low Stock Alerts
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {lowStockItems.slice(0, 6).map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'warning.light',
                      color: 'warning.contrastText',
                    }}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2">
                      Only {item.quantity} left (Reorder: {item.reorderLevel})
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Top Products */}
      {sales.topProducts && sales.topProducts.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🏆 Top Selling Products
                </Typography>
                {sales.topProducts.slice(0, 5).map((product, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.quantity} sold
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600} color="primary.main">
                      {formatCurrency(product.revenue)}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Inventory Summary
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Total Items</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {inventory.totalItems || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Total Value</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(inventory.totalValue || 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Total Quantity</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatNumber(inventory.totalQuantity || 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Out of Stock</Typography>
                    <Typography variant="body2" fontWeight={600} color="error.main">
                      {inventory.outOfStockCount || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default DashboardPage;

