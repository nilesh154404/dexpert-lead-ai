# Frontend-Backend Integration Guide

This document outlines all the integrations completed and remaining work.

## ✅ Completed Integrations

### 1. API Service Layer
- ✅ Created `src/lib/api-client.ts` - Axios-based API client with JWT token injection
- ✅ Created API modules:
  - `leads.api.ts`
  - `appointments.api.ts`
  - `conversations.api.ts`
  - `auth.api.ts`
  - `users.api.ts`
  - `analytics.api.ts`
  - `tenants.api.ts`
  - `ai-config.api.ts`

### 2. Authentication
- ✅ Created `AuthContext` for managing user authentication state
- ✅ JWT token storage in localStorage
- ✅ Automatic token injection in API requests
- ✅ 401 handling with automatic logout

### 3. Pages Integrated
- ✅ **Dashboard** - Fully integrated with analytics API and hot leads
- ✅ **Leads** - CRUD operations with search, filtering, and pagination
- ✅ **Dashboard Widgets**:
  - HotLeadsWidget - Integrated
  - AppointmentsWidget - Integrated
  - LeadFunnelWidget - Integrated

## 🔄 Remaining Integrations

### 1. LeadDetail Page (`src/pages/LeadDetail.tsx`)
**Current State:** Uses static `leadData` object
**Required:**
- Fetch lead by ID using `leadsApi.getById(id)`
- Fetch conversations for lead
- Fetch appointments for lead
- Fetch insights for lead
- Update lead status/intent
- Handle loading and error states

### 2. Appointments Page (`src/pages/Appointments.tsx`)
**Current State:** Uses static `appointments` object
**Required:**
- Fetch appointments with date range
- Group appointments by day
- Create new appointment
- Update appointment status
- Delete appointment

### 3. Conversations Page (`src/pages/Conversations.tsx`)
**Current State:** Uses `mockConversations` array
**Required:**
- Fetch all conversations
- Filter by leadId if needed
- Display conversation details with messages
- Update conversation accuracy feedback
- Add human corrections
- Handle message display with timestamps

### 4. Team Page (`src/pages/Team.tsx`)
**Current State:** Uses `teamMembers` array
**Required:**
- Fetch all users with `usersApi.getAll()`
- Display user stats (leads assigned, last active)
- Create new user
- Update user role/status
- Delete user

### 5. Analytics Page (`src/pages/Analytics.tsx`)
**Current State:** Uses static chart data
**Required:**
- Fetch dashboard stats
- Fetch lead sources distribution
- Fetch leads over time data
- Update charts with real data

### 6. BrandingSettings Page (`src/pages/BrandingSettings.tsx`)
**Current State:** Uses TenantContext which needs API integration
**Required:**
- Fetch current tenant using `tenantsApi.getCurrent()`
- Update tenant settings with `tenantsApi.update()`
- Handle save/reset functionality

### 7. AIConfig Page (`src/pages/AIConfig.tsx`)
**Current State:** Uses local state for automation rules
**Required:**
- Fetch automation rules with `aiConfigApi.getAllRules()`
- Create new rule
- Update rule enabled status
- Delete rule
- Save configuration

### 8. TenantContext (`src/contexts/TenantContext.tsx`)
**Current State:** Uses default tenant from code
**Required:**
- Fetch tenant on mount using `tenantsApi.getCurrent()`
- Update tenant when branding changes
- Handle loading state

## 📝 Data Mapping Notes

### Lead Status Mapping
Frontend: `"new" | "qualified" | "nurturing" | "converted" | "lost"`
Backend: `LeadStatus.NEW | LeadStatus.QUALIFIED | LeadStatus.NURTURING | LeadStatus.CONVERTED | LeadStatus.LOST`
✅ Match - No transformation needed

### Appointment Types
Frontend: `"video" | "phone" | "in-person"`
Backend: `AppointmentType.VIDEO | AppointmentType.PHONE | AppointmentType.IN_PERSON`
✅ Match - No transformation needed

### User Roles
Frontend: `"admin" | "manager" | "sales" | "support"`
Backend: `UserRole.ADMIN | UserRole.MANAGER | UserRole.SALES | UserRole.SUPPORT`
✅ Match - No transformation needed

### Date Formats
- Backend returns ISO 8601 strings
- Frontend uses `date-fns` for formatting
- Use `formatDistanceToNow()` for relative times
- Use `format()` for specific date formats

## 🔧 Environment Setup

### Required Environment Variables
Create `.env` file in frontend root:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Installation
```bash
cd kindred-lead-ai-main
npm install  # This will install axios
```

## 🚀 Running the Application

### 1. Start Backend
```bash
cd backend
npm install
npm run start:dev
# Backend runs on http://localhost:3000
```

### 2. Start Frontend
```bash
cd kindred-lead-ai-main
npm install
npm run dev
# Frontend runs on http://localhost:5173 (or configured port)
```

## 🔐 Authentication Flow

1. User registers/logs in via `/auth/login` or `/auth/register`
2. Backend returns JWT token
3. Token stored in localStorage as `auth_token`
4. Token automatically included in all API requests via interceptor
5. On 401 response, user is logged out and redirected

## 📊 React Query Usage

All API calls use `@tanstack/react-query` for:
- Automatic caching
- Background refetching
- Loading states
- Error handling

Example:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['leads', params],
  queryFn: () => leadsApi.getAll(params),
});
```

## ⚠️ Important Notes

1. **Authentication Required**: Most pages require authentication. Ensure user is logged in.
2. **Multi-tenant**: All API calls automatically filter by `tenantId` from authenticated user.
3. **Error Handling**: All API calls should handle errors gracefully with user-friendly messages.
4. **Loading States**: Always show loading indicators while fetching data.
5. **Data Transformation**: Some backend data may need formatting (dates, relative times, etc.)

## 🔄 Next Steps

1. Complete remaining page integrations (see list above)
2. Add proper error boundaries
3. Add form validation for create/update operations
4. Add optimistic updates for better UX
5. Add real-time updates (if needed)
6. Test all CRUD operations
7. Handle edge cases and error scenarios
