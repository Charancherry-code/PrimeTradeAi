# 🚀 PrimeTrade.ai - Backend Developer Intern Assignment

**Complete REST API with JWT Authentication, Role-Based Access Control & Interactive Frontend**

> ✅ All assignment requirements fulfilled | ✅ Production-ready code | ✅ Fully documented & tested

---

## 📋 Executive Summary

This submission delivers a **secure, scalable REST API** with complete authentication and authorization systems, paired with a functional frontend dashboard for testing. Built with industry best practices and designed for real-world deployment.

### ✨ Key Highlights

| Feature | Implementation |
|---------|----------------|
| 🔐 **Authentication** | JWT with secure HttpOnly cookies, bcrypt password hashing |
| 👮 **RBAC** | Role-based access (Admin sees all, User sees own) |
| 📝 **CRUD API** | Full Task management with validation |
| 🛡️ **Security** | Helmet, CORS, rate limiting, input sanitization |
| 📚 **Documentation** | Swagger UI + Postman collection included |
| 🧪 **Testing** | Automated test suite with 5+ test cases |
| 🎨 **Frontend** | Responsive UI with real-time API integration |

---

## 🏗️ Architecture & Tech Stack

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ODM
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** Zod schema validation
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize
- **Testing:** Node.js native test runner

### Frontend
- **Stack:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Features:** Token persistence, real-time logs, responsive design

---

## 📁 Project Structure

```
primetrade.ai/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection & Swagger setup
│   │   ├── controllers/   # Business logic (auth, tasks)
│   │   ├── middlewares/   # Auth, validation, error handling, sanitization
│   │   ├── models/          # Mongoose schemas (User, Task)
│   │   ├── routes/v1/      # Versioned API routes
│   │   ├── validators/      # Zod validation schemas
│   │   ├── seed.js          # Test data seeding
│   │   └── server.js        # Application entry point
│   ├── docs/               # API documentation
│   │   ├── swagger.yaml     # OpenAPI spec
│   │   └── postman_collection.json
│   ├── test/               # Automated tests
│   ├── .env.example        # Environment template
│   └── package.json
├── frontend/
│   ├── index.html          # Dashboard UI
│   ├── script.js           # API integration & logic
│   └── styles.css          # Styling
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- MongoDB (local or Atlas)

### 1️⃣ Backend Setup

```bash
cd backend
npm install
copy .env.example .env      # Windows
# OR
cp .env.example .env         # Mac/Linux
```

**Configure `.env`:**
```env
MONGO_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=1h
FRONTEND_ORIGIN=http://127.0.0.1:5500
NODE_ENV=development
PORT=5000
```

**Start the server:**
```bash
npm run dev
```

**Seed test data (optional):**
```bash
npm run seed
```

### 2️⃣ Frontend Setup

```bash
cd frontend
python -m http.server 5500
```

**Open:** `http://127.0.0.1:5500`

---

## 🔗 API Endpoints

### Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new user (role: user) |
| POST | `/auth/login` | ❌ | Login, returns JWT |
| GET | `/auth/me` | ✅ | Get current user profile |
| POST | `/tasks` | ✅ | Create new task |
| GET | `/tasks` | ✅ | List tasks (RBAC scoped) |
| GET | `/tasks/:id` | ✅ | Get single task |
| PATCH | `/tasks/:id` | ✅ | Update task |
| DELETE | `/tasks/:id` | ✅ | Delete task |

**Documentation URLs:**
- Swagger UI: `http://localhost:5000/api-docs`
- Health Check: `http://localhost:5000/health`

---

## 👥 Role-Based Access Control (RBAC)

### How It Works

| Role | Permissions |
|------|-------------|
| **User** | CRUD on **own tasks only** |
| **Admin** | CRUD on **all tasks** |

### Test Accounts

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| 🔴 Admin | `admin@primetrade.ai` | `AdminPass123` |
| 🔵 User | `user@primetrade.ai` | `UserPass123` |

**Verify RBAC:**
1. Login as **User** → Create tasks → Only sees own tasks
2. Login as **Admin** → Sees ALL tasks including user's

---

## 🛡️ Security Implementation

### Authentication & Authorization
- ✅ **Password Hashing:** bcryptjs with salt rounds 10
- ✅ **JWT Tokens:** Signed, with configurable expiry
- ✅ **HttpOnly Cookies:** Prevents XSS token theft
- ✅ **Bearer Token Support:** For API/mobile clients

### Input Protection
- ✅ **Schema Validation:** Zod for request body validation
- ✅ **NoSQL Injection Prevention:** express-mongo-sanitize
- ✅ **XSS Protection:** Input sanitization on all text fields
- ✅ **Secure Headers:** Helmet.js enabled

