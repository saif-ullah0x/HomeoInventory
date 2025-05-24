// HomeoInvent Database Export Script
// This standalone script exports your database to JSON files for download

import pkg from '@neondatabase/serverless';
const { Pool, neonConfig } = pkg;
import ws from 'ws';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Neon for WebSockets
neonConfig.webSocketConstructor = ws;

// Get database connection from environment variable
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Create exports directory
const exportDir = path.join(__dirname, 'exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
  console.log('✓ Created exports directory');
}

// Tables to export
const TABLES = [
  'medicines',
  'users',
  'shared_inventories',
  'remedies',
  'learning_questions',
  'user_progress'
];

// Connect to database
const pool = new Pool({ connectionString: dbUrl });

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

async function exportSchema() {
  console.log('Exporting database schema...');
  
  try {
    // Query for table definitions
    const result = await pool.query(`
      SELECT table_name, column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);
    
    // Format as SQL CREATE statements
    let schema = '-- HomeoInvent Database Schema\n';
    let currentTable = '';
    
    for (const row of result.rows) {
      if (row.table_name !== currentTable) {
        if (currentTable) schema += '\n);\n\n';
        currentTable = row.table_name;
        schema += `CREATE TABLE ${row.table_name} (\n`;
      } else {
        schema += ',\n';
      }
      
      // Format column definition
      schema += `  ${row.column_name} ${row.data_type}`;
      if (row.column_default) schema += ` DEFAULT ${row.column_default}`;
      if (row.is_nullable === 'NO') schema += ' NOT NULL';
    }
    
    if (currentTable) schema += '\n);';
    
    // Write to file
    fs.writeFileSync(path.join(exportDir, 'database-schema.sql'), schema);
    console.log('✓ Schema exported to exports/database-schema.sql');
  } catch (error) {
    console.error('Schema export error:', error);
  }
}

async function exportAllData() {
  console.log('================================================');
  console.log('🌿 HomeoInvent Database Export');
  console.log('================================================');
  
  const stats = {
    tablesExported: 0,
    recordsExported: 0,
    timestamp: new Date().toISOString()
  };
  
  try {
    // Export schema first
    await exportSchema();
    
    // Export each table
    for (const table of TABLES) {
      const recordCount = await exportTable(table);
      if (recordCount > 0) {
        stats.tablesExported++;
        stats.recordsExported += recordCount;
      }
    }
    
    // Write export summary
    fs.writeFileSync(
      path.join(exportDir, 'export-summary.json'), 
      JSON.stringify(stats, null, 2)
    );
    
    // Copy package.json for reference
    if (fs.existsSync('package.json')) {
      fs.copyFileSync('package.json', path.join(exportDir, 'package.json'));
      console.log('✓ Copied package.json for reference');
    }
    
    // Copy README files
    ['README-EXPORT.md', 'README-DOWNLOAD-SETUP.md', 'README-LOCAL-DATABASE.md'].forEach(file => {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(exportDir, file));
        console.log(`✓ Copied ${file}`);
      }
    });
    
    console.log('\n✅ Export complete!');
    console.log(`Exported ${stats.recordsExported} records from ${stats.tablesExported} tables`);
    console.log(`Files saved to: ${exportDir}`);
    
    // Create import instructions in exports folder
    const importInstructions = `# HomeoInvent Exported Data

This directory contains your exported HomeoInvent data from ${new Date().toLocaleDateString()}.

## Contents
- Database tables exported as JSON files
- Database schema as SQL
- Package information (for dependencies)
- Setup instructions

## After Download
1. Extract the ZIP file
2. Follow instructions in README-DOWNLOAD-SETUP.md

## Next Steps
The exported data can be imported to a local PostgreSQL database
using the utils/import-database.js script.

Enjoy your HomeoInvent app locally! 🌿
`;
    
    fs.writeFileSync(path.join(exportDir, 'README.md'), importInstructions);
    
  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    await pool.end();
  }
}

// Run the export
exportAllData();