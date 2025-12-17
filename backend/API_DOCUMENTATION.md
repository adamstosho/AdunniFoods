# Adunni Foods API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL & Endpoints](#base-url--endpoints)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Examples](#examples)
9. [Testing](#testing)
10. [Deployment](#deployment)

## Overview

The Adunni Foods API is a comprehensive REST API for managing plantain chips products, customer orders, and business operations. Built with Express.js, TypeScript, and MongoDB, it provides a robust backend for food ordering systems.

### Key Features
- **Product Management**: CRUD operations for plantain chips products
- **Order Processing**: Customer order creation and management
- **Admin Authentication**: Secure JWT-based admin system
- **File Uploads**: Product image management via Cloudinary
- **WhatsApp Integration**: Order notifications and communication
- **Email Services**: Customer communication via SendGrid
- **CSV Export**: Order data export functionality

## Authentication

The API uses JWT (JSON Web Token) authentication for admin endpoints.

### Getting a Token
1. **Login Endpoint**: `POST /api/auth/login`
2. **Include Credentials**: Username and password
3. **Receive Token**: JWT token in response
4. **Use Token**: Include in `Authorization` header

### Using the Token
```http
Authorization: Bearer <your_jwt_token>
```

### Token Expiration
- JWT tokens expire after 24 hours
- Re-authenticate to get a new token

### Admin User Management

#### Creating Admin Users
1. **Use Registration Endpoint**: `POST /api/auth/register`
2. **Follow Username Rules**: 3-30 characters, letters/numbers/underscores only
3. **Strong Passwords**: Minimum 8 characters
4. **Unique Usernames**: No duplicate usernames allowed

#### Admin Account Types
- **Super Admin**: Full access to all endpoints
- **Product Manager**: Can manage products and upload images
- **Order Manager**: Can view and update orders, export data

#### Security Best Practices
- Use strong, unique passwords for each admin account
- Regularly rotate admin credentials
- Monitor admin activity logs
- Remove unused admin accounts promptly

## Base URL & Endpoints

### Development
```
http://localhost:5000/api
```

### Production
```
https://api.adunnifoods.com/api
```

## API Endpoints

### 1. General

#### Health Check
```http
GET /api/
```
**Description**: API health check and status information  
**Authentication**: None  
**Response**: Basic API information

---

### 2. Authentication

#### Admin Registration
```http
POST /api/auth/register
```
**Description**: Create a new admin user account  
**Authentication**: None  
**Request Body**:
```json
{
  "username": "newadmin",
  "password": "securepassword123",
  "confirmPassword": "securepassword123"
}
```
**Response**: Confirmation of admin user creation  
**Validation Rules**:
- Username: 3-30 characters, letters/numbers/underscores only
- Password: Minimum 8 characters
- confirmPassword must match password exactly

#### Admin Login
```http
POST /api/auth/login
```
**Description**: Authenticate admin user and receive JWT token  
**Authentication**: None  
**Request Body**:
```json
{
  "username": "admin",
  "password": "your_password"
}
```
**Response**: JWT token and admin information

---

### 3. Products

#### List All Products
```http
GET /api/products
```
**Description**: Retrieve all available products  
**Authentication**: None  
**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search by name or description

#### Get Product by ID
```http
GET /api/products/{id}
```
**Description**: Retrieve specific product by ID  
**Authentication**: None  
**Path Parameters**:
- `id`: Product ID (MongoDB ObjectId)

#### Create Product
```http
POST /api/products
```
**Description**: Create new product (Admin only)  
**Authentication**: Required (JWT)  
**Request Body**:
```json
{
  "name": "Spicy Plantain Chips",
  "slug": "spicy-plantain-chips",
  "description": "Delicious spicy plantain chips with a kick",
  "price": 15.99,
  "stock": 100,
  "images": ["https://example.com/image.jpg"]
}
```

#### Update Product
```http
PUT /api/products/{id}
```
**Description**: Update existing product (Admin only)  
**Authentication**: Required (JWT)  
**Path Parameters**:
- `id`: Product ID (MongoDB ObjectId)

#### Delete Product
```http
DELETE /api/products/{id}
```
**Description**: Delete product (Admin only)  
**Authentication**: Required (JWT)  
**Path Parameters**:
- `id`: Product ID (MongoDB ObjectId)

---

### 4. Orders

#### List All Orders
```http
GET /api/orders
```
**Description**: Retrieve all orders (Admin only)  
**Authentication**: Required (JWT)  
**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status
- `startDate` (optional): Filter from date (YYYY-MM-DD)
- `endDate` (optional): Filter until date (YYYY-MM-DD)

#### Create Order
```http
POST /api/orders
```
**Description**: Create new customer order (Public)  
**Authentication**: None  
**Request Body**:
```json
{
  "customerName": "John Doe",
  "customerPhone": "2348144665646",
  "address": "123 Main Street, Lagos, Nigeria",
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "name": "Spicy Plantain Chips",
      "qty": 2,
      "price": 15.99
    }
  ],
  "totalAmount": 31.98,
  "paymentMethod": "bank_transfer"
}
```

#### Get Order by ID
```http
GET /api/orders/{id}
```
**Description**: Retrieve specific order by ID (Admin only)  
**Authentication**: Required (JWT)  
**Path Parameters**:
- `id`: Order ID (MongoDB ObjectId)

#### Update Order Status
```http
PUT /api/orders/{id}
```
**Description**: Update order status (Admin only)  
**Authentication**: Required (JWT)  
**Path Parameters**:
- `id`: Order ID (MongoDB ObjectId)  
**Request Body**:
```json
{
  "status": "Packed"
}
```

#### Export Orders as CSV
```http
GET /api/orders/export/csv
```
**Description**: Export orders to CSV format (Admin only)  
**Authentication**: Required (JWT)  
**Query Parameters**:
- `startDate` (optional): Export from date (YYYY-MM-DD)
- `endDate` (optional): Export until date (YYYY-MM-DD)
- `status` (optional): Filter by status

---

### 5. File Uploads

#### Upload Product Image
```http
POST /api/upload
```
**Description**: Upload product image (Admin only)  
**Authentication**: Required (JWT)  
**Content-Type**: `multipart/form-data`  
**Request Body**:
- `file`: Image file (JPG, PNG, WebP, max 5MB)

---

## Data Models

### Product
```typescript
interface Product {
  _id: string;           // MongoDB ObjectId
  name: string;          // Product name
  slug: string;          // URL-friendly identifier
  description?: string;  // Product description
  price: number;         // Price in local currency
  stock: number;         // Available quantity
  images: string[];      // Array of image URLs
  createdAt: Date;       // Creation timestamp
}
```

### Order
```typescript
interface Order {
  _id: string;                    // MongoDB ObjectId
  customerName: string;           // Customer's full name
  customerPhone: string;          // Customer's phone number
  address: string;                // Delivery address
  items: OrderItem[];             // Array of ordered items
  totalAmount: number;            // Total order amount
  paymentMethod: PaymentMethod;   // Payment method
  status: OrderStatus;            // Current order status
  createdAt: Date;                // Creation timestamp
}

interface OrderItem {
  product: string;    // Product ID reference
  name: string;       // Product name
  qty: number;        // Quantity ordered
  price: number;      // Unit price
}

type PaymentMethod = 'bank_transfer' | 'mobile_money' | 'cash_on_delivery';
type OrderStatus = 'Pending' | 'Packed' | 'Out for Delivery' | 'Completed';
```

### Admin
```typescript
interface Admin {
  _id: string;        // MongoDB ObjectId
  username: string;   // Admin username
  passwordHash: string; // Hashed password
  createdAt: Date;    // Creation timestamp
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "ErrorType"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Invalid/Missing Token)
- `404` - Not Found
- `409` - Conflict (Duplicate Resource)
- `413` - Payload Too Large
- `500` - Internal Server Error

### Validation Error Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Window**: 15 minutes (900,000 ms)
- **Max Requests**: 100 requests per window
- **Headers**: Rate limit information included in response headers

## Admin Operations Guide

### Admin User Lifecycle

#### 1. **Creating Admin Users**
```bash
# Register new admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "product_manager",
    "password": "SecurePass2024!",
    "confirmPassword": "SecurePass2024!"
  }'
```

#### 2. **Admin Authentication**
```bash
# Login to get JWT token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "product_manager",
    "password": "SecurePass2024!"
  }'
