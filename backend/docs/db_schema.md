# Database Schema Documentation

This document describes the database models and schema for the Adunni Foods backend API.

## Overview

The application uses MongoDB with Mongoose ODM. All models include automatic timestamps (`createdAt` and `updatedAt`).

## Models

### 1. Admin Model

**File:** `src/models/Admin.ts`

**Purpose:** Store admin user credentials for authentication

**Schema:**
```typescript
{
  username: string (required, unique)
  passwordHash: string (required, bcrypt hashed)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

**Fields:**
- `username`: Admin username for login (unique)
- `passwordHash`: Bcrypt-hashed password for security
- `createdAt`: Timestamp when admin was created
- `updatedAt`: Timestamp when admin was last updated

**Usage:**
```typescript
// Create admin
const admin = new Admin({
  username: 'admin',
  passwordHash: await bcrypt.hash('password123', 10)
});

// Find admin by username
const admin = await Admin.findOne({ username: 'admin' });

// Verify password
const isValid = await bcrypt.compare('password123', admin.passwordHash);
```

**Indexes:**
- `username`: Unique index for fast login lookups

---

### 2. Product Model

**File:** `src/models/Product.ts`

**Purpose:** Store product information for the plantain chips catalog

**Schema:**
```typescript
{
  name: string (required)
  slug: string (required, unique)
  description: string (required)
  price: number (required, positive)
  images: string[] (array of Cloudinary URLs)
  stock: number (required, non-negative)
  isActive: boolean (default: true)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

**Fields:**
- `name`: Product name (e.g., "Original Plantain Chips")
- `slug`: URL-friendly identifier (e.g., "original-plantain-chips")
- `description`: Product description and details
- `price`: Price in Nigerian Naira (positive number)
- `images`: Array of image URLs from Cloudinary
- `stock`: Available quantity (non-negative integer)
- `isActive`: Whether product is available for purchase
- `createdAt`: Timestamp when product was created
- `updatedAt`: Timestamp when product was last updated

**Usage:**
```typescript
// Create product
const product = new Product({
  name: 'Original Plantain Chips',
  slug: 'original-plantain-chips',
  description: 'Crispy, authentic plantain chips',
  price: 500,
  images: ['https://res.cloudinary.com/...'],
  stock: 100
});

// Find active products
const products = await Product.find({ isActive: true });

// Find by slug
const product = await Product.findOne({ slug: 'original-plantain-chips' });

// Update stock
await Product.findByIdAndUpdate(id, { $inc: { stock: -quantity } });
```

**Indexes:**
- `slug`: Unique index for URL routing
- `isActive`: Index for filtering active products
- `price`: Index for sorting and filtering

---

### 3. Order Model

**File:** `src/models/Order.ts`

**Purpose:** Store customer orders and track their status

**Schema:**
```typescript
{
  customerName: string (required)
  customerPhone: string (required)
  address: string (required)
  items: OrderItem[] (required, non-empty)
  totalAmount: number (required, positive)
  paymentMethod: string (required)
  status: string (required, enum: ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'])
  notes: string (optional)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

**OrderItem Schema:**
```typescript
{
  product: ObjectId (ref: 'Product')
  name: string (product name at time of order)
  quantity: number (positive integer)
  price: number (price at time of order)
  total: number (quantity * price)
}
```

**Fields:**
- `customerName`: Full name of the customer
- `customerPhone`: Phone number for delivery contact
- `address`: Delivery address
- `items`: Array of ordered products with quantities and prices
- `totalAmount`: Total order value (sum of all item totals)
- `paymentMethod`: Payment method (e.g., "Bank Transfer", "Mobile Money")
- `status`: Current order status
- `notes`: Additional customer or admin notes
- `createdAt`: Timestamp when order was created
- `updatedAt`: Timestamp when order was last updated

**Status Values:**
- `pending`: Order received, awaiting confirmation
- `confirmed`: Order confirmed by admin
- `packed`: Order packed and ready for delivery
- `out_for_delivery`: Order is being delivered
- `delivered`: Order successfully delivered
- `cancelled`: Order cancelled

**Usage:**
```typescript
// Create order
const order = new Order({
  customerName: 'John Doe',
  customerPhone: '+2348012345678',
  address: '123 Main St, Lagos',
  items: [{
    product: productId,
    name: 'Original Plantain Chips',
    quantity: 2,
    price: 500,
    total: 1000
  }],
  totalAmount: 1000,
  paymentMethod: 'Bank Transfer',
  status: 'pending'
});

// Find orders by status
const pendingOrders = await Order.find({ status: 'pending' });

// Update order status
await Order.findByIdAndUpdate(id, { status: 'confirmed' });

// Find orders by customer
const customerOrders = await Order.find({ customerPhone: '+2348012345678' });
```

**Indexes:**
- `status`: Index for filtering orders by status
- `customerPhone`: Index for finding customer orders
- `createdAt`: Index for sorting orders by date

---

## Database Relationships

### One-to-Many: Product → Order Items
- Each product can be in multiple orders
- Order items reference products by ObjectId
- Product names and prices are stored in orders for historical accuracy

### No Direct References
- Orders don't directly reference products to avoid cascading deletes
- Product information is denormalized in order items
- This allows products to be deleted without affecting order history

## Data Validation

### Mongoose Validation
- Required fields are enforced at the database level
- String lengths and number ranges are validated
- Enum values are restricted to predefined options

### Application-Level Validation
- Zod schemas validate input before database operations
- Business logic ensures data consistency
- Custom validators check complex business rules

## Data Integrity

### Constraints
- Unique constraints on `Admin.username` and `Product.slug`
- Required fields prevent null/undefined values
- Enum constraints ensure valid status values

### Referential Integrity
- Product references in orders are validated before saving
- Soft deletes for products (isActive flag) preserve order history
- Cascade updates are handled in application logic

## Performance Considerations

### Indexes
- Primary indexes on `_id` (automatic)
- Unique indexes on business keys
- Compound indexes for common query patterns

### Query Optimization
- Use projection to limit returned fields
- Implement pagination for large result sets
- Use aggregation for complex calculations

### Data Size
- Images are stored as URLs, not binary data
- Text fields have reasonable length limits
- Arrays are kept small for performance

## Backup and Recovery

### MongoDB Atlas
- Automatic daily backups
- Point-in-time recovery
- Geographic distribution

### Local Development
- Use `mongodump` for manual backups
- Export/import with `mongoexport`/`mongoimport`
- Docker volumes for persistent data

## Migration Strategy

### Schema Changes
- Add new fields with default values
- Use Mongoose middleware for data transformations
- Version models for backward compatibility

### Data Migration
- Write migration scripts for bulk updates
- Test migrations on staging data
- Use transactions for atomic operations

## Security Considerations

### Data Protection
- Passwords are hashed with bcrypt
- Sensitive data is not logged
- Input validation prevents injection attacks

### Access Control
- Admin authentication required for sensitive operations
- JWT tokens expire after 1 hour
- Rate limiting prevents abuse

## Monitoring and Maintenance

### Health Checks
- Database connection status
- Query performance metrics
- Index usage statistics

### Maintenance Tasks
- Regular index optimization
- Data archival for old orders
- Performance monitoring and tuning

