# Nexus — Investor & Entrepreneur Collaboration Platform

Nexus is a full-stack web platform that connects entrepreneurs with investors. It provides everything needed to manage the investment lifecycle — from discovery and communication to deal tracking, document sharing, meeting scheduling, and payments.

---

## Features

### For Entrepreneurs
- Profile with startup info (industry, funding needs, pitch summary, team size)
- Discover and connect with investors
- Real-time messaging with video call support
- Schedule and manage meetings
- Upload and sign documents (PDF, Word, Excel, images)
- Track investment deals initiated by investors
- Payments: deposit, withdraw, transfer
- Two-factor authentication

### For Investors
- Profile with investment preferences, stages, and portfolio
- Discover and connect with entrepreneurs
- Create and manage investment deals with status tracking
- Real-time messaging with video call support
- Schedule and manage meetings
- Secure document access
- Payments: deposit, withdraw, transfer between users
- Two-factor authentication

### Platform-wide
- Real-time notifications (meetings, messages, transfers, deals)
- WebRTC peer-to-peer video calling with ringtone
- Mobile-responsive with hamburger drawer navigation
- JWT authentication with 2FA mockup
- Swagger API documentation at `/api-docs`

---

## Tech Stack

### Client
| Technology | Purpose |
|---|---|
| React 18 + Vite + TypeScript | Frontend framework |
| React Router v6 | Client-side routing |
| TanStack Query | Server state management |
| Axios | HTTP client with JWT interceptor |
| Socket.IO Client | Real-time messaging and video signaling |
| Tailwind CSS | Styling |
| lucide-react | Icons |
| date-fns | Date formatting |
| react-big-calendar | Meeting calendar view |
| react-pdf | PDF preview |
| react-signature-canvas | E-signature |

### Server
| Technology | Purpose |
|---|---|
| Node.js + Express | Backend framework |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Authentication and password hashing |
| Socket.IO | Real-time events |
| Stripe (sandbox) | Payment processing |
| Multer | File uploads |
| express-mongo-sanitize | NoSQL injection prevention |
| express-rate-limit | Rate limiting |
| swagger-ui-express | API documentation |
| helmet + cors | Security headers |

---

## Project Structure

```text
Nexus/
├─ client/                  # React + Vite frontend
│  ├─ public/               # Static assets (logo, ringtone)
│  └─ src/
│     ├─ components/        # Reusable UI components
│     ├─ context/           # AuthContext, CallContext
│     ├─ hooks/             # TanStack Query hooks
│     ├─ lib/               # Axios instance, Socket.IO client
│     ├─ pages/             # Page components by feature
│     ├─ routes/            # RoleGuard
│     └─ types/             # TypeScript interfaces
└─ server/                  # Express backend
   ├─ config/               # Multer, Swagger
   ├─ controllers/          # Route handlers
   ├─ middlewares/          # Auth, error handler, rate limiter
   ├─ models/               # Mongoose models
   ├─ routes/               # Express routers
   ├─ uploads/              # Uploaded files
   └─ utils/                # AppError, asyncHandler, createNotification
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (sandbox keys)

### Environment Variables

**`server/.env`**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexus
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_key
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Locally

```bash
# Start server (from server/)
npm run dev

# Start client (from client/)
npm run dev
```

Server runs on `http://localhost:5000`  
Client runs on `http://localhost:5173`  
API docs at `http://localhost:5000/api-docs`

---

## API Overview

Full interactive documentation available at `/api-docs` (Swagger UI).

| Resource | Endpoints |
|---|---|
| Auth | register, login, me, change-password, 2fa/generate, 2fa/verify |
| Users | search, browse by role, get by id, update profile, upload avatar |
| Meetings | create, list, update status, delete |
| Messages | conversations, get messages, send, delete |
| Documents | upload, list, download, delete, e-sign |
| Transactions | deposit, withdraw, transfer, history, balance |
| Deals | create, list, update, delete |
| Notifications | list, mark read, mark all read |
| Profiles | get/update startup profile, get/update investor profile |

---

## Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens (7 day expiry)
- MongoDB injection prevention via express-mongo-sanitize
- Rate limiting: 200 req/15min general, 10 req/15min on auth routes
- Helmet security headers
- 2FA mockup with bcrypt-hashed OTP and 10-minute expiry
- Server-side authorization on all protected endpoints