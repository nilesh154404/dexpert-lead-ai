# Frontend-Backend Integration Complete

This document provides a complete guide for the integrated Kindred Lead AI application.

## 🎯 Integration Status

### ✅ Fully Integrated Components

1. **API Infrastructure**
   - Complete API client with JWT authentication
   - All API service modules created
   - Automatic token injection and 401 handling

2. **Pages**
   - ✅ Dashboard - Fully functional with real data
   - ✅ Leads - List, search, filter, pagination
   - ✅ LeadDetail - View lead with conversations and appointments
   - ✅ BrandingSettings - Full CRUD for tenant branding

3. **Widgets**
   - ✅ HotLeadsWidget
   - ✅ AppointmentsWidget  
   - ✅ LeadFunnelWidget

4. **Context Providers**
   - ✅ AuthContext - User authentication
   - ✅ TenantContext - Tenant branding with API

### ⚠️ Partially Integrated

1. **Appointments Page** - Widget integrated, full page needs work
2. **Conversations Page** - Needs full integration
3. **Team Page** - Needs API integration
4. **Analytics Page** - Needs chart data integration
5. **AIConfig Page** - Needs rule management integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your MySQL credentials:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=root
# DB_PASSWORD=your_password
# DB_DATABASE=kindred_lead_ai
# JWT_SECRET=your-secret-key

# Create database
mysql -u root -p
CREATE DATABASE kindred_lead_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Start backend
npm run start:dev
```

Backend will run on `http://localhost:3000`

### Frontend Setup

```bash
cd kindred-lead-ai-main

# Install dependencies (includes axios)
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173` (or configured port)

## 🔐 Authentication

**Important**: Currently, there's no login/register UI. To test:

### Option 1: Create User via API
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "tenantId": "default"
  }'
```

Save the `access_token` from response.

### Option 2: Set Token Manually
1. Register a user via API (Option 1)
2. Open browser console on frontend
3. Run:
```javascript
localStorage.setItem('auth_token', 'your-token-here');
localStorage.setItem('user', JSON.stringify({
  id: 'user-id',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  tenantId: 'default'
}));
```
4. Refresh the page

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Leads
- `GET /api/leads` - List leads (with filters)
- `GET /api/leads/:id` - Get lead details
- `GET /api/leads/hot` - Get hot leads
- `POST /api/leads` - Create lead
- `PATCH /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Appointments
- `GET /api/appointments` - List appointments
- `GET /api/appointments/:id` - Get appointment
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Conversations
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id` - Get conversation
- `POST /api/conversations` - Create conversation
- `POST /api/conversations/messages` - Add message
- `PATCH /api/conversations/:id` - Update conversation

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/lead-sources` - Lead sources
- `GET /api/analytics/leads-over-time` - Leads over time

### Tenants
- `GET /api/tenants/me` - Get current tenant
- `PATCH /api/tenants/me` - Update tenant branding

### AI Config
- `GET /api/ai-config/rules` - List automation rules
- `POST /api/ai-config/rules` - Create rule
- `PATCH /api/ai-config/rules/:id` - Update rule
- `DELETE /api/ai-config/rules/:id` - Delete rule

## 📁 Project Structure

```
kindred-lead-ai-main/
├── src/
│   ├── lib/
│   │   ├── api-client.ts          # Axios client with auth
│   │   └── api/                   # API service modules
│   │       ├── auth.api.ts
│   │       ├── leads.api.ts
│   │       ├── appointments.api.ts
│   │       ├── conversations.api.ts
│   │       ├── users.api.ts
│   │       ├── analytics.api.ts
│   │       ├── tenants.api.ts
│   │       └── ai-config.api.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Authentication state
│   │   └── TenantContext.tsx      # Tenant branding (API integrated)
│   ├── pages/
│   │   ├── Dashboard.tsx          # ✅ Integrated
│   │   ├── Leads.tsx              # ✅ Integrated
│   │   ├── LeadDetail.tsx         # ✅ Integrated
│   │   ├── BrandingSettings.tsx   # ✅ Integrated
│   │   ├── Appointments.tsx       # ⚠️ Partial
│   │   ├── Conversations.tsx      # ⚠️ Needs work
│   │   ├── Team.tsx               # ⚠️ Needs work
│   │   ├── Analytics.tsx          # ⚠️ Partial
│   │   └── AIConfig.tsx           # ⚠️ Needs work
│   └── components/
│       └── dashboard/
│           ├── HotLeadsWidget.tsx    # ✅ Integrated
│           ├── AppointmentsWidget.tsx # ✅ Integrated
│           └── LeadFunnelWidget.tsx  # ✅ Integrated
└── backend/                        # NestJS backend
    └── src/
        ├── auth/                   # Authentication module
        ├── leads/                  # Leads module
        ├── appointments/           # Appointments module
        ├── conversations/          # Conversations module
        ├── users/                  # Users module
        ├── analytics/              # Analytics module
        ├── tenants/                # Tenants module
        └── ai-config/              # AI Config module
```

## 🧪 Testing the Integration

1. **Start both servers** (backend and frontend)

2. **Register a user** via API or set token manually

3. **Test Dashboard**:
   - Navigate to `/`
   - Should see stats loading from API
   - Hot leads widget should populate

4. **Test Leads Page**:
   - Navigate to `/leads`
   - Create a test lead via API first:
   ```bash
   curl -X POST http://localhost:3000/api/leads \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Lead",
       "email": "test@example.com",
       "status": "new",
       "intentScore": 85,
       "source": "AI Chatbot"
     }'
   ```
   - Refresh leads page - should see the lead

5. **Test Lead Detail**:
   - Click on a lead
   - Should see lead details, conversations, appointments

## 🔧 Troubleshooting

### CORS Errors
- Ensure backend CORS is configured for frontend URL
- Check `FRONTEND_URL` in backend `.env`

### 401 Unauthorized
- Token may be expired or invalid
- Check token in localStorage
- Re-login or register new user

### API Connection Errors
- Verify backend is running on port 3000
- Check `VITE_API_BASE_URL` in frontend `.env`
- Check browser console for errors

### Database Connection Errors
- Verify MySQL is running
- Check database credentials in backend `.env`
- Ensure database exists

## 📝 Next Steps

1. **Create Login/Register Pages** - Critical for production
2. **Complete Remaining Pages** - See INTEGRATION_SUMMARY.md
3. **Add Form Validation** - Client-side validation matching backend DTOs
4. **Improve Error Handling** - Better user feedback
5. **Add Loading States** - Skeleton loaders for better UX
6. **Add Optimistic Updates** - Immediate UI updates
7. **Add Real-time Features** - WebSocket integration if needed

## 📚 Documentation

- **Backend API Docs**: http://localhost:3000/api/docs (Swagger)
- **Integration Guide**: See `INTEGRATION_GUIDE.md`
- **Integration Summary**: See `INTEGRATION_SUMMARY.md`

## 🎉 Success!

The core integration is complete! The application now:
- ✅ Connects frontend to backend APIs
- ✅ Handles authentication with JWT
- ✅ Fetches and displays real data
- ✅ Supports multi-tenant architecture
- ✅ Has proper error handling
- ✅ Uses React Query for efficient data fetching

Most critical features are working. Remaining integrations are straightforward and follow the same patterns already established.
