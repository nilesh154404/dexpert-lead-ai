# 🎉 Complete Setup Guide - Multi-Tenant Kindred Lead AI

All issues fixed! The system is fully functional with authentication, multi-tenant isolation, and public chatbot API.

## ✅ All Fixes Completed

### A. CORS Fixed ✅
- **Before**: Only `http://localhost:5173` allowed
- **After**: Supports both `http://localhost:8080` and `http://localhost:5173`
- **File**: `backend/src/main.ts`
- **Config**: Uses `FRONTEND_URLS` env variable (comma-separated)

### B. Authentication Implemented ✅
- **Backend**: JWT auth with role-based guards
- **Frontend**: Login page + protected routes
- **Token Management**: Secure storage in localStorage
- **Auto Redirect**: Unauthenticated users → `/login`

### C. Multi-Tenant Role Handling ✅
- **Roles**: SUPER_ADMIN, ORGANISATION, ADMIN, MANAGER, SALES, SUPPORT
- **Isolation**: Staff see only their organisation's data
- **Super Admin**: Can view all organisations
- **Enforced**: At service/query level

### D. Visitor/Chatbot Flow ✅
- **Public Endpoint**: `POST /api/leads/chatbot`
- **No Auth Required**: Visitors can submit leads
- **Auto Mapping**: Leads assigned to organisation
- **Validation**: Organisation ID verified

### E. Frontend Integration ✅
- All pages consume live APIs
- Role-based UI rendering
- Protected routes
- Error handling

### F. Database Seeded ✅
- Script: `npm run seed`
- 1 SuperAdmin + 2 Orgs + Staff + Sample Leads

---

## 🚀 Quick Start

### Step 1: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
NODE_ENV=development
FRONTEND_URLS=http://localhost:8080,http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password_here
DB_DATABASE=kindred_lead_ai

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
```

```bash
# Create database
mysql -u root -p
CREATE DATABASE kindred_lead_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Seed database (creates users, orgs, leads)
npm run seed

# Start backend
npm run start:dev
```

**✅ Backend running on**: `http://localhost:3000`
**📚 Swagger**: `http://localhost:3000/api/docs`

### Step 2: Setup Frontend

```bash
cd kindred-lead-ai-main

# Install dependencies (includes axios)
npm install

# Create .env
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# Start frontend
npm run dev
```

**✅ Frontend running on**: `http://localhost:8080` (or configured port)

### Step 3: Login

1. Navigate to `http://localhost:8080`
2. You'll be redirected to `/login`
3. Use demo credentials:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Super Admin** | `superadmin@kindred.com` | `superadmin123` | All organisations |
| **Org Admin** | `john@techcorp.com` | `admin123` | TechCorp only |
| **Staff** | `jane@techcorp.com` | `staff123` | TechCorp only |

---

## 🔐 Authentication Flow

1. **User visits app** → Redirected to `/login` if not authenticated
2. **User logs in** → Token stored in localStorage
3. **API requests** → Token automatically included in headers
4. **401 response** → Auto logout + redirect to login
5. **Protected routes** → Check auth before rendering

---

## 🌐 Multi-Tenant Architecture

### Role Permissions

**SUPER_ADMIN**
- Can view ALL organisations
- Can view ALL leads across all orgs
- System-level access

**ORGANISATION (Org Admin)**
- Full access to their organisation
- Can manage staff
- Can configure branding
- Can view all leads in their org

**STAFF (Admin, Manager, Sales, Support)**
- Limited to their organisation
- Can view/manage leads in their org only
- Cannot see other organisations

### Data Isolation

Every query filters by `tenantId` unless user is SUPER_ADMIN:

```typescript
// Staff query (filtered)
WHERE tenantId = user.tenantId

// Super Admin query (all data)
WHERE 1=1  // No filter
```

---

## 🤖 Chatbot / Visitor API

### Public Endpoint (No Authentication)

```bash
POST http://localhost:3000/api/leads/chatbot
Content-Type: application/json

{
  "organisationId": "org-techcorp",
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "phone": "+1234567890",
  "company": "Company Name",
  "role": "VP of Sales",
  "message": "Interested in your product"
}
```

**Response:**
```json
{
  "id": "lead-uuid",
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "status": "new",
  "tenantId": "org-techcorp",
  "source": "AI Chatbot",
  ...
}
```

### Testing Chatbot API

```bash
# Test with curl
curl -X POST http://localhost:3000/api/leads/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "organisationId": "org-techcorp",
    "name": "Test Visitor",
    "email": "test@example.com",
    "message": "Hello, I am interested"
  }'

# Then check leads page (login first)
# Should see the new lead!
```

---

## 📊 API Endpoints Summary

### Public (No Auth)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/leads/chatbot` - Submit lead from chatbot

### Protected (Require JWT)
- `GET /api/leads` - List leads (filtered by tenant)
- `GET /api/leads/:id` - Get lead
- `POST /api/leads` - Create lead
- `PATCH /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/tenants/me` - Get tenant branding
- `PATCH /api/tenants/me` - Update tenant branding
- ... and more

**Note**: All protected endpoints automatically filter by tenant unless user is SUPER_ADMIN.

---

## 🧪 Testing Scenarios

### Test 1: Multi-Tenant Isolation
1. Login as `john@techcorp.com`
2. Go to `/leads` → See TechCorp leads only
3. Logout
4. Login as `emily@greenleaf.com`
5. Go to `/leads` → See GreenLeaf leads only
6. Logout
7. Login as `superadmin@kindred.com`
8. Go to `/leads` → See ALL leads from both orgs

