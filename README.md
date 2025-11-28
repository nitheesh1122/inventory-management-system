# Inventory Management System

A comprehensive inventory management system with authentication, role-based access control, sales tracking, supplier management, and analytics.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Staff)
  - Protected routes

- 📦 **Inventory Management**
  - Add, update, delete products
  - Stock management with automatic updates
  - Low stock alerts
  - Category-based organization
  - Supplier linking

- 💰 **Sales & Billing**
  - Sales transaction recording
  - Automatic stock reduction on sales
  - Order history tracking
  - Payment method tracking

- 📊 **Analytics & Dashboard**
  - Sales analytics (daily, weekly, monthly)
  - Top-selling products
  - Low-performing products
  - Inventory valuation
  - Real-time data visualization

- 🏢 **Supplier Management**
  - Supplier database
  - Product-supplier relationships
  - Contact management

- 🔔 **Notifications**
  - Low stock alerts
  - Automated notifications (email/SMS - ready for implementation)

## Tech Stack

### Backend
- Node.js + Express
- MongoDB Atlas
- JWT Authentication
- Winston Logging
- Joi Validation

### Frontend
- React
- Material-UI
- Axios
- React Router

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `backend` directory:
```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://nitheeshs:<db_password>@bus.bpygbsj.mongodb.net/inventory?retryWrites=true&w=majority&appName=BUS

# Server Configuration
PORT=5009
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Low Stock Threshold
LOW_STOCK_THRESHOLD=10
```

**Important:** Replace `<db_password>` in the MONGO_URI with your actual MongoDB Atlas password.

4. Create default admin user:
```bash
node scripts/createAdmin.js
```

This creates:
- Admin user: `admin@inventory.com` / `admin123`
- Staff user: `staff@inventory.com` / `staff123`

**⚠️ Change these passwords after first login in production!**

5. Start the server:
```bash
npm run dev
# or
npm start
```

Server will run on `http://localhost:5009`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `frontend` directory (optional):
```env
REACT_APP_API_URL=http://localhost:5009/api
```

4. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users (Admin only)

### Inventory
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/:id` - Get single item
- `POST /api/inventory` - Create item (Admin only)
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item (Admin only)
- `PUT /api/inventory/:id/stock` - Update stock
- `GET /api/inventory/low-stock/check` - Check low stock items

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get single sale
- `POST /api/sales` - Create sale
- `DELETE /api/sales/:id` - Delete sale

### Billing (Backward Compatibility)
- `GET /api/billing` - Get all sales
- `POST /api/billing` - Create sale

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get single supplier
- `POST /api/suppliers` - Create supplier (Admin only)
- `PUT /api/suppliers/:id` - Update supplier (Admin only)
- `DELETE /api/suppliers/:id` - Delete supplier (Admin only)

### Analytics
- `GET /api/analytics/sales` - Sales analytics (Admin only)
- `GET /api/analytics/inventory` - Inventory analytics (Admin only)
- `GET /api/analytics/dashboard` - Dashboard data (Admin only)

## Project Structure

```
inventory-management-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── validator.js
│   ├── models/
│   │   ├── Inventory.js
│   │   ├── Sales.js
│   │   ├── User.js
│   │   └── Supplier.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── inventory.js
│   │   ├── sales.js
│   │   ├── billing.js
│   │   ├── supplier.js
│   │   └── analytics.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── utils/
│   │   ├── analytics.js
│   │   └── notifications.js
│   ├── logs/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with Joi
- Rate limiting
- Helmet.js for security headers
- CORS configuration

## Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 5009)
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time
- `FRONTEND_URL` - Frontend URL for CORS
- `LOW_STOCK_THRESHOLD` - Low stock threshold

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL

## Logging

Logs are stored in:
- `backend/logs/error.log` - Error logs
- `backend/logs/combined.log` - All logs

## Future Enhancements

- Email/SMS notifications implementation
- AI Chatbot integration
- Real-time updates with WebSockets
- Advanced reporting and exports
- Multi-location inventory
- Barcode/QR code support
- Customer loyalty program
- Purchase order automation

## License

ISC

## Contributors

Nitheesh S

