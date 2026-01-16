# Login Flow Troubleshooting Guide

This guide helps you debug and fix login issues in the Kindred Lead AI application.

---

## 🔍 Quick Diagnosis Checklist

### Step 1: Verify Database is Running
```bash
# Check if MySQL is running
mysql -u root -p

# Or on Windows
# Check Services for MySQL
```

### Step 2: Verify Database Exists
```sql
SHOW DATABASES;
-- Should see 'kindred_lead_ai'

USE kindred_lead_ai;
SHOW TABLES;
-- Should see: users, tenants, leads, etc.
```

### Step 3: Check if Demo Users Exist
```sql
USE kindred_lead_ai;
SELECT email, role, status FROM users;

-- Expected output:
-- superadmin@kindred.com | super_admin | active
-- john@techcorp.com      | organisation | active
-- jane@techcorp.com      | sales        | active
-- ... etc
```

### Step 4: Verify Passwords are Hashed
```sql
SELECT email, LEFT(password, 20) as password_preview FROM users;

-- Passwords should start with: $2b$10$...
-- If they don't, passwords are NOT hashed correctly
```

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Invalid credentials" Error

**Symptoms:**
- Login returns 401 Unauthorized
- Error message: "Invalid credentials"

**Causes:**
1. User doesn't exist in database
2. Password is incorrect
3. Password not hashed (plain text in database)
4. Database connection issues

**Solutions:**

1. **Run Seed Script:**
   ```bash
   cd backend
   npm run seed
   ```

2. **Verify User Exists:**
   ```sql
   SELECT * FROM users WHERE email = 'superadmin@kindred.com';
   ```

3. **Verify Password is Hashed:**
   ```sql
   SELECT email, password FROM users WHERE email = 'superadmin@kindred.com';
   -- Password should start with $2b$10$
   ```

4. **Re-create User with Hashed Password:**
   ```bash
   # Re-run seed script
   npm run seed
   ```

---

### Issue 2: "Account is not active" Error

**Symptoms:**
- Login returns 401 with message "Account is not active"

**Cause:**
- User status is not 'active'

**Solution:**

1. **Check User Status:**
   ```sql
   SELECT email, status FROM users WHERE email = 'your-email@example.com';
   ```

2. **Update Status to Active:**
   ```sql
   UPDATE users SET status = 'active' WHERE email = 'your-email@example.com';
   ```

---

### Issue 3: CORS Error

**Symptoms:**
- Browser console shows CORS error
- Network tab shows preflight request failing

**Solution:**

1. **Check Backend CORS Configuration:**
   - File: `backend/src/main.ts`
   - Should allow your frontend origin (e.g., `http://localhost:5173`)

2. **Check Environment Variables:**
   ```bash
   # backend/.env should have:
   FRONTEND_URLS=http://localhost:5173,http://localhost:8080
   ```

3. **Restart Backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

---

### Issue 4: Token Not Stored / Login Succeeds but Redirects to Login

**Symptoms:**
- Login API call succeeds
- User immediately redirected back to login page

**Causes:**
1. Token not saved to localStorage
2. AuthContext not reading token
3. Token format incorrect

**Solutions:**

1. **Check Browser Console:**
   ```javascript
   // In browser console:
   localStorage.getItem('auth_token')
   localStorage.getItem('user')
   ```

2. **Verify Token Format:**
   - Token should be a JWT string (starts with `eyJ...`)

3. **Check AuthContext:**
   - File: `kindred-lead-ai-main/src/contexts/AuthContext.tsx`
   - Should load from localStorage on mount

---

### Issue 5: Database Connection Failed

**Symptoms:**
- Seed script fails
- Backend can't connect to database
- Error: "ECONNREFUSED" or "Access denied"

**Solutions:**

1. **Check MySQL is Running:**
   ```bash
   # Linux/Mac
   sudo systemctl status mysql
   
   # Windows - Check Services
   ```

2. **Verify Database Credentials:**
   - File: `backend/.env` or defaults in `database-config.service.ts`
   - Default: `root` / `aayush` / `kindred_lead_ai`

3. **Create Database if Missing:**
   ```sql
   CREATE DATABASE IF NOT EXISTS kindred_lead_ai;
   ```

4. **Grant Permissions:**
   ```sql
   GRANT ALL PRIVILEGES ON kindred_lead_ai.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

## 🧪 Testing Login Flow

### Test 1: Verify Seed Data
```bash
cd backend
npm run seed

# Expected output:
# ✓ Super Admin created: superadmin@kindred.com / superadmin123
# ✓ Organisation 1 created: TechCorp Solutions
# ✓ Organisation 2 created: GreenLeaf Health
# ... etc
```

### Test 2: Test Login API Directly
```bash
# Using curl:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@kindred.com","password":"superadmin123"}'

# Expected response:
# {
#   "access_token": "eyJ...",
#   "id": "...",
#   "email": "superadmin@kindred.com",
#   "role": "super_admin",
#   ...
# }
```

### Test 3: Test Frontend Login
1. Start frontend: `cd kindred-lead-ai-main && npm run dev`
2. Navigate to `http://localhost:5173/login`
3. Use demo credentials:
   - Email: `superadmin@kindred.com`
   - Password: `superadmin123`
4. Should redirect to dashboard after successful login

---

## 📋 Debug Checklist

Before reporting an issue, verify:

- [ ] MySQL database is running
- [ ] Database `kindred_lead_ai` exists
- [ ] Seed script ran successfully (`npm run seed`)
- [ ] Users exist in database (`SELECT * FROM users;`)
- [ ] Passwords are hashed (start with `$2b$10$`)
- [ ] User status is `active`
- [ ] Backend server is running (`npm run start:dev`)
- [ ] Frontend server is running (`npm run dev`)
- [ ] CORS is configured correctly
- [ ] No console errors in browser
- [ ] Network tab shows successful login API call
- [ ] Token is stored in localStorage
- [ ] AuthContext loads token on page load

---

## 🔧 Manual Database Fixes

### Reset All Users
```sql
USE kindred_lead_ai;
DELETE FROM leads;
DELETE FROM users;
DELETE FROM tenants;
```

Then run: `npm run seed`

### Fix Single User Password
```bash
# Generate bcrypt hash (Node.js):
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('newpassword', 10).then(h => console.log(h));"

# Update in database:
UPDATE users SET password = '<generated_hash>' WHERE email = 'user@example.com';
```

### Activate User
```sql
UPDATE users SET status = 'active' WHERE email = 'user@example.com';
```

---

## 📞 Getting Help

If issues persist:

1. Check backend logs: `backend` terminal output
2. Check frontend console: Browser DevTools
3. Check network tab: Failed API requests
4. Verify all dependencies installed: `npm install` in both directories
5. Check database logs: MySQL error log

---

## ✅ Success Indicators

Login is working correctly when:

1. ✅ Seed script completes without errors
2. ✅ Login API returns 200 with `access_token`
3. ✅ Token is stored in localStorage
4. ✅ User redirected to dashboard
5. ✅ Dashboard shows user name/email
6. ✅ API calls include `Authorization: Bearer <token>` header
7. ✅ No CORS errors in console
8. ✅ Protected routes accessible

---

## 🎯 Quick Fix Commands

```bash
# Full reset (WARNING: Deletes all data)
cd backend
npm run seed

# Check backend is running
curl http://localhost:3000/api

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@kindred.com","password":"superadmin123"}'

# Clear frontend storage
# In browser console:
localStorage.clear();
location.reload();
```