### Test 2: Chatbot Flow
1. Submit lead via chatbot API (no login)
2. Login as `john@techcorp.com`
3. Check `/leads` → Should see new lead

### Test 3: Protected Routes
1. Logout
2. Try to access `/dashboard` → Redirected to `/login`
3. After login → Redirected back to dashboard

---

## 📁 Key Files Changed/Created

### Backend
```
backend/
├── src/
│   ├── main.ts                          # CORS fixed
│   ├── app.module.ts                    # Global guards added
│   ├── entities/
│   │   └── user.entity.ts               # Added SUPER_ADMIN role
│   ├── auth/
│   │   ├── guards/
│   │   │   ├── roles.guard.ts           # NEW - Role-based access
│   │   │   └── public.guard.ts          # NEW - Public endpoints
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts       # NEW - @Roles() decorator
│   │   │   └── public.decorator.ts      # NEW - @Public() decorator
│   │   └── auth.controller.ts           # Public endpoints marked
│   ├── leads/
│   │   ├── leads.service.ts             # Multi-tenant isolation
│   │   ├── leads.controller.ts          # Public chatbot endpoint
│   │   └── dto/
│   │       └── create-lead-chatbot.dto.ts  # NEW - Chatbot DTO
│   ├── analytics/
│   │   └── analytics.service.ts         # Super admin support
│   └── database/
│       └── seed.ts                      # NEW - Seed script
└── SETUP_COMPLETE.md                    # This guide
```

### Frontend
```
kindred-lead-ai-main/
├── src/
│   ├── pages/
│   │   └── Login.tsx                    # NEW - Login page
│   ├── App.tsx                          # Protected routes
│   ├── components/layout/
│   │   └── AppLayout.tsx                # User menu + logout
│   ├── contexts/
│   │   └── AuthContext.tsx              # Auth state management
│   └── lib/
│       ├── api-client.ts                # Token injection
│       └── api/
│           └── chatbot.api.ts           # NEW - Chatbot API
```

---

## 🔒 Security Features

1. **JWT Tokens**: Secure, signed tokens
2. **Password Hashing**: bcrypt with salt
3. **Role-Based Guards**: Enforced at controller level
4. **Tenant Isolation**: Enforced at service level
5. **CORS Protection**: Only allowed origins
6. **Input Validation**: class-validator on all DTOs
7. **Public Endpoints**: Explicitly marked with `@Public()`

---

## 🎯 Role-Based Access Matrix

| Endpoint | SUPER_ADMIN | ORGANISATION | STAFF |
|----------|-------------|--------------|-------|
| View All Leads | ✅ All | ✅ Own org | ✅ Own org |
| Create Lead | ✅ Any org | ✅ Own org | ✅ Own org |
| Update Lead | ✅ Any org | ✅ Own org | ✅ Own org |
| View Analytics | ✅ All orgs | ✅ Own org | ✅ Own org |
| Manage Users | ✅ All | ✅ Own org | ❌ |
| Branding Config | ✅ All | ✅ Own org | ❌ |

---

## 🐛 Troubleshooting

### CORS Error Still Appears
- ✅ Check `FRONTEND_URLS` in backend `.env`
- ✅ Restart backend after changing `.env`
- ✅ Clear browser cache
- ✅ Check exact origin in error (including port)

### 401 Unauthorized
- ✅ Check token in localStorage: `localStorage.getItem('auth_token')`
- ✅ Token might be expired (default 7 days)
- ✅ Re-login to get new token
- ✅ Check backend JWT_SECRET matches

### Can't See All Leads as Super Admin
- ✅ Check user role in database: Should be `super_admin`
- ✅ Check JWT token includes role
- ✅ Verify service checks for `UserRole.SUPER_ADMIN`

### Seed Script Fails
- ✅ Ensure database exists
- ✅ Check MySQL connection in `.env`
- ✅ Verify TypeORM entities are correct
- ✅ Check for duplicate emails (should be unique)

### Frontend Can't Connect
- ✅ Check `VITE_API_BASE_URL` in frontend `.env`
- ✅ Verify backend is running on port 3000
- ✅ Check browser console for errors
- ✅ Verify CORS is configured correctly

---

## 📝 Environment Variables

### Backend `.env`
```env
PORT=3000
NODE_ENV=development
FRONTEND_URLS=http://localhost:8080,http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=kindred_lead_ai

JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access `/login` page
- [ ] Can login with seed credentials
- [ ] Dashboard loads with real data
- [ ] Leads page shows filtered leads
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] Chatbot API works without auth
- [ ] Multi-tenant isolation works
- [ ] Super admin sees all leads

---

## 🎉 Success!

Your multi-tenant system is fully operational with:
- ✅ CORS fixed
- ✅ Authentication working
- ✅ Multi-tenant isolation enforced
- ✅ Role-based access control
- ✅ Public chatbot API
- ✅ Database seeded
- ✅ Frontend integrated

**Next**: Start developing features or customize for your needs!

---

## 📚 Additional Resources

- **Backend API Docs**: http://localhost:3000/api/docs
- **Backend README**: `backend/README.md`
- **Backend API Reference**: `backend/API_REFERENCE.md`
- **Integration Guide**: `kindred-lead-ai-main/README_INTEGRATION.md`
