# Kindred Lead AI - Backend API

NestJS backend API for the Kindred Lead AI application. This backend provides REST APIs for lead management, conversations, appointments, analytics, and AI configuration.

## Tech Stack

- **Framework**: NestJS 10.x
- **Database**: MySQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer

## Prerequisites

- Node.js 18+ and npm/yarn
- MySQL 8.0+ database
- Git

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - Database connection details
   - JWT secret key
   - Port and other settings

3. **Create MySQL database:**
   ```sql
   CREATE DATABASE kindred_lead_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Run the application:**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the server is running, access Swagger documentation at:
- **Swagger UI**: http://localhost:3000/api/docs

## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Leads (`/api/leads`)
- `GET /api/leads` - Get all leads (with filters and pagination)
- `GET /api/leads/hot` - Get hot leads (intent score >= 85)
- `GET /api/leads/:id` - Get a specific lead
- `POST /api/leads` - Create a new lead
- `PATCH /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead

### Appointments (`/api/appointments`)
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/lead/:leadId` - Get appointments for a lead
- `GET /api/appointments/:id` - Get a specific appointment
- `POST /api/appointments` - Create a new appointment
- `PATCH /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Delete an appointment

### Conversations (`/api/conversations`)
- `GET /api/conversations` - Get all conversations
- `GET /api/conversations/:id` - Get a specific conversation
- `GET /api/conversations/:id/messages` - Get messages in a conversation
- `POST /api/conversations` - Create a new conversation
- `POST /api/conversations/messages` - Add a message to a conversation
- `PATCH /api/conversations/:id` - Update a conversation
- `DELETE /api/conversations/:id` - Delete a conversation

### Users (`/api/users`)
- `GET /api/users` - Get all users in tenant
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PATCH /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/lead-sources` - Get lead sources distribution
- `GET /api/analytics/leads-over-time` - Get leads generated over time

### Tenants (`/api/tenants`)
- `POST /api/tenants` - Create a new tenant (requires TENANTS:CREATE permission)
- `GET /api/tenants` - Get all tenants with pagination (requires TENANTS:READ permission)
- `GET /api/tenants/:id` - Get a specific tenant by ID (requires TENANTS:READ permission)
- `PATCH /api/tenants/:id` - Update a tenant by ID (requires TENANTS:UPDATE permission)
- `DELETE /api/tenants/:id` - Delete a tenant by ID (requires TENANTS:DELETE permission)
- `GET /api/tenants/me` - Get current tenant branding settings
- `PATCH /api/tenants/me` - Update current tenant branding settings

### AI Config (`/api/ai-config`)
- `GET /api/ai-config/rules` - Get all automation rules
- `GET /api/ai-config/rules/:id` - Get a specific rule
- `POST /api/ai-config/rules` - Create an automation rule
- `PATCH /api/ai-config/rules/:id` - Update an automation rule
- `DELETE /api/ai-config/rules/:id` - Delete an automation rule

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Sample API Requests

### 1. Register a User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "password": "password123",
  "tenantId": "default"
}
```

### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@company.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "user-uuid",
  "name": "John Doe",
  "email": "john.doe@company.com",
  "role": "admin",
  "tenantId": "default",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Create a Lead
```bash
POST /api/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sarah Chen",
  "email": "sarah.chen@techcorp.com",
  "phone": "+1 (555) 123-4567",
  "company": "TechCorp Inc",
  "role": "VP of Operations",
  "status": "new",
  "intentScore": 92,
  "source": "AI Chatbot",
  "aiSummary": "Ready to buy. Has asked about pricing twice."
}
```

### 4. Get Leads with Filters
```bash
GET /api/leads?status=qualified&intentRange=hot&page=1&limit=20
Authorization: Bearer <token>
```

### 5. Create an Appointment
```bash
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "leadId": "lead-uuid-here",
  "title": "Product Demo",
  "date": "2025-01-15",
  "time": "10:00:00",
  "duration": "30 min",
  "type": "video",
  "aiNote": "High intent - prepare pricing"
}
```

