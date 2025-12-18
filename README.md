# Adunni Foods - Full Stack Application

This repository contains both the frontend (Next.js PWA) and the backend (Node.js API) for Adunni Foods.

## 🏗️ Project Structure

- `adunni-foods-pwa/`: Frontend application built with Next.js, Tailwind CSS, and Shadcn UI.
- `backend/`: Backend API built with Express, TypeScript, and MongoDB.

## 🚀 Deployment Links

- **Frontend**: [https://adunnifoods.vercel.app](https://adunnifoods.vercel.app)
- **Backend**: [https://adunni-foods.onrender.com](https://adunni-foods.onrender.com)

---

## 🛠️ Environment Configuration Guide

To ensure both local development and production environments work perfectly, follow these configuration steps:

### 1. Backend Configuration (Render)

In your Render dashboard for the `adunni-foods` service, set these environment variables:

| Variable | Recommended Production Value | Description |
|----------|---------------------------|-------------|
| `NODE_ENV` | `production` | Set to production mode |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your_secure_random_string` | Secret for authentication tokens |
| `CLIENT_ORIGIN` | `https://adunnifoods.vercel.app` | Allow your frontend to access the API |
| `WHATSAPP_PHONE` | `234...` | Default business phone for notifications |
| `SENDGRID_API_KEY` | `SG....` | For order confirmation emails |

### 2. Frontend Configuration (Vercel)

In your Vercel dashboard for the `adunnifoods` project, set this environment variable:

| Variable | Recommended Production Value | Description |
|----------|---------------------------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://adunni-foods.onrender.com/api` | **Must include /api at the end** |

---

## 💻 Local Development Setup

### Backend
```bash
cd backend
npm install
npm run dev
```
*Runs on [http://localhost:5000](http://localhost:5000)*

### Frontend
```bash
cd adunni-foods-pwa
pnpm install
pnpm dev
```
*Runs on [http://localhost:3000](http://localhost:3000)*

---

## ✅ Compatibility Checklist

1. **CORS**: The backend is configured to explicitly allow `https://adunnifoods.vercel.app`.
2. **API Base URL**: The frontend dynamically switches between `localhost:5000` (local) and the Render URL (production) based on the `NEXT_PUBLIC_API_URL` variable.
3. **Health Checks**: Visit `https://adunni-foods.onrender.com/health` to verify the backend is live.
4. **Documentation**: Visit `https://adunni-foods.onrender.com/api-docs` for the interactive API reference.
