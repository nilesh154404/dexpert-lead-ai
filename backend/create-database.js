/**
 * Script to create the MySQL database
 * Run with: node create-database.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
  };

  const databaseName = process.env.DB_DATABASE || 'kindred_lead_ai';

  try {
    console.log('Connecting to MySQL server...');
    const connection = await mysql.createConnection(config);
    console.log('✓ Connected to MySQL server');

    console.log(`Creating database '${databaseName}'...`);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✓ Database '${databaseName}' created successfully!`);

    await connection.end();
    console.log('\nDatabase setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating database:');
    console.error(error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n⚠️  Access denied. Please check your MySQL credentials in .env file:');
      console.error('   - DB_USERNAME');
      console.error('   - DB_PASSWORD');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Cannot connect to MySQL server. Please ensure MySQL is running.');
    }
    
    process.exit(1);
  }
}

createDatabase();
