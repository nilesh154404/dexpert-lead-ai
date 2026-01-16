# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

## Setup in 5 Minutes

### 1. Backend Setup (2 minutes)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=kindred_lead_ai
JWT_SECRET=your-secret-key-min-32-chars
FRONTEND_URLS=http://localhost:8080,http://localhost:5173
```

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE kindred_lead_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Seed database (creates users, orgs, leads)
npm run seed

# Start backend
npm run start:dev
```

✅ Backend: http://localhost:3000
📚 Swagger: http://localhost:3000/api/docs

### 2. Frontend Setup (1 minute)

```bash
cd kindred-lead-ai-main
npm install
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env
npm run dev
```

✅ Frontend: http://localhost:8080

### 3. Login (30 seconds)

1. Open http://localhost:8080
2. Login with: `john@techcorp.com` / `admin123`
3. Done! 🎉

---

## Demo Credentials

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `superadmin@kindred.com` | `superadmin123` |
| Org Admin | `john@techcorp.com` | `admin123` |
| Staff | `jane@techcorp.com` | `staff123` |

---

## Test Chatbot API

```bash
curl -X POST http://localhost:3000/api/leads/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "organisationId": "org-techcorp",
    "name": "Test Visitor",
    "email": "visitor@test.com",
    "message": "Interested in your product"
  }'
```

Then check leads page - new lead should appear!

---

## What's Fixed

✅ CORS - Supports localhost:8080 and localhost:5173
✅ Authentication - Login page + JWT auth
✅ Multi-tenant - Role-based data isolation
✅ Chatbot API - Public endpoint for visitors
✅ Seed Data - Ready-to-use test data

---

For detailed documentation, see:
- `FINAL_SETUP_GUIDE.md` - Complete setup guide
- `SETUP_COMPLETE_SUMMARY.md` - All fixes summary
- `backend/README.md` - Backend documentation
- `backend/API_REFERENCE.md` - API reference