### API Protection
- ✅ **Rate Limiting:** 200 requests per 15 minutes
- ✅ **CORS:** Configurable origin whitelist
- ✅ **Error Handling:** No stack traces leaked in production

---

## 🧪 Test Suite

```bash
cd backend
npm test
```

### Test Coverage

- ✅ Health endpoint returns 200
- ✅ Registration validates password strength (8+ chars, uppercase, lowercase, number)
- ✅ Login rejects invalid credentials
- ✅ Protected routes require valid JWT
- ✅ Authenticated users can CRUD their own tasks
- ✅ Users cannot access other users' tasks
- ✅ Task ownership enforced at database level

---

## 📊 Scalability & Production Readiness

### Current Architecture
- **Versioned APIs:** `/api/v1` supports future evolution
- **Modular Structure:** Feature-based folder organization
- **Stateless Auth:** JWT enables horizontal scaling
- **Environment Config:** All secrets externalized to `.env`

### Production Scaling Roadmap

1. **Caching Layer:** Redis for session blacklisting & frequent queries
2. **Message Queue:** BullMQ for async jobs (emails, notifications)
3. **Monitoring:** Winston + ELK stack for centralized logging
4. **Containerization:** Docker + Docker Compose
5. **Orchestration:** Kubernetes for auto-scaling
6. **CDN:** CloudFront for static asset delivery

---

## 🎯 Assignment Requirements Checklist

### Backend (Primary Focus)
- ✅ User registration & login APIs with password hashing
- ✅ JWT authentication with secure token handling
- ✅ Role-based access (user vs admin)
- ✅ CRUD APIs for Task entity
- ✅ API versioning (`/api/v1`)
- ✅ Error handling with proper HTTP status codes
- ✅ Input validation (Zod schemas)
- ✅ API documentation (Swagger + Postman)
- ✅ Database schema design (MongoDB + Mongoose)

### Frontend (Supportive)
- ✅ Built with Vanilla JS (no frameworks required)
- ✅ Register & login forms
- ✅ Protected dashboard (JWT required)
- ✅ CRUD operations on tasks
- ✅ Error/success message display

### Security & Scalability
- ✅ Secure JWT handling (HttpOnly cookies)
- ✅ Input sanitization & validation
- ✅ Rate limiting
- ✅ Scalable project structure
- ✅ Environment-based configuration

### Deliverables
- ✅ GitHub-ready project with README
- ✅ Working APIs for auth & CRUD
- ✅ Functional frontend UI
- ✅ API documentation (Swagger + Postman)
- ✅ Scalability notes included

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/primetrade` |
| `JWT_SECRET` | Secret key for JWT signing | `super_secret_random_string` |
| `JWT_EXPIRES_IN` | Token expiry duration | `1h`, `24h`, `7d` |
| `FRONTEND_ORIGIN` | Allowed CORS origin | `http://127.0.0.1:5500` |
| `NODE_ENV` | Environment mode | `development`, `production` |
| `PORT` | Server port | `5000` |

---

## 🤝 Submission Information

**Submitted by:** Banoth Charan 
**Assignment:** PrimeTrade.ai Backend Developer Intern  
**Date:** April 2026  
**GitHub Repository:** [Link to repo]  


## 🚀 Deployment Guide

### Option 1: Free Cloud Deployment (Recommended)

#### Backend → Railway (Free)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
cd backend
railway login
railway init
railway up
```

**Environment Variables (Railway Dashboard):**
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/primetrade
JWT_SECRET=your_random_secret_key
JWT_EXPIRES_IN=1h
FRONTEND_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5000
```

#### Frontend → Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

**Update API_BASE in `frontend/script.js`:**
```javascript
const API_BASE = "https://your-railway-app.up.railway.app/api/v1";
```

---

### Option 2: Docker Deployment (Production)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

Services:
- **Backend:** `http://localhost:5000`
- **MongoDB:** `localhost:27017`

---

### Option 3: VPS/EC2 Deployment

```bash
# On your server
git clone <your-repo>
cd primetrade.ai/backend
npm install
npm start
```

Use **PM2** for process management:
```bash
npm install -g pm2
pm2 start src/server.js --name primetrade-api
```

---

## 📊 Live Demo URLs (After Deployment)

| Service | URL | Status |
|---------|-----|--------|
| API | `https://primetradeai-production-b634.up.railway.app` | |
| Frontend | `https://prime-trade-ai-seven.vercel.app` | |
| Swagger Docs | `https://primetradeai-production-b634.up.railway.app/api-docs` | |

### Test Accounts
- **Admin:** `admin@primetrade.ai` / `AdminPass123`
- **User:** `user@primetrade.ai` / `UserPass123`

**Thank you for reviewing my submission! 🚀**
