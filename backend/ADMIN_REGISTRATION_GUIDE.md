# 👑 Admin Registration Guide for Adunni Foods API

## 🎯 Overview

Your Adunni Foods API now supports **admin user registration**! This allows you to create multiple admin accounts for managing products, orders, and other administrative tasks.

## 🚀 How to Register an Admin User

### **Method 1: Using Swagger UI (Recommended)**

1. **Open Swagger UI**: Go to `http://localhost:5000/api-docs`
2. **Find the Authentication section**
3. **Click on `POST /api/auth/register`**
4. **Click "Try it out"**
5. **Fill in the registration form**:
   ```json
   {
     "username": "your_admin_username",
     "password": "your_secure_password",
     "confirmPassword": "your_secure_password"
   }
   ```
6. **Click "Execute"**
7. **You should get a 201 response** confirming the admin was created

### **Method 2: Using PowerShell Script**

1. **Run the test script**: `.\test_registration.ps1`
2. **This will test various scenarios** and show you the results
3. **Use the successful registration data** for your actual admin account

### **Method 3: Using API Testing Tools (Postman, Insomnia, etc.)**

- **URL**: `POST http://localhost:5000/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**: JSON with username, password, and confirmPassword

## 📋 Registration Requirements

### **Username Requirements:**
- ✅ **Minimum length**: 3 characters
- ✅ **Maximum length**: 30 characters
- ✅ **Allowed characters**: Letters (a-z, A-Z), numbers (0-9), underscores (_)
- ❌ **Not allowed**: Hyphens (-), spaces, special characters
- ✅ **Must be unique**: No duplicate usernames allowed

### **Password Requirements:**
- ✅ **Minimum length**: 8 characters
- ✅ **Must match confirmPassword**: Both fields must be identical
- 🔒 **Security**: Passwords are automatically hashed using bcrypt

### **Example Valid Registrations:**
```json
{
  "username": "admin1",
  "password": "securepass123",
  "confirmPassword": "securepass123"
}
```

```json
{
  "username": "super_admin",
  "password": "very_secure_password_2024",
  "confirmPassword": "very_secure_password_2024"
}
```

## 🔐 After Registration: Login

Once you've successfully registered an admin user:

1. **Go to the login endpoint**: `POST /api/auth/login`
2. **Use your new credentials**:
   ```json
   {
     "username": "your_admin_username",
     "password": "your_secure_password"
   }
   ```
3. **You'll receive a JWT token** for authentication
4. **Use this token** to access protected endpoints

## 🧪 Testing Your Registration

### **Test Script Available**
Run `.\test_registration.ps1` to test:
- ✅ Valid registration
- ❌ Password mismatch
- ❌ Duplicate username
- ❌ Invalid username format

### **Manual Testing in Swagger UI**
1. **Test registration** with valid data
2. **Test login** with the same credentials
3. **Test protected endpoints** using the JWT token

## 🚨 Common Registration Errors

### **400 Bad Request - Validation Errors:**
- **Username too short**: Must be at least 3 characters
- **Username too long**: Must be 30 characters or less
- **Invalid username format**: Only letters, numbers, underscores allowed
- **Password too short**: Must be at least 8 characters
- **Password mismatch**: confirmPassword doesn't match password

### **409 Conflict - Username Already Exists:**
- **Solution**: Choose a different username
- **Check existing usernames** in your database

### **500 Internal Server Error:**
- **Check server logs** for detailed error information
- **Verify MongoDB connection** is working
- **Ensure all dependencies** are properly installed

## 🔧 Database Management

### **View Existing Admins:**
You can check your MongoDB database to see all registered admin users:

```javascript
// In MongoDB shell or MongoDB Compass
use adunni_foods
db.admins.find({}, {username: 1, createdAt: 1})
```

### **Remove Admin Users:**
```javascript
// Remove by username
db.admins.deleteOne({username: "unwanted_admin"})

// Remove by ID
db.admins.deleteOne({_id: ObjectId("admin_id_here")})
```

## 🎯 Best Practices

### **Username Selection:**
- ✅ Use descriptive names: `product_manager`, `order_admin`
- ✅ Keep it professional: `john_admin`, `sales_manager`
- ❌ Avoid generic names: `admin`, `user`, `test`

### **Password Security:**
- ✅ Use strong passwords: `SecurePass2024!`
- ✅ Include numbers and special characters
- ✅ Make it memorable but secure
- ❌ Avoid common passwords: `password123`, `admin123`

### **Account Management:**
- 🔒 **Keep credentials secure** - don't share admin accounts
- 📝 **Document admin accounts** for team reference
- 🗑️ **Remove unused accounts** to maintain security
- 🔄 **Regular password updates** for security

## 🚀 Quick Start Commands

### **Start the Server:**
```bash
cd backend
npm run dev
```

### **Test Registration:**
```bash
# PowerShell
.\test_registration.ps1

# Or test manually in Swagger UI
# http://localhost:5000/api-docs
```

### **Seed Initial Admin (if needed):**
```bash
npm run seed
# This creates admin/admin1234
```

## 🔗 Related Endpoints

- **Registration**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- **Protected Endpoints**: All require JWT token from login
- **Swagger UI**: `http://localhost:5000/api-docs`

## 🎉 You're All Set!

Now you can:
1. ✅ **Register multiple admin users**
2. ✅ **Manage different admin roles** (by username convention)
3. ✅ **Secure your API** with proper authentication
4. ✅ **Test everything** through Swagger UI
5. ✅ **Scale your admin team** as needed

**Happy Admin Management! 👑🚀**