### 6. Create a Conversation
```bash
POST /api/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "leadId": "lead-uuid-here",
  "summary": "High-intent inquiry about enterprise pricing",
  "intentScore": 92,
  "sentiment": "positive"
}
```

### 7. Add a Message
```bash
POST /api/conversations/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "conversation-uuid-here",
  "role": "lead",
  "content": "Hi, I'm interested in learning more about your enterprise plans.",
  "aiInsightType": "intent",
  "aiInsightLabel": "High Intent",
  "aiInsightConfidence": 88
}
```

### 8. Get Dashboard Stats
```bash
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

### 9. Create a Tenant
```bash
POST /api/tenants
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Acme Corporation",
  "primaryColor": "222 47% 20%",
  "accentColor": "173 80% 40%",
  "fontFamily": "Inter",
  "welcomeMessage": "Welcome to Acme Corporation!",
  "chatbotName": "Acme Assistant",
  "chatbotAvatar": "https://example.com/avatar.png",
  "logo": "https://example.com/logo.png",
  "logomark": "https://example.com/logomark.png",
  "tenantSecret": "optional-secret-key"
}
```

### 10. Get All Tenants (Paginated)
```bash
GET /api/tenants?page=1&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "tenant-uuid",
      "name": "Acme Corporation",
      "primaryColor": "222 47% 20%",
      "accentColor": "173 80% 40%",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 11. Get Tenant by ID
```bash
GET /api/tenants/:id
Authorization: Bearer <token>
```

### 12. Update Tenant by ID
```bash
PATCH /api/tenants/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Company Name",
  "primaryColor": "222 47% 20%",
  "accentColor": "173 80% 40%"
}
```

### 13. Delete Tenant
```bash
DELETE /api/tenants/:id
Authorization: Bearer <token>
```

**Note:** Cannot delete a tenant that has associated users. Remove all users first.

### 14. Update Current Tenant Branding
```bash
PATCH /api/tenants/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "primaryColor": "222 47% 20%",
  "accentColor": "173 80% 40%",
  "chatbotName": "AI Assistant",
  "welcomeMessage": "Hi! How can I help you today?"
}
```

## Database Schema

The application uses the following main entities:

- **User**: Team members/users
- **Tenant**: Organizations/tenants with branding settings
- **Lead**: Potential customers
- **Conversation**: Chat conversations with leads
- **Message**: Individual messages in conversations
- **Appointment**: Scheduled meetings/appointments
- **LeadInsight**: AI-generated insights about leads
- **AutomationRule**: AI automation rules

Relations:
- Tenant has many Users, Leads, Conversations, AutomationRules
- Lead belongs to Tenant, can be assigned to User, has many Appointments, Conversations, Insights
- Conversation belongs to Lead and Tenant, has many Messages
- Appointment belongs to Lead

## Development

### Project Structure
```
backend/
├── src/
│   ├── entities/          # TypeORM entities
│   ├── auth/              # Authentication module
│   ├── leads/             # Leads module
│   ├── appointments/      # Appointments module
│   ├── conversations/     # Conversations module
│   ├── users/             # Users module
│   ├── analytics/         # Analytics module
│   ├── tenants/           # Tenants module
│   ├── ai-config/         # AI configuration module
│   ├── database/          # Database configuration
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── .env.example           # Environment variables template
└── README.md              # This file
```

### Running in Development
```bash
npm run start:dev
```

### Building for Production
```bash
npm run build
npm run start:prod
```

### Running Tests
```bash
npm run test
npm run test:e2e
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment (development/production) | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `DB_HOST` | MySQL host | localhost |
| `DB_PORT` | MySQL port | 3306 |
| `DB_USERNAME` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | - |
| `DB_DATABASE` | MySQL database name | kindred_lead_ai |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |

## Security Notes

1. **Change JWT_SECRET** in production to a strong, random string
2. **Use environment variables** for all sensitive configuration
3. **Enable HTTPS** in production
4. **Set NODE_ENV=production** in production
5. **Disable TypeORM synchronize** in production (use migrations instead)

## License

MIT
