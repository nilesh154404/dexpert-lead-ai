# 🚀 Dexpert Lead AI - Complete Setup & Tenant Management Guide

Complete documentation for the multi-tenant Dexpert Lead AI platform with authentication, tenant management, and chatbot integration.

---

## 📋 Table of Contents

1. [Quick Start (5 minutes)](#quick-start-5-minutes)
2. [Setup Instructions](#setup-instructions)
3. [Tenant Management Feature](#tenant-management-feature)
4. [Architecture](#architecture)
5. [Demo Credentials](#demo-credentials)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Backend Setup (2 min)

```bash
cd backend
npm install
cp .env.example .env
```

**Configure `.env`:**
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=123456789
DB_DATABASE=kindred_lead_ai
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URLS=http://localhost:8080,http://localhost:5173
```

**Run commands:**
```bash
# Create database
mysql -u root -p123456789 -e "CREATE DATABASE kindred_lead_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Seed database
npm run seed

# Start backend
npm run start:dev
```

✅ **Backend**: http://localhost:3000  
📚 **API Docs**: http://localhost:3000/api/docs

### Frontend Setup (1 min)

```bash
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env
npm run dev
```

✅ **Frontend**: http://localhost:8080

### Login (30 sec)

Navigate to `http://localhost:8080` and login with demo credentials (see section below).

---

## 📦 Setup Instructions

### Backend Structure

```
backend/src/
├── main.ts                      # App entry, CORS config
├── app.module.ts                # Root module
├── auth/                        # Authentication
│   ├── auth.controller.ts       # Login/register endpoints
│   ├── auth.service.ts          # JWT token generation
│   ├── guards/                  # Role & public guards
│   ├── decorators/              # @Roles(), @Public()
│   └── strategies/              # Passport JWT strategy
├── entities/                    # Database models
│   ├── user.entity.ts           # User with roles
│   ├── tenant.entity.ts         # Tenant/Organization
│   ├── lead.entity.ts           # Lead management
│   └── ...                      # Other models
├── leads/                       # Lead management
├── tenants/                     # Tenant management (SUPER_ADMIN only)
├── users/                       # User management
├── team/                        # Team management
├── appointments/                # Appointment scheduling
├── conversations/               # Conversation history
└── analytics/                   # Analytics & reporting
```

### Frontend Structure

```
frontend/src/
├── pages/
│   ├── Login.tsx                # Authentication page
│   ├── Dashboard.tsx            # Main dashboard
│   ├── Tenants.tsx              # Tenant management (NEW)
│   ├── Team.tsx                 # Team management
│   ├── Leads.tsx                # Lead management
│   └── ...
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx        # Main layout wrapper
│   │   └── AppSidebar.tsx       # Navigation sidebar
│   ├── tenants/                 # Tenant management components (NEW)
│   │   ├── TenantForm.tsx       # Create/edit form
│   │   └── TenantList.tsx       # Display table
│   └── ...
├── contexts/
│   └── AuthContext.tsx          # Auth state management
├── lib/
│   ├── api/
│   │   └── tenants-admin.api.ts # Tenant API calls (NEW)
│   ├── color-utils.ts           # HSL color conversion (NEW)
│   └── api-client.ts            # Axios setup with JWT injection
└── App.tsx                      # Routes & protected pages
```

---

## ✨ Features Overview

### ✅ Authentication
- JWT-based with Passport (backend)
- Login page with form validation (frontend)
- Token stored in localStorage
- Auto-injected in API requests
- Protected routes with auto-redirect
- 401 responses trigger logout

### ✅ Multi-Tenant Architecture
- **Roles**: SUPER_ADMIN > ORGANISATION > ADMIN/MANAGER/SALES/SUPPORT
- **Data Isolation**: All queries filtered by tenant except SUPER_ADMIN
- **Tenant-aware UI**: Sidebar shows role-based menu items
- **Full Isolation**: Each organization is completely isolated

### ✅ Chatbot / Visitor API
- **Endpoint**: `POST /api/leads/chatbot` (no auth required)
- **Visitors**: Can submit information without login
- **Auto Organization**: Leads assigned to specified organization
- **Source Tracking**: Marked as "AI Chatbot" source

```bash
# Test endpoint
curl -X POST http://localhost:3000/api/leads/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "organisationId": "org-techcorp",
    "name": "John Visitor",
    "email": "john@visitor.com",
    "message": "Interested in your service"
  }'
```

### ✅ CORS Support
- Configurable via `FRONTEND_URLS` environment variable
- Supports multiple frontend origins
- Credentials enabled for JWT handling

---

## 🎯 Tenant Management Feature

### Overview

**SUPER_ADMIN only feature** for creating, viewing, editing, and deleting organizations. Each tenant includes:
- Basic information (name, logo)
- Brand colors (primary & accent in HSL format)
- Chatbot configuration
- Font and styling preferences

### Project Structure

```
frontend/src/
├── pages/
│   └── Tenants.tsx                    # Main page
├── components/tenants/
│   ├── TenantForm.tsx                 # Create/edit form
│   └── TenantList.tsx                 # Display table
├── lib/
│   ├── api/
│   │   └── tenants-admin.api.ts       # API calls
│   └── color-utils.ts                 # HSL conversion
└── App.tsx                             # Routes updated
```

### Key Components

#### 1. TenantForm Component
**Location**: `src/components/tenants/TenantForm.tsx`

**Fields**:
- Organization name (required)
- Logo URL (optional)
- Logomark URL (optional)
- Primary color (HSL with visual preview)
- Accent color (HSL with visual preview)
- Font family (optional)
- Chatbot name (optional)
- Chatbot avatar (optional)
- Welcome message (optional)

**Features**:
- ✅ Zod validation with error messages
- ✅ Real-time color preview boxes
- ✅ Form reset functionality
- ✅ Default values for edit mode
- ✅ Loading state on submit

#### 2. TenantList Component
**Location**: `src/components/tenants/TenantList.tsx`

**Display**:
- Organization name with avatar/initials
- Branding color preview boxes
- Chatbot configuration badge
- Created date (relative time)
- Edit/Delete dropdown menu

**Features**:
- ✅ Professional table layout
- ✅ Match Team page styling
- ✅ Responsive design

#### 3. Tenants Page
**Location**: `src/pages/Tenants.tsx`

**Features**:
- ✅ List all organizations
- ✅ Create dialog with form
- ✅ Edit dialog with form
- ✅ Delete confirmation dialog
- ✅ Real-time error/success notifications
- ✅ Search by name, ID, or chatbot name
- ✅ Stats cards showing: total tenants, with chatbot, search results, with custom branding

#### 4. API Service
**Location**: `src/lib/api/tenants-admin.api.ts`

**Methods**:
```typescript
tenantsAdminApi.getAll()              // Get all tenants
tenantsAdminApi.getById(id)           // Get single tenant
tenantsAdminApi.create(data)          // Create new tenant
tenantsAdminApi.update(id, data)      // Update tenant
tenantsAdminApi.delete(id)            // Delete tenant
```

**Response Format**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Organization Name",
      "logo": "https://...",
      "logomark": "https://...",
      "primaryColor": "240 60% 50%",
      "accentColor": "280 80% 60%",
      "fontFamily": "Arial",
      "welcomeMessage": "Welcome!",
      "chatbotName": "Assistant",
      "chatbotAvatar": "https://...",
      "tenantSecret": "hex-string",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  ],
  "total": 2
}
```

#### 5. Color Utilities
**Location**: `src/lib/color-utils.ts`

**Functions**:
```typescript
parseHSLString(hsl: string): HSLColor    // "240 60% 50%" → {h:240,s:60,l:50}
toHSLString(hsl: HSLColor): string       // {h:240,s:60,l:50} → "240 60% 50%"
hslToHex(h, s, l): string                // (240,60,50) → "#3c6ba3"
hexToHSL(hex: string): HSLColor          // "#3c6ba3" → {h:240,s:60,l:50}
```

### How It Works

#### Create Organization
```
User clicks "New Tenant" button
    ↓
Dialog opens with empty form
    ↓
User fills in all fields
    ↓
Form validates on submit (name required, colors valid HSL)
    ↓
POST /api/tenants with tenant data
    ↓
Backend:
  - Validates SUPER_ADMIN role (403 if not)
  - Generates UUID for tenant ID
  - Generates random tenant secret
  - Stores in database
    ↓
Success toast → List refreshes
```

#### Edit Organization
```
User clicks "Edit" in row menu
    ↓
Form dialog opens pre-filled with tenant data
    ↓
User modifies fields
    ↓
Form validates
    ↓
PATCH /api/tenants/:id with updated data
    ↓
Backend validates SUPER_ADMIN role
    ↓
Database record updated
    ↓
Success toast → List refreshes
```

#### Delete Organization
```
User clicks "Delete" in row menu
    ↓
Confirmation dialog appears:
  "Are you sure you want to delete [Name]?
   This action cannot be undone."
    ↓
User confirms
    ↓
DELETE /api/tenants/:id
    ↓
Backend validates SUPER_ADMIN role
    ↓
Database record deleted
    ↓
Success toast → List refreshes
```

### Color Format

**HSL (Hue, Saturation, Lightness)**

```
Format: "240 60% 50%"
         h   s  l

Ranges:
- Hue: 0-360 degrees
- Saturation: 0-100%
- Lightness: 0-100%
```

**Examples**:
- Blue: `240 60% 50%`
- Red: `0 80% 50%`
- Green: `120 60% 50%`
- Gray: `0 0% 50%`

The form includes visual color preview boxes that update in real-time!

### Backend Integration Checklist

- [ ] Implement GET /api/tenants (list all)
- [ ] Implement POST /api/tenants (create)
- [ ] Implement GET /api/tenants/:id (get single)
- [ ] Implement PATCH /api/tenants/:id (update)
- [ ] Implement DELETE /api/tenants/:id (delete)
- [ ] Add SUPER_ADMIN role check on all endpoints
- [ ] Validate TenantBranding structure
- [ ] Return error messages in `{ message: "..." }` format

---

## 🏗️ Architecture

### Authentication Flow

```
User Login
    ↓
POST /api/auth/login (email, password)
    ↓
Backend validates credentials
    ↓
JWT token generated with: sub, email, role, tenantId
    ↓
Frontend stores token in localStorage
    ↓
All API requests include Authorization header
    ↓
Backend validates token & role
    ↓
Protected routes rendered
```

### Multi-Tenant Data Flow

```
User Request
    ↓
Backend extracts role from JWT
    ↓
Is SUPER_ADMIN?
    ├─ YES → Return all data (no tenant filter)
    └─ NO → Filter data WHERE tenantId = user.tenantId
    ↓
Response sent to frontend
    ↓
Frontend renders based on user.role
```

---

## 👤 Demo Credentials

After running `npm run seed`:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Super Admin** | superadmin@kindred.com | superadmin123 | All organizations, tenant management |
| **Org Admin** | john@techcorp.com | admin123 | TechCorp organization only |
| **Staff** | jane@techcorp.com | staff123 | TechCorp organization only |

**Test Organizations**:
- **TechCorp**: tech@example.com (primary: `240 60% 50%`, accent: `280 80% 60%`)
- **GreenLeaf Solutions**: info@greenleaf.com (primary: `120 70% 40%`, accent: `60 80% 50%`)

---

## 🔑 Role Permissions

### SUPER_ADMIN
- ✅ View ALL organizations
- ✅ Create/edit/delete organizations (tenants)
- ✅ View ALL leads across all organizations
- ✅ View analytics for all organizations
- ✅ System-level configuration

### ORGANISATION (Org Admin)
- ✅ Full access to their organization
- ✅ Manage staff users
- ✅ Configure branding
- ✅ View/manage leads in their org
- ❌ Cannot see other organizations

### STAFF (Admin, Manager, Sales, Support)
- ✅ View leads in their organization
- ✅ Create/update leads
- ❌ Cannot access other organizations
- ❌ Cannot manage tenants
- ❌ Cannot manage staff

---

## 🐛 Troubleshooting

### CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check `backend/.env` has `FRONTEND_URLS` set correctly
2. Include your frontend URL: `FRONTEND_URLS=http://localhost:8080,http://localhost:5173`
3. Restart backend: `npm run start:dev`

### Login Fails
**Error**: `Invalid credentials` or `Cannot POST /api/auth/login`

**Solution**:
1. Verify backend is running: `npm run start:dev`
2. Check database is created: `mysql -u root -p123456789 -e "SHOW DATABASES;"`
3. Run seed script: `npm run seed`
4. Use correct credentials from Demo Credentials section

### Frontend Can't Find API
**Error**: `Cannot GET http://localhost:3000/api/...`

**Solution**:
1. Check `frontend/.env` has `VITE_API_BASE_URL=http://localhost:3000/api`
2. Verify backend is running on port 3000
3. Restart frontend dev server: `npm run dev`

### Tenant Management Shows Error
**Error**: `Failed to load tenants` or `403 Forbidden`

**Solution**:
1. Verify you're logged in as SUPER_ADMIN
2. Check JWT token is stored: DevTools → Application → localStorage → `token`
3. Verify backend returns 200 status: DevTools → Network tab
4. Check backend logs for error messages

### Color Preview Not Working
**Error**: Color boxes show wrong color or no preview

**Solution**:
1. Ensure HSL format is correct: `"240 60% 50%"` (number, space, percent, space, percent)
2. Check color values are in valid ranges: Hue 0-360, Saturation 0-100%, Lightness 0-100%
3. Clear browser cache and reload

### Database Connection Error
**Error**: `connect ECONNREFUSED 127.0.0.1:3306`

**Solution**:
1. Verify MySQL is running: `mysql -u root -p123456789 -e "SELECT 1;"`
2. Check connection params in `.env`: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD
3. Test with MySQL client: `mysql -u root -p123456789 -h localhost kindred_lead_ai`

---

## 🎯 Next Steps

1. ✅ Complete setup using Quick Start section
2. ✅ Login with demo credentials
3. ✅ Explore tenant management feature (SUPER_ADMIN only)
4. ✅ Review other pages: Dashboard, Leads, Team, Appointments
5. ✅ Test chatbot API endpoint
6. ✅ Customize branding and colors per organization

---

## 📚 Additional Resources

- **Backend README**: `backend/README.md`
- **API Reference**: `backend/API_REFERENCE.md`
- **Frontend README**: `frontend/README.md`
- **Demo Credentials**: `backend/DEMO_CREDENTIALS.md`

---

**Last Updated**: January 20, 2026  
**Platform**: Dexpert Lead AI v1.0
