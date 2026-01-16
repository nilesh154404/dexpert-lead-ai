# Demo Login Credentials

This document contains all demo user credentials for testing the Kindred Lead AI application.

## 🔐 How to Seed Database

Before using these credentials, you must run the seed script to populate the database:

```bash
cd backend
npm run seed
```

**Note:** Make sure your MySQL database is running and the connection details in `.env` (or defaults) are correct.

---

## 👥 User Credentials

### Super Admin
- **Email:** `superadmin@kindred.com`
- **Password:** `superadmin123`
- **Role:** `SUPER_ADMIN`
- **Access:** Can view all organizations and leads across the system

---

### Organization Admin - TechCorp Solutions
- **Email:** `john@techcorp.com`
- **Password:** `admin123`
- **Role:** `ORGANISATION`
- **Organization:** TechCorp Solutions (org-techcorp)
- **Access:** Full access to TechCorp Solutions data only

---

### Organization Admin - GreenLeaf Health
- **Email:** `emily@greenleaf.com`
- **Password:** `admin123`
- **Role:** `ORGANISATION`
- **Organization:** GreenLeaf Health (org-greenleaf)
- **Access:** Full access to GreenLeaf Health data only

---

### Staff Users (TechCorp Solutions)

All TechCorp staff users share the password: **`staff123`**

1. **Sales Staff**
   - **Email:** `jane@techcorp.com`
   - **Password:** `staff123`
   - **Role:** `SALES`
   - **Department:** Sales

2. **Manager**
   - **Email:** `mike@techcorp.com`
   - **Password:** `staff123`
   - **Role:** `MANAGER`
   - **Department:** Sales

3. **Support Staff**
   - **Email:** `sarah@techcorp.com`
   - **Password:** `staff123`
   - **Role:** `SUPPORT`
   - **Department:** Support

---

### Staff Users (GreenLeaf Health)

All GreenLeaf staff users share the password: **`staff123`**

1. **Sales Staff**
   - **Email:** `david@greenleaf.com`
   - **Password:** `staff123`
   - **Role:** `SALES`
   - **Department:** Sales

2. **Manager**
   - **Email:** `lisa@greenleaf.com`
   - **Password:** `staff123`
   - **Role:** `MANAGER`
   - **Department:** Sales

---

## 🧪 Testing Different Roles

### Test Super Admin Access
1. Login with `superadmin@kindred.com` / `superadmin123`
2. Should see all organizations and leads
3. Can access all features across all tenants

### Test Organization Admin Access
1. Login with `john@techcorp.com` / `admin123`
2. Should only see TechCorp Solutions data
3. Cannot access GreenLeaf Health data

### Test Staff Access
1. Login with `jane@techcorp.com` / `staff123`
2. Should only see TechCorp Solutions data
3. Limited permissions based on role (SALES)

### Test Multi-Tenant Isolation
1. Login as `john@techcorp.com` - see only TechCorp leads
2. Logout and login as `emily@greenleaf.com` - see only GreenLeaf leads
3. Verify data isolation works correctly

---

## 🔄 Resetting Demo Data

To reset all demo data, simply run the seed script again:

```bash
cd backend
npm run seed
```

**Warning:** This will delete all existing data and recreate demo users, organizations, and leads.

---

## 🐛 Troubleshooting

### Login Fails
1. Verify database is running: `mysql -u root -p`
2. Check database exists: `SHOW DATABASES;` (should see `kindred_lead_ai`)
3. Verify seed script ran successfully: `npm run seed`
4. Check users table: `SELECT email, role, status FROM users;`

### Password Not Working
1. Ensure seed script used bcrypt to hash passwords
2. Verify password in database is hashed (should start with `$2b$10$...`)
3. Re-run seed script to reset passwords

### Database Connection Issues
1. Check `.env` file in `backend/` directory
2. Verify MySQL credentials match your setup
3. Default credentials: `root` / `aayush` (if no .env file)

---

## 📝 Notes

- All passwords are hashed using bcrypt with salt rounds of 10
- All users have status `ACTIVE` by default
- Organizations are created with UUIDs for IDs
- Sample leads are automatically assigned to organizations
- Super Admin has tenantId `'system'` (does not belong to any organization)
