// HomeoInvent Local Schema Creator
// This script creates the database schema in a local PostgreSQL database

const fs = require('fs');
const path = require('path');

// You'll need to modify this connection for your local environment
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'homeoinvent',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password' // Change this!
};

async function createSchema() {
  console.log('HomeoInvent Local Schema Creator');
  console.log('=================================');
  
  // Dynamically import pg to avoid issues if it's not installed
  let pg;
  try {
    pg = require('pg');
  } catch (error) {
    console.error('Error: pg package not found!');
    console.log('Please install it with: npm install pg');
    process.exit(1);
  }
  
  // Create connection
  const { Pool } = pg;
  const pool = new Pool(dbConfig);
  
  try {
    console.log(`Connecting to database: ${dbConfig.database}...`);
    await pool.query('SELECT 1'); // Test connection
    console.log('Connected successfully!');
    
    // Read schema SQL file if it exists
    const schemaPath = path.join(__dirname, '../exports/database-schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('Creating schema from exported SQL...');
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      
      // Split into individual statements and execute
      const statements = schemaSQL
        .split(';')
        .filter(stmt => stmt.trim())
        .map(stmt => stmt + ';');
      
      for (const stmt of statements) {
        try {
          await pool.query(stmt);
        } catch (error) {
          console.log(`Warning: Could not execute: ${stmt.slice(0, 50)}...`);
          console.log(`Error: ${error.message}`);
        }
      }
      
      console.log('Schema creation complete!');
    } else {
      console.log('Warning: Schema SQL file not found!');
      console.log('Using npm run db:push is recommended instead.');
    }
  } catch (error) {
    console.error('Error creating schema:', error.message);
  } finally {
    await pool.end();
  }
}

createSchema().then(() => {
  console.log('Schema creation process finished.');
  console.log('If there were any errors, try using:');
  console.log('npm run db:push');
  console.log('to create the schema instead.');
});