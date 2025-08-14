# Adunni Foods Backend API

A production-ready REST API for Adunni Foods plantain chips business, built with TypeScript, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
# MONGODB_URI, JWT_SECRET, SENDGRID_API_KEY, etc.

# Seed the database
npm run seed

# Start development server
npm run dev
```

## 📋 Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

## 🌍 Environment Variables

Create a `.env` file with these variables:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/adunni_foods

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# SendGrid Email Service
SENDGRID_API_KEY=your-sendgrid-api-key-here
SENDGRID_FROM_EMAIL=noreply@adunnifoods.com

# WhatsApp Configuration
WHATSAPP_PHONE=2348012345678

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CLIENT_ORIGIN=http://localhost:3001

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)
1. Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Add to `MONGODB_URI` in `.env`

### Option 2: Local MongoDB with Docker
```bash
docker-compose up -d mongo
```

### Seed Database
```bash
npm run seed
```
Creates:
- Admin user: `admin` / `admin1234`
- Sample product

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Test Coverage
```bash
npm run test:coverage
```

## 🐳 Docker

### Development
```bash
# Start MongoDB only
docker-compose up -d mongo

# Start full stack (app + mongo)
docker-compose up
```

### Production Build
```bash
# Build image
docker build -t adunni-foods-backend .

# Run container
docker run -p 3000:3000 --env-file .env adunni-foods-backend
```

## 📚 API Documentation

### OpenAPI Spec
View the full API specification in `openapi.yaml`

### Core Endpoints

#### Authentication
- `POST /api/auth/login` - Admin login

#### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

#### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - List orders (admin only)
- `GET /api/orders/:id` - Get order by ID (admin only)
- `PUT /api/orders/:id` - Update order status (admin only)
- `GET /api/orders/export/csv` - Export orders as CSV (admin only)

#### Upload
- `POST /api/upload` - Upload image to Cloudinary (admin only)

## 🔐 Authentication

### Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin1234"}'
```

### Using JWT Token
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/products
```

## 📱 WhatsApp Checkout Flow

1. Customer creates order via `POST /api/orders`
2. API creates order in database
3. Admin receives email notification
4. API returns `wa.me` URL for WhatsApp checkout
5. Frontend opens WhatsApp chat with order details

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
1. Build production image: `docker build -t adunni-foods-backend .`
2. Push to container registry
3. Deploy to your hosting platform

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Set production JWT_SECRET
- Configure production CORS origins

## 🛠️ Development

### Project Structure
```
src/
├── config/          # Configuration and environment
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API route definitions
├── schemas/         # Zod validation schemas
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── scripts/         # Database seeding and utilities
```

### Adding New Features
1. Create model in `src/models/`
2. Add validation schema in `src/schemas/`
3. Implement business logic in `src/services/`
4. Create controller in `src/controllers/`
5. Add routes in `src/routes/`
6. Write tests in `tests/`

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB is running
- Check network/firewall settings

**Port Already in Use**
- Change `PORT` in `.env`
- Kill process using the port: `lsof -ti:3000 | xargs kill`

**Module Not Found**
- Run `npm install` again
- Check if `node_modules` exists
- Clear npm cache: `npm cache clean --force`

**JWT Authentication Fails**
- Verify `JWT_SECRET` is set in `.env`
- Check token expiration (1 hour default)
- Ensure token is sent as `Bearer` in Authorization header

## 📞 Support

For issues or questions:
1. Check this README
2. Review the OpenAPI specification
3. Check test files for usage examples
4. Review the database schema documentation

## 📄 License

This project is proprietary to Adunni Foods.