```

#### 3. **Using JWT Token**
```bash
# Include token in all protected requests
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/products
```

### Admin Role Management

#### **Product Manager**
- ✅ Create, update, delete products
- ✅ Upload product images
- ✅ Manage inventory levels
- ❌ Cannot access order management
- ❌ Cannot export customer data

#### **Order Manager**
- ✅ View all orders
- ✅ Update order status
- ✅ Export order data to CSV
- ❌ Cannot modify products
- ❌ Cannot upload images

#### **Super Admin**
- ✅ Full access to all endpoints
- ✅ Manage other admin accounts
- ✅ System configuration
- ✅ All business operations

### Admin Security Checklist

- [ ] Use strong passwords (8+ characters, mixed case, numbers, symbols)
- [ ] Enable JWT token expiration (24 hours)
- [ ] Implement rate limiting on auth endpoints
- [ ] Log all admin actions for audit trail
- [ ] Regular password rotation
- [ ] Monitor failed login attempts
- [ ] Use HTTPS in production
- [ ] Implement IP whitelisting for admin access (optional)

## Examples

### Admin Registration Flow

1. **Create New Admin User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_admin",
    "password": "SecurePass2024!",
    "confirmPassword": "SecurePass2024!"
  }'
```

2. **Login with New Admin**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_admin",
    "password": "SecurePass2024!"
  }'
