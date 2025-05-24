// Database Import Utility for HomeoInvent
// This script imports database data from JSON files into a local PostgreSQL database

const fs = require('fs');
const path = require('path');

// IMPORTANT: Update this to your local database connection
// This is where you'll need to change the connection after downloading
let pool;

// Function to initialize the database connection
function initDatabase() {
  try {
    // CHANGE THIS SECTION for your local database
    // ==========================================
    // Option 1: Use local PostgreSQL
    const { Pool } = require('pg');
    pool = new Pool({
      // Update these values for your local PostgreSQL installation
      host: 'localhost',
      port: 5432,
      database: 'homeoinvent',
      user: 'postgres',
      password: 'your_password'  // Change this!
    });
    
    // Option 2: Continue using Neon serverless (if you prefer)
    // Uncomment and modify this code:
    /*
    const { Pool, neonConfig } = require('@neondatabase/serverless');
    const ws = require('ws');
    neonConfig.webSocketConstructor = ws;
    
    pool = new Pool({ 
      connectionString: 'postgresql://your-username:your-password@your-neon-host/your-database'
    });
    */
    // ==========================================
    
    console.log('Database connection initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}

// Tables to import (must match export order)
const TABLES = [
  'medicines',
  'users',
  'shared_inventories',
  'remedies',
  'learning_questions',
  'user_progress'
];

// Import a single table
async function importTable(tableName) {
  console.log(`Importing table: ${tableName}...`);
  
  const filePath = path.join(__dirname, '../exports', `${tableName}.json`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`No data file found for ${tableName}, skipping`);
    return 0;
  }
  
  try {
    // Read the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.length) {
      console.log(`No records found for ${tableName}, skipping`);
      return 0;
    }
    
    // For each record, insert into the database
    let successCount = 0;
    
    for (const record of data) {
      // Extract column names and values
      const columns = Object.keys(record);
      const values = Object.values(record);
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
      
      // Build the query
      const query = `
        INSERT INTO ${tableName} (${columns.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT DO NOTHING;
      `;
      
      // Execute the query
      await pool.query(query, values);
      successCount++;
    }
    
    console.log(`✓ Imported ${successCount} records into ${tableName}`);
    return successCount;
  } catch (error) {
    console.error(`Error importing ${tableName}:`, error.message);
    return 0;
  }
}

// Import all tables
async function importAllTables() {
  console.log('Starting database import...');
  
  // Initialize database connection
  if (!initDatabase()) {
    console.error('Failed to initialize database connection. Please update your connection settings.');
    return;
  }
  
  const stats = {
    tablesImported: 0,
    recordsImported: 0,
    timestamp: new Date().toISOString()
  };
  
  // Import each table
  for (const table of TABLES) {
    const recordCount = await importTable(table);
    if (recordCount > 0) {
      stats.tablesImported++;
      stats.recordsImported += recordCount;
    }
  }
  
  console.log('\nImport complete!');
  console.log(`Imported ${stats.recordsImported} records into ${stats.tablesImported} tables`);
}

// Run the import
importAllTables().then(() => {
  console.log('Database import finished.');
  if (pool) pool.end();
}).catch(error => {
  console.error('Import failed:', error);
  if (pool) pool.end();
});