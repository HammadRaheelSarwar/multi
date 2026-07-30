# Ustad Hub — MERN Stack

A full-featured local services marketplace platform built with the MERN stack under the Ustad Hub brand.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | Supabase PostgreSQL |
| **Auth** | Supabase Auth (email/password + Google OAuth) |
| **State** | Redux Toolkit |
| **HTTP** | Axios |
| **Real-time** | Socket.io |
| **Email** | Nodemailer |
| **Uploads** | Supabase Storage |

## Supabase setup

1. Run `server/supabase-schema.sql` in the Supabase SQL Editor.
2. Enable Google under Authentication → Providers and add `http://localhost:3000/auth/callback` as a redirect URL.
3. Create `avatars`, `business-media`, and `service-images` Storage buckets with public-read/authenticated-write policies.
4. Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`, then fill in the project URL, anon key, and service-role key.

Keep the service-role key on the server only; the browser uses the anon key and sends Supabase access tokens to Express.

## 📁 Project Structure

```
Multi-service/
├── client/     ← React + Vite frontend (port 3000)
├── server/     ← Express + MongoDB backend (port 5000)
├── docker/     ← Docker configurations
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB running locally (`mongodb://localhost:27017`)

### Install Dependencies
```bash
npm run install-all
```

### Seed the Database
```bash
npm run seed
```
Creates: 30 categories, 3 subscription plans, super admin account

**Admin credentials:**
- Email: `admin@marketplace.com`
- Password: `Admin@123`

### Start Development Servers
Open two terminal windows:

```bash
# Terminal 1 — Backend (port 5000)
npm run start:server

# Terminal 2 — Frontend (port 3000)
npm run start:client
```

## 🔗 URLs

| App | URL |
|---|---|
| Customer Marketplace | http://localhost:3000 |
| Admin Dashboard | http://localhost:3000/admin |
| REST API | http://localhost:5000/api |

## 🔒 Roles
- `super_admin` — full platform control
- `admin` — manage users, businesses, categories
- `moderator` — review reports and verifications
- `business_owner` — manage own business profile
- `customer` — browse and book services

## 📡 API Endpoints

| Prefix | Description |
|---|---|
| `/api/auth` | Authentication (register, login, refresh, verify) |
| `/api/users` | User profile management |
| `/api/businesses` | Business CRUD, verification, analytics |
| `/api/categories` | Service categories |
| `/api/services` | Services offered by businesses |
| `/api/reviews` | Customer reviews and ratings |
| `/api/bookings` | Service bookings |
| `/api/messages` | Business ↔ Customer messaging |
| `/api/notifications` | Push notifications |
| `/api/search` | Full-text + geo-location search |
| `/api/admin` | Admin panel operations |