```

### Complete Product Creation Flow

1. **Login as Admin**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'
```

2. **Upload Product Image**
```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@product-image.jpg"
```

3. **Create Product**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spicy Plantain Chips",
    "slug": "spicy-plantain-chips",
    "description": "Delicious spicy plantain chips with a kick",
    "price": 15.99,
    "stock": 100,
    "images": ["https://res.cloudinary.com/djqfvpvsx/image/upload/v1/products/image123.jpg"]
  }'
```

### Complete Order Flow

1. **Create Order (Public)**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerPhone": "2348144665646",
    "address": "123 Main Street, Lagos, Nigeria",
    "items": [
      {
        "product": "507f1f77bcf86cd799439011",
        "name": "Spicy Plantain Chips",
        "qty": 2,
        "price": 15.99
      }
    ],
    "totalAmount": 31.98,
    "paymentMethod": "bank_transfer"
  }'
```

2. **Update Order Status (Admin)**
```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Packed"
  }'
```

## Testing

### Using Swagger UI
1. **Start the server**: `npm run dev`
2. **Open Swagger UI**: Navigate to `/api-docs` (if configured)
3. **Test endpoints**: Use the interactive interface

### Admin Endpoint Testing

#### **Registration Testing**
```bash
# Test valid registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testadmin",
    "password": "testpass123",
    "confirmPassword": "testpass123"
  }'

# Test password mismatch (should return 400)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testadmin2",
    "password": "testpass123",
    "confirmPassword": "differentpass"
  }'

# Test duplicate username (should return 409)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testadmin",
    "password": "anotherpass",
    "confirmPassword": "anotherpass"
  }'
```

#### **Authentication Testing**
```bash
# Test valid login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testadmin",
    "password": "testpass123"
  }'

# Test invalid credentials (should return 401)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testadmin",
    "password": "wrongpassword"
  }'
```

#### **Protected Endpoint Testing**
```bash
# Test without token (should return 401)
curl http://localhost:5000/api/products

# Test with valid token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/products
```

### Using Postman/Insomnia
1. **Import OpenAPI spec**: Use the `openapi.yaml` file
2. **Set base URL**: Configure environment variables
3. **Test endpoints**: Use the imported collection

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

## Deployment

### Environment Variables
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secure_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_email@domain.com
WHATSAPP_PHONE=your_whatsapp_number
CLIENT_ORIGIN=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker-compose up -d
```

## Quick Reference

### Admin Endpoints Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | ❌ | Create new admin user |
| `/api/auth/login` | POST | ❌ | Admin authentication |
| `/api/products` | POST | ✅ | Create product |
| `/api/products/:id` | PUT | ✅ | Update product |
| `/api/products/:id` | DELETE | ✅ | Delete product |
| `/api/orders` | GET | ✅ | List all orders |
| `/api/orders/:id` | PUT | ✅ | Update order status |
| `/api/orders/export/csv` | GET | ✅ | Export orders to CSV |
| `/api/upload` | POST | ✅ | Upload product images |

### Common HTTP Status Codes

| Code | Meaning | Common Use |
|------|---------|------------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Validation errors, missing fields |
| 401 | Unauthorized | Missing or invalid JWT token |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate username, slug conflict |
| 500 | Internal Server Error | Server-side errors |

### Environment Variables Checklist

- [ ] `MONGODB_URI` - Database connection string
- [ ] `JWT_SECRET` - Secret for JWT token signing
- [ ] `SENDGRID_API_KEY` - Email service API key
- [ ] `WHATSAPP_PHONE` - Business WhatsApp number
- [ ] `CLOUDINARY_*` - Image upload service credentials
- [ ] `CLIENT_ORIGIN` - Frontend application URL
- [ ] `RATE_LIMIT_*` - Rate limiting configuration

## Support

For API support and questions:
- **Email**: adunnifoods8@gmail.com
- **WhatsApp**: +2348144665646

## License

This API is licensed under the MIT License.
