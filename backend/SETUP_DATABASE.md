# Database Setup Instructions

## Step 1: Create .env file

Create a `.env` file in the `backend` directory with your MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password_here
DB_DATABASE=kindred_lead_ai

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

## Step 2: Create the Database

Run the database creation script:

```bash
cd backend
node create-database.js
```

This will create the `kindred_lead_ai` database with the correct character set and collation.

## Alternative: Manual Database Creation

If you prefer to create the database manually using MySQL command line or MySQL Workbench:

```sql
CREATE DATABASE kindred_lead_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Step 3: Verify

After creating the database, you can verify it exists:

```bash
# Using MySQL command line (if available)
mysql -u root -p -e "SHOW DATABASES LIKE 'kindred_lead_ai';"
```

## Troubleshooting

- **Access denied error**: Check your MySQL password in the `.env` file
- **Connection refused**: Make sure MySQL server is running
- **Database already exists**: The script uses `CREATE DATABASE IF NOT EXISTS`, so it's safe to run multiple times
