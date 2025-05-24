#!/usr/bin/env node

/**
 * HomeoInvent Database Export for Download
 * This script exports all database tables to JSON files for offline use
 * Run with: node export-database-for-download.js
 */

const { Pool } = require('@neondatabase/serverless');
const fs = require('fs').promises;
const path = require('path');

// Create exports directory
const EXPORTS_DIR = './database-exports';

async function ensureExportsDirectory() {
  try {
    await fs.mkdir(EXPORTS_DIR, { recursive: true });
    console.log('✓ Created database-exports directory');
  } catch (error) {
    console.log('Directory already exists or created');
  }
}

async function exportTable(pool, tableName) {
  try {
    console.log(`Exporting ${tableName}...`);
    
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    const data = result.rows;
    
    // Write to JSON file
    await fs.writeFile(
      path.join(EXPORTS_DIR, `${tableName}.json`), 
      JSON.stringify(data, null, 2),
      'utf8'
    );
    
    console.log(`✓ Exported ${data.length} records from ${tableName}`);
    return data.length;
  } catch (error) {
    console.error(`Error exporting ${tableName}:`, error.message);
    return 0;
  }
}

async function exportSchema(pool) {
  try {
    console.log('Exporting database schema...');
    
    // Get table definitions
    const schemaQuery = `
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;
    
    const result = await pool.query(schemaQuery);
    
    await fs.writeFile(
      path.join(EXPORTS_DIR, 'schema-info.json'), 
      JSON.stringify(result.rows, null, 2),
      'utf8'
    );
    
    console.log('✓ Exported database schema information');
  } catch (error) {
    console.error('Error exporting schema:', error.message);
  }
}

async function createSQLDump(pool) {
  try {
    console.log('Creating SQL dump...');
    
    // Get all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);
    
    let sqlDump = `-- HomeoInvent Database Dump
-- Generated on ${new Date().toISOString()}
-- 
-- Instructions:
-- 1. Create a PostgreSQL database
-- 2. Run this script against the database
-- 3. Update your DATABASE_URL environment variable
--

`;

    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      
      // Get table structure
      const createTableResult = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position;
      `, [tableName]);
      
      sqlDump += `-- Table: ${tableName}\n`;
      
      // Get data
      const dataResult = await pool.query(`SELECT * FROM ${tableName}`);
      
      if (dataResult.rows.length > 0) {
        sqlDump += `-- Data for ${tableName}\n`;
        for (const row of dataResult.rows) {
          const columns = Object.keys(row).join(', ');
          const values = Object.values(row).map(val => 
            val === null ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`
          ).join(', ');
          
          sqlDump += `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`;
        }
        sqlDump += '\n';
      }
    }
    
    await fs.writeFile(
      path.join(EXPORTS_DIR, 'homeoinvent-database-dump.sql'),
      sqlDump,
      'utf8'
    );
    
    console.log('✓ Created SQL dump file');
  } catch (error) {
    console.error('Error creating SQL dump:', error.message);
  }
}

async function exportAllData() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🚀 Starting HomeoInvent database export...');
    console.log('📁 Exporting to:', EXPORTS_DIR);
    
    await ensureExportsDirectory();
    
    // List of tables to export
    const tables = [
      'medicines',
      'users', 
      'shared_inventories',
      'remedies',
      'learning_questions',
      'user_progress'
    ];
    
    let totalRecords = 0;
    
    // Export each table
    for (const table of tables) {
      const count = await exportTable(pool, table);
      totalRecords += count;
    }
    
    // Export schema information
    await exportSchema(pool);
    
    // Create SQL dump
    await createSQLDump(pool);
    
    // Create a summary file
    const summary = {
      exportDate: new Date().toISOString(),
      totalTables: tables.length,
      totalRecords: totalRecords,
      tables: tables,
      files: [
        ...tables.map(t => `${t}.json`),
        'schema-info.json',
        'homeoinvent-database-dump.sql'
      ]
    };
    
    await fs.writeFile(
      path.join(EXPORTS_DIR, 'export-summary.json'),
      JSON.stringify(summary, null, 2),
      'utf8'
    );
    
    console.log('\n🎉 Database export completed successfully!');
    console.log(`📊 Exported ${totalRecords} total records from ${tables.length} tables`);
    console.log(`📁 Files saved in: ${EXPORTS_DIR}/`);
    console.log('\nFiles created:');
    summary.files.forEach(file => console.log(`  - ${file}`));
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the export
if (require.main === module) {
  exportAllData();
}

module.exports = { exportAllData };