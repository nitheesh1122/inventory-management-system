/**
 * Analytics Page
 * Advanced analytics and reports (Admin only)
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Paper,
} from '@mui/material';
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
import { analyticsAPI } from '../../../core/services';
import { formatCurrency, formatDate } from '../../../core/utils/formatters';
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

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsAPI.getDashboard({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      setAnalytics(response.analytics);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading analytics..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!analytics) {
    return <EmptyState title="No analytics data" message="No data available for the selected period." />;
  }

  const sales = analytics.sales || {};
  const inventory = analytics.inventory || {};

  // Sales chart data
  const salesChartData = {
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

  // Category chart data
  const categoryChartData = {
    labels: Object.keys(sales.categoryStats || {}),
    datasets: [
      {
        label: 'Revenue',
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
          Analytics & Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Detailed analytics and insights
        </Typography>
      </Box>

      {/* Date Range Filter */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Trend
              </Typography>
              {salesChartData.labels.length > 0 ? (
                <Line
                  data={salesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
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
              {categoryChartData.labels.length > 0 ? (
                <Pie
                  data={categoryChartData}
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
    </Box>
  );
};

export default AnalyticsPage;

