# 💼 Multi-Level Referral and Earning System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-orange.svg)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-20+-blue.svg)](https://www.docker.com/)

A full-stack backend system designed to handle user registrations, multi-level referrals, earnings distribution, real-time socket updates, and JWT-based authentication.

---

## 🔗 Quick Links

| Resource | Link | Description |
|----------|------|-------------|
| 🌐 **Live Demo** | [Production App](https://referral-system-backend-d20j.onrender.com) | Deployed application |
| 📚 **API Docs** | [Postman Collection](https://documenter.getpostman.com/view/39575061/2sB2xBEVuz) | Complete API documentation |
| 🐙 **Repository** | [GitHub](https://github.com/Pritthish20/Referral-System-Backend.git) | Source code |
---

## 🚀 Features

### Core Features
- 💸 Multi-Level Referral System – Users can refer others and earn from both direct (Level 1) and indirect (Level 2) referrals.

- 🧠 Earnings Logic – Real-time distribution of profits: 5% from Level 1 and 1% from Level 2.

- 🔐 Secure Authentication – JWT-based access/refresh token flow with cookie security and role-based access.

- 📊 Referral Analytics – Users can view their full referral tree, referral stats, and detailed earnings history.

- 📡 Real-Time Notifications – Instant earning and referral updates using Socket.IO when users are online.

- 🕓 Offline Notifications – Notifications are saved in the DB when users are offline and can be fetched later.

- ✅ Referral Validation – Only active, unblocked users can refer, and a maximum of 8 direct referrals is enforced.

- ⚙️ Admin Control – Admins can view all users, manage statuses (block/unblock), and access global earnings reports.

- 🧩 Modular Design – Clear separation of concerns with reusable services for consistent feature implementation.

### Business Logic
- **Referral Limits:** Max 8 direct referrals per user
- **Commission Structure:** 5% (Level 1) + 1% (Level 2)
- **Real-time Updates:** Instant notifications for earnings
- **User Status Management:** Block/unblock functionality

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) |
| **Real-time** | Socket.IO |
| **Containerization** | Docker & Docker Compose |
| **Development** | Nodemon for auto-reload |

---

## 📁 Project Structure

```
backend/
├── configs/             # DB connection
├── controllers/         # API logic
├── middlewares/         # Auth & Error handling
├── models/              # Mongoose models
├── routes/              # API routes
├── services/            # Business logic
├── utils/               # Helper functions
├── app.js               # App configuration
├── main.js              # Entry point
├── Dockerfile           # Docker build
├── docker-compose.yml   # Docker services
└── package.json         # Dependencies
```

---

## 🛣️ API Routes

### 🔐 Authentication Routes (`/api/v1/auth`)
| Method | Endpoint | Description | Auth | Body Parameters |
|--------|----------|-------------|------|-----------------|
| `POST` | `/register` | Register new user | ❌ | `name, email, password, referralCode?` |
| `POST` | `/login` | User login | ❌ | `email, password` |
| `POST` | `/refresh-token` | Refresh access token | ❌ | Uses HTTP-only cookie |
| `POST` | `/logout` | User logout | ✅ | None |

### 👥 User Management (`/api/v1/user`)
| Method | Endpoint | Description | Auth | Response/Parameters |
|--------|----------|-------------|------|----------|
| `POST` | `/purchase` | Process purchase | ✅ | `amount, profit` |
| `GET` | `/referral-code` | Get user's referral code | ✅ | `{ referralCode: string }` |
| `GET` | `/referral-tree` | Get referral hierarchy | ✅ | `{ level1: [], level2: [] }` |
| `GET` | `/analytics` | Get user analytics | ✅ | `{ level1, level2, totalReferrals, earnings }` |
| `GET` | `/my-history` | Get user earning history | ✅ | `{ count, earnings: [] }` |


### 📊 Notification Management (`/api/v1/notification`)
| Method | Endpoint | Description | Auth | Response|
|--------|----------|-------------|------|------------------|
| `GET` | `/` | Get user notifications | ✅ | `notification: []` |
| `PUT` | `/mark` | Mark all notificaiton Read | ✅ | `message` |

### 🛠️ Admin Routes (`/api/admin`)
| Method | Endpoint | Description | Auth | Body Parameters/ Response |
|--------|----------|-------------|------|-----------------|
| `PATCH` | `/change-status` | Block/unblock user | ✅ | `userId, isActive, isBlocked` |
| `POST` | `/create` | Create admin user | ✅ | `name, email, password` |
| `GET` | `/earnings` | Get all earnings, paginated (admin) | ✅ | `earnings: {} , query: page=1 &limit=5` |
| `GET` | `/users` | Get all users | ✅ | `users: {}` |

---

## 🌐 Real-time Events (Socket.IO)

### Client Events
```javascript
// Listen for earnings updates
socket.on('earningsUpdate', (data) => {
  console.log('New earning:', data);
  // { amount, from, level, timestamp }
});

// Listen for referral updates
socket.on('newReferral', (data) => {
  console.log('New referral:', data);
  // { referralName, level }
});

```

### Server Events
```javascript
// Emit earnings update
io.to(userId).emit('earningsUpdate', {
  amount: 25.50,
  from: 'John Doe',
  level: 1,
  timestamp: new Date()
});
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Docker (optional but recommended)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/repo-name.git
cd repo-name/backend
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
```

### 3. Run with Docker (Recommended)
```bash
# Build and start all services
docker-compose up --build

# Application available at http://localhost:3000
```

### 4. Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/referral-system

# JWT Secrets (Use strong, unique values in production)
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# JWT Expiration
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Optional: For production deployments
CORS_ORIGIN=http://localhost:3000
```

---

## 🐳 Docker Setup

```bash
# Build and run
docker-compose up --build

# Available at http://localhost:3000
```

---

## 🚀 Deployment

### Deploy to Render
1. **Connect Repository:** Link your GitHub repo to Render
2. **Service Configuration:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend/`
3. **Environment Variables:** Add all variables from `.env` file
4. **Deploy:** Automatic deployment on git push



---

## 🔄 Development Workflow

### Adding New Routes
1. **Create Controller:** Add new controller in `/controllers/`
2. **Define Routes:** Add routes in `/routes/`
3. **Update Main Router:** Import and use new routes in `app.js`
4. **Test:** Add routes to Postman collection
5. **Document:** Update this README

### Adding New Features
1. **Database Model:** Create/update models in `/models/`
2. **Business Logic:** Add services in `/services/`
3. **API Endpoints:** Create controllers and routes
4. **Real-time Updates:** Add Socket.IO events if needed
5. **Testing:** Add test cases and update documentation

### Project Commands
```bash
# Development
npm run dev          # Start with nodemon
npm run debug        # Start with debug mode

# Utilities
npm run lint         # Run ESLint
```

---
<!-- 
## 🤝 Contributing

### How to Contribute
1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation when adding new routes/features
- Ensure all tests pass before submitting PR
 -->

---

## 📊 Project Status

- ✅ **Authentication System** - Complete
- ✅ **Referral Management** - Complete  
- ✅ **Earnings Distribution** - Complete
- ✅ **Real-time Notifications** - Complete
- ✅ **Admin Panel** - Complete
---

⭐ **If this project helped you, please consider giving it a star!**

---

