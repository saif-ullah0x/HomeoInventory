// HomeoInvent Database Export Utility (ES Module version)
// This script exports the PostgreSQL database to JSON files

import { pool } from '../db/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get current directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tables to export (based on your schema)
const TABLES = [
  'medicines',
  'users',
  'shared_inventories',
  'remedies',
  'learning_questions',
  'user_progress'
];

// Create exports directory if it doesn't exist
const exportDir = path.join(__dirname, '../exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

async function exportTable(tableName) {
  console.log(`Exporting table: ${tableName}...`);
  
  try {
    // Query all data from the table
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    
    // Write to JSON file
    const filePath = path.join(exportDir, `${tableName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(result.rows, null, 2));
    
    console.log(`✓ Exported ${result.rows.length} records from ${tableName}`);
    return result.rows.length;
  } catch (error) {
    // If table doesn't exist, just note it and continue
    if (error.code === '42P01') { // undefined_table error code
      console.log(`Table ${tableName} does not exist, skipping`);
      return 0;
    }
    console.error(`Error exporting ${tableName}:`, error.message);
    return 0;
  }
}

async function exportAllTables() {
  console.log('Starting database export...');
  
  const stats = {
    tablesExported: 0,
    recordsExported: 0,
    timestamp: new Date().toISOString()
  };
  
  // Export each table
  for (const table of TABLES) {
    const recordCount = await exportTable(table);
    if (recordCount > 0) {
      stats.tablesExported++;
      stats.recordsExported += recordCount;
    }
  }
  
  // Write export summary
  const summaryPath = path.join(exportDir, 'export-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(stats, null, 2));
  
  console.log('\nExport complete!');
  console.log(`Exported ${stats.recordsExported} records from ${stats.tablesExported} tables`);
  console.log(`Files saved to: ${exportDir}`);
}

// Run the export
exportAllTables().then(() => {
  console.log('Database export finished. You can now find your data in the exports folder.');
  pool.end();
}).catch(error => {
  console.error('Export failed:', error);
  pool.end();
});