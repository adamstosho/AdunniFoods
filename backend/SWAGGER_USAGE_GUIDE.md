# 🚀 Swagger UI Usage Guide for Adunni Foods API

## What is Swagger UI?

Swagger UI is an interactive web interface that allows you to:
- **View all your API endpoints** in a beautiful, organized way
- **Test endpoints directly** from the browser
- **See request/response schemas** and examples
- **Understand authentication requirements** for each endpoint
- **Try out different parameters** and see responses in real-time

## 🎯 How to Access Swagger UI

1. **Start your server**: `npm run dev`
2. **Open your browser** and go to: `http://localhost:5000/api-docs`
3. **You'll see a beautiful, interactive API documentation interface!**

## 📱 Swagger UI Features

### 🔍 **Endpoint Organization**
- **Authentication**: Login endpoints
- **Products**: Product management endpoints
- **Orders**: Order processing endpoints
- **Uploads**: File upload endpoints
- **Admin**: Admin-only operations

### 🧪 **Testing Capabilities**
- **Try It Out**: Click the "Try it out" button for any endpoint
- **Parameter Input**: Fill in required fields with test data
- **Execute**: Click "Execute" to make real API calls
- **Response Viewing**: See actual responses, status codes, and headers

## 🎯 **How to Test Each Endpoint Type**

### 1. **Public Endpoints (No Authentication Required)**

#### Health Check
- **Endpoint**: `GET /api/`
- **Click**: "Try it out" → "Execute"
- **Expected**: Status 200, Response: `{"message":"Adunni Foods API"}`

#### Products List
- **Endpoint**: `GET /api/products`
- **Click**: "Try it out" → "Execute"
- **Expected**: Status 200, Response: `{"message":"ok","response":[]}`

#### Create Order
- **Endpoint**: `POST /api/orders`
- **Click**: "Try it out"
- **Fill in the request body**:
```json
{
  "customerName": "Test Customer",
  "customerPhone": "2348144665646",
  "address": "123 Test Street, Lagos",
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "name": "Test Plantain Chips",
      "qty": 2,
      "price": 15.99
    }
  ],
  "totalAmount": 31.98,
  "paymentMethod": "cash_on_delivery"
}
```
- **Click**: "Execute"
- **Expected**: Status 201, Order created with WhatsApp URL

### 2. **Protected Endpoints (Authentication Required)**

#### Admin Registration
- **Endpoint**: `POST /api/auth/register`
- **Click**: "Try it out"
- **Fill in registration data**:
```json
{
  "username": "newadmin",
  "password": "securepassword123",
  "confirmPassword": "securepassword123"
}
```
- **Click**: "Execute"
- **Expected**: Status 201, Admin user created successfully

#### Admin Login
- **Endpoint**: `POST /api/auth/login`
- **Click**: "Try it out"
- **Fill in credentials**:
```json
{
  "username": "admin",
  "password": "your_password"
}
```
- **Click**: "Execute"
- **Expected**: Status 200, JWT token returned

#### Products Create (Admin Only)
- **Endpoint**: `POST /api/products`
- **Click**: "Try it out"
- **Add Authorization**: Click the "Authorize" button at the top
- **Enter**: `Bearer YOUR_JWT_TOKEN` (from login)
- **Fill in product data**:
```json
{
  "name": "Spicy Plantain Chips",
  "slug": "spicy-plantain-chips",
  "description": "Delicious spicy plantain chips",
  "price": 19.99,
  "stock": 100
}
```
- **Click**: "Execute"
- **Expected**: Status 201, Product created

#### Orders List (Admin Only)
- **Endpoint**: `GET /api/orders`
- **Click**: "Try it out"
- **Ensure Authorization**: Use the same JWT token
- **Click**: "Execute"
- **Expected**: Status 200, List of orders

#### File Upload (Admin Only)
- **Endpoint**: `POST /api/upload`
- **Click**: "Try it out"
- **Ensure Authorization**: Use JWT token
- **Upload File**: Choose an image file
- **Click**: "Execute"
- **Expected**: Status 200, Image uploaded to Cloudinary

#### CSV Export (Admin Only)
- **Endpoint**: `GET /api/orders/export/csv`
- **Click**: "Try it out"
- **Ensure Authorization**: Use JWT token
- **Click**: "Execute"
- **Expected**: Status 200, CSV file download

## 🔐 **Authentication Setup**

### Step 1: Get JWT Token
1. **Test the login endpoint** with valid credentials
2. **Copy the JWT token** from the response
3. **Click the "Authorize" button** at the top of Swagger UI
4. **Enter**: `Bearer YOUR_JWT_TOKEN`
5. **Click "Authorize"**

### Step 2: Test Protected Endpoints
- **All protected endpoints** will now automatically include your token
- **You can test them** without manually adding headers each time

## 📊 **Testing Scenarios**

### **Happy Path Testing**
- Test with valid data
- Verify correct status codes (200, 201)
- Check response formats

### **Error Testing**
- Test with invalid data
- Verify error status codes (400, 401, 404, 500)
- Check error message formats

### **Authentication Testing**
- Test protected endpoints without token (should get 401)
- Test with invalid token (should get 401)
- Test with valid token (should work)

## 🎨 **Swagger UI Customization**

Your Swagger UI is configured with:
- **Custom title**: "Adunni Foods API Documentation"
- **Expanded view**: All endpoints visible by default
- **Filtering**: Search through endpoints easily
- **Try it out enabled**: All endpoints are testable
- **Request headers visible**: See all headers in requests

## 🚨 **Troubleshooting**

### **Server Not Starting**
- Check if MongoDB is running
- Verify all dependencies are installed
- Check console for error messages

### **Swagger UI Not Loading**
- Ensure server is running on port 5000
- Check if `/api-docs` route is accessible
- Verify `openapi.yaml` file exists

### **Authentication Issues**
- Ensure JWT token is valid
- Check token expiration
- Verify token format: `Bearer TOKEN`

## 🎉 **Benefits of Using Swagger UI**

1. **Interactive Testing**: Test endpoints without Postman/curl
2. **Documentation**: Always up-to-date API documentation
3. **Schema Validation**: See exact request/response formats
4. **Team Collaboration**: Share API docs with frontend developers
5. **Development Speed**: Faster API testing and debugging

## 🔗 **Quick Links**

- **Swagger UI**: `http://localhost:5000/api-docs`
- **OpenAPI Spec**: `http://localhost:5000/openapi.yaml`
- **API Base**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/health`

---

**Happy Testing! 🚀**

Your Adunni Foods API is now fully documented and testable through Swagger UI!
