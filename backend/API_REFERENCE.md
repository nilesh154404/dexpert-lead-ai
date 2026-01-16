# API Quick Reference Guide

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "tenantId": "default"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Returns user object with `access_token`

---

## Leads Endpoints

### List Leads
```http
GET /leads?search=keyword&status=qualified&intentRange=hot&page=1&limit=20
```

### Get Hot Leads
```http
GET /leads/hot?limit=5
```

### Get Lead
```http
GET /leads/:id
```

### Create Lead
```http
POST /leads
Content-Type: application/json

{
  "name": "Sarah Chen",
  "email": "sarah@example.com",
  "phone": "+1234567890",
  "company": "TechCorp",
  "status": "new",
  "intentScore": 85,
  "source": "AI Chatbot",
  "aiSummary": "High-intent lead"
}
```

### Update Lead
```http
PATCH /leads/:id
Content-Type: application/json

{
  "status": "qualified",
  "intentScore": 92
}
```

### Delete Lead
```http
DELETE /leads/:id
```

---

## Appointments Endpoints

### List Appointments
```http
GET /appointments?startDate=2025-01-01&endDate=2025-01-31
```

### Get Lead Appointments
```http
GET /appointments/lead/:leadId
```

### Get Appointment
```http
GET /appointments/:id
```

### Create Appointment
```http
POST /appointments
Content-Type: application/json

{
  "leadId": "lead-uuid",
  "title": "Product Demo",
  "date": "2025-01-15",
  "time": "10:00:00",
  "duration": "30 min",
  "type": "video",
  "status": "scheduled"
}
```

### Update Appointment
```http
PATCH /appointments/:id
Content-Type: application/json

{
  "status": "completed"
}
```

### Delete Appointment
```http
DELETE /appointments/:id
```

---

## Conversations Endpoints

### List Conversations
```http
GET /conversations?leadId=lead-uuid
```

### Get Conversation
```http
GET /conversations/:id
```

### Get Conversation Messages
```http
GET /conversations/:id/messages
```

### Create Conversation
```http
POST /conversations
Content-Type: application/json

{
  "leadId": "lead-uuid",
  "summary": "High-intent inquiry",
  "intentScore": 92,
  "sentiment": "positive"
}
```

### Add Message
```http
POST /conversations/messages
Content-Type: application/json

{
  "conversationId": "conversation-uuid",
  "role": "lead",
  "content": "Hello, I'm interested",
  "aiInsightType": "intent",
  "aiInsightLabel": "High Intent",
  "aiInsightConfidence": 88
}
```

### Update Conversation
```http
PATCH /conversations/:id
Content-Type: application/json

{
  "humanCorrection": "AI missed competitor mention"
}
```

### Delete Conversation
```http
DELETE /conversations/:id
```

---

## Users Endpoints

### List Users
```http
GET /users
```

### Get User
```http
GET /users/:id
```

### Create User
```http
POST /users
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "sales",
  "department": "Sales"
}
```

### Update User
```http
PATCH /users/:id
Content-Type: application/json

{
  "role": "manager",
  "department": "Sales"
}
```

### Delete User
```http
DELETE /users/:id
```

---

## Analytics Endpoints

### Dashboard Stats
```http
GET /analytics/dashboard
```

### Lead Sources
```http
GET /analytics/lead-sources
```

### Leads Over Time
```http
GET /analytics/leads-over-time?months=6
```

---

## Tenants Endpoints

### Get Tenant Settings
```http
GET /tenants/me
```

### Update Tenant Settings
```http
PATCH /tenants/me
Content-Type: application/json

{
  "primaryColor": "222 47% 20%",
  "accentColor": "173 80% 40%",
  "chatbotName": "AI Assistant",
  "welcomeMessage": "Hi! How can I help?"
}
```

---

## AI Config Endpoints

### List Automation Rules
```http
GET /ai-config/rules
```

### Get Rule
```http
GET /ai-config/rules/:id
```

### Create Rule
```http
POST /ai-config/rules
Content-Type: application/json

{
  "name": "Auto-qualify high intent",
  "description": "Auto-qualify leads with intent > 85%",
  "enabled": true,
  "condition": "Intent score > 85%",
  "action": "Move to Qualified stage"
}
```

### Update Rule
```http
PATCH /ai-config/rules/:id
Content-Type: application/json

{
  "enabled": false
}
```

### Delete Rule
```http
DELETE /ai-config/rules/:id
```

---

## Response Formats

### Success Response
```json
{
  "id": "uuid",
  "field1": "value1",
  "field2": "value2",
  ...
}
```

### Paginated Response
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

## Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Swagger Documentation

Full interactive API documentation available at:
```
http://localhost:3000/api/docs
```
