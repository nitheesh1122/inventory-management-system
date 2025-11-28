import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  ArcElement
} from 'chart.js';
import { analyticsAPI, inventoryAPI, salesAPI } from '../../services/api';
import { CircularProgress, Alert } from '@mui/material';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

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

      const [analyticsRes, lowStockRes, salesRes] = await Promise.all([
        analyticsAPI.getDashboard({ 
          startDate: startDate.toISOString().split('T')[0], 
          endDate: endDate.toISOString().split('T')[0] 
        }),
        inventoryAPI.checkLowStock(),
        salesAPI.getAll({ limit: 10 })
      ]);

      setAnalytics(analyticsRes.data.analytics);
      setLowStockItems(lowStockRes.data.items || []);
      setRecentSales(salesRes.data.sales || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Process data for charts
  const getChartsData = () => {
    if (!analytics) return { salesData: null, dailySalesData: null, categorySalesData: null };

    const sales = analytics.sales;
    
    // Monthly sales data (last 6 months)
    const monthlyLabels = [];
    const monthlyData = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthlyLabels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      // Calculate monthly sales from daily breakdown
      const monthSales = sales.dailyBreakdown
        .filter(d => {
          const dDate = new Date(d.date);
          return dDate.getMonth() === date.getMonth() && dDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, d) => sum + d.revenue, 0);
      monthlyData.push(monthSales);
    }

    const salesData = {
      labels: monthlyLabels,
      datasets: [{ 
        label: 'Monthly Sales (₹)', 
        data: monthlyData, 
        backgroundColor: '#1E3A8A' 
      }]
    };

    // Daily sales data (last 7 days)
    const last7Days = sales.dailyBreakdown.slice(-7);
    const dailySalesData = {
      labels: last7Days.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      datasets: [{ 
        label: 'Daily Sales (₹)', 
        data: last7Days.map(d => d.revenue), 
        borderColor: '#1E3A8A', 
        fill: false 
      }]
    };

    // Category sales data
    const categoryLabels = Object.keys(sales.categoryStats || {});
    const categoryData = Object.values(sales.categoryStats || {}).map(cat => cat.revenue);
    const colors = ['#1E3A8A', '#22C55E', '#EF4444', '#EAB308', '#8B5CF6', '#F59E0B', '#EC4899'];
    const categorySalesData = {
      labels: categoryLabels,
      datasets: [{ 
        label: 'Sales by Category', 
        data: categoryData, 
        backgroundColor: colors.slice(0, categoryLabels.length) 
      }]
    };

    return { salesData, dailySalesData, categorySalesData };
  };

  const { salesData, dailySalesData, categorySalesData } = getChartsData();

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container" style={{ padding: '20px' }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="dashboard-container" style={{ padding: '20px' }}>
        <Alert severity="info">No data available</Alert>
      </div>
    );
  }

  const sales = analytics.sales;
  const inventory = analytics.inventory;
  
  const totalSales = formatCurrency(sales?.totalRevenue || 0);
  const bestProduct = sales?.topProducts?.[0]?.name || 'N/A';
  const worstProduct = sales?.lowProducts?.[0]?.name || 'N/A';

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Component */}

      {/* Main Dashboard Content */}
      <div className={darkMode ? "dashboard-container dark-mode" : "dashboard-container"}>
        <div className="dashboard-header">
          <h2>📊 Inventory Dashboard</h2>
          <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div className="summary-cards">
          <motion.div className="card total-sales" whileHover={{ scale: 1.05 }}>
            <h3>Total Sales</h3>
            <p>{totalSales}</p>
          </motion.div>

          <motion.div className="card best-product" whileHover={{ scale: 1.05 }}>
            <h3>Best Product</h3>
            <p>{bestProduct}</p>
          </motion.div>

          <motion.div className="card worst-product" whileHover={{ scale: 1.05 }}>
            <h3>Worst Product</h3>
            <p>{worstProduct}</p>
          </motion.div>
        </div>

        <div className="dashboard-section">
          <div className="chart-container">
            <h3>📈 Sales Performance (Monthly)</h3>
            <Bar key="sales-chart" data={salesData} />
          </div>

          <div className="chart-container">
            <h3>📊 Category-wise Sales</h3>
            <Pie key="category-chart" data={categorySalesData} />
          </div>
        </div>

        <div className="dashboard-section">
          <div className="chart-container">
            <h3>📉 Daily Sales Trend</h3>
            <Line key="daily-sales-chart" data={dailySalesData} />
          </div>

          <div className="low-stock">
            <h3>⚠️ Low Stock Alerts</h3>
            <ul>
              {lowStockItems.map(item => (
                <li key={item.name}>{item.name} - Only {item.stock} left!</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="chart-container">
            <h3>📈 Sales Performance (Monthly)</h3>
            {salesData ? (
              <Bar key="sales-chart" data={salesData} options={{ responsive: true, maintainAspectRatio: true }} />
            ) : (
              <p>No sales data available</p>
            )}
          </div>

          <div className="chart-container">
            <h3>📊 Category-wise Sales</h3>
            {categorySalesData && categorySalesData.labels.length > 0 ? (
              <Pie key="category-chart" data={categorySalesData} options={{ responsive: true, maintainAspectRatio: true }} />
            ) : (
              <p>No category data available</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="chart-container">
            <h3>📉 Daily Sales Trend</h3>
            {dailySalesData && dailySalesData.labels.length > 0 ? (
              <Line key="daily-sales-chart" data={dailySalesData} options={{ responsive: true, maintainAspectRatio: true }} />
            ) : (
              <p>No daily sales data available</p>
            )}
          </div>

          <div className="low-stock">
            <h3>⚠️ Low Stock Alerts</h3>
            {lowStockItems.length > 0 ? (
              <ul>
                {lowStockItems.slice(0, 5).map((item, index) => (
                  <li key={index}>{item.name} - Only {item.quantity} left!</li>
                ))}
              </ul>
            ) : (
              <p>No low stock items</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="recent-orders">
            <h3>🛒 Recent Sales</h3>
            {recentSales.length > 0 ? (
              <ul>
                {recentSales.slice(0, 5).map(sale => (
                  <li key={sale._id}>
                    {sale.productName} - {sale.customerName} - {formatCurrency(sale.totalAmount)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent sales</p>
            )}
          </div>

          <div className="top-customers">
            <h3>🏆 Top Products</h3>
            {sales?.topProducts && sales.topProducts.length > 0 ? (
              <ul>
                {sales.topProducts.slice(0, 5).map((product, index) => (
                  <li key={index}>
                    {product.name} - {formatCurrency(product.revenue)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No product data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
