/**
 * Billing / Point of Sale Page
 * Modern POS interface for staff users
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Alert,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { productsAPI, salesAPI } from '../../../core/services';
import { formatCurrency } from '../../../core/utils/formatters';
import Loading from '../../../shared/ui/Loading';
import EmptyState from '../../../shared/ui/EmptyState';

const BillingPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [openReceipt, setOpenReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({ status: 'active' });
      setProducts(response.products || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.productId === product._id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        setError(`Only ${product.quantity} units available`);
        return;
      }
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (product.quantity < 1) {
        setError('Product is out of stock');
        return;
      }
      setCart([
        ...cart,
        {
          productId: product._id,
          productName: product.name,
          category: product.category,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
    setError(null);
  };

  const updateCartQuantity = (productId, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.productId === productId) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Create sale for each item in cart
      const sales = await Promise.all(
        cart.map((item) =>
          salesAPI.create({
            productId: item.productId,
            productName: item.productName,
            category: item.category,
            quantity: item.quantity,
            price: item.price,
            customerName: customerName || 'Walk-in Customer',
            customerPhone: customerPhone,
            paymentMethod: paymentMethod,
          })
        )
      );

      setLastSale({
        items: cart,
        total: calculateTotal(),
        customerName: customerName || 'Walk-in Customer',
        paymentMethod: paymentMethod,
      });

      // Clear cart and customer info
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setOpenReceipt(true);

      // Refresh products to update stock
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Failed to complete sale');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) {
    return <Loading message="Loading products..." />;
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Point of Sale
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Process sales and manage transactions
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Product Selection */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={6} sm={4} md={3} key={product._id}>
                    <Paper
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => addToCart(product)}
                    >
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="h6" color="primary.main" sx={{ mt: 0.5 }}>
                        {formatCurrency(product.price)}
                      </Typography>
                      <Chip
                        label={`Qty: ${product.quantity}`}
                        size="small"
                        color={product.quantity === 0 ? 'error' : product.quantity <= product.reorderLevel ? 'warning' : 'success'}
                        sx={{ mt: 1, width: '100%' }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {filteredProducts.length === 0 && (
                <EmptyState title="No products found" message="Try a different search term." />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Cart & Checkout */}
        <Grid item xs={12} md={5}>
          <Card sx={{ position: 'sticky', top: 100 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CartIcon />
                <Typography variant="h6" fontWeight={600}>
                  Shopping Cart
                </Typography>
                <Chip label={cart.length} size="small" color="primary" />
              </Box>

              {cart.length === 0 ? (
                <EmptyState
                  title="Cart is empty"
                  message="Add products from the left to start billing."
                  icon={CartIcon}
                />
              ) : (
                <>
                  <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
                    {cart.map((item) => (
                      <Paper
                        key={item.productId}
                        sx={{
                          p: 2,
                          mb: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {item.productName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatCurrency(item.price)} × {item.quantity}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateCartQuantity(item.productId, -1)}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body2" fontWeight={600}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateCartQuantity(item.productId, 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Customer Info */}
                  <TextField
                    fullWidth
                    label="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Phone (Optional)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    select
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                  </TextField>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h5" fontWeight={700} color="primary.main">
                      {formatCurrency(calculateTotal())}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<ReceiptIcon />}
                    onClick={handleCheckout}
                    disabled={loading || cart.length === 0}
                    sx={{ py: 1.5 }}
                  >
                    Complete Sale
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Receipt Dialog */}
      <Dialog open={openReceipt} onClose={() => setOpenReceipt(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon />
            Sale Receipt
          </Box>
        </DialogTitle>
        <DialogContent>
          {lastSale && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Customer: {lastSale.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Payment: {lastSale.paymentMethod.toUpperCase()}
              </Typography>
              <Divider sx={{ my: 2 }} />
              {lastSale.items.map((item) => (
                <Box
                  key={item.productId}
                  sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                >
                  <Typography variant="body2">
                    {item.productName} × {item.quantity}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" fontWeight={700}>
                  {formatCurrency(lastSale.total)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReceipt(false)} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingPage;

