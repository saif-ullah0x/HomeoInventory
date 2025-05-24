// HomeoInvent Complete Database Export Tool
// Run this script before downloading your app as a ZIP file

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get current directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('================================================');
console.log('🌿 HomeoInvent Data Export Tool');
console.log('================================================');
console.log('This tool will export all your database data to JSON files');
console.log('These files will be included in your ZIP download');
console.log('================================================\n');

// Create exports directory
const exportDir = path.join(__dirname, 'exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
  console.log('✓ Created exports directory');
}

// Run the database export script
console.log('\n📊 Exporting database data...');
try {
  execSync('node utils/export-database.js', { stdio: 'inherit' });
  console.log('✓ Database exported successfully');
} catch (error) {
  console.error('❌ Database export failed. Please try again.');
  console.error('Error details:', error.message);
  process.exit(1);
}

// Create an SQL schema dump for reference
console.log('\n📝 Creating database schema SQL file...');
try {
  // Check if we have DB access before attempting schema export
  if (process.env.DATABASE_URL) {
    // Create a temporary script to generate schema
    const schemaScript = `
    const { pool } = require('./db');
    
    async function exportSchema() {
      try {
        // Query for table definitions
        const result = await pool.query(\`
          SELECT table_name, column_name, data_type, column_default, is_nullable
          FROM information_schema.columns
          WHERE table_schema = 'public'
          ORDER BY table_name, ordinal_position
        \`);
        
        // Format as SQL CREATE statements
        let schema = '-- HomeoInvent Database Schema\\n';
        let currentTable = '';
        
        for (const row of result.rows) {
          if (row.table_name !== currentTable) {
            if (currentTable) schema += '\\n);\\n\\n';
            currentTable = row.table_name;
            schema += \`CREATE TABLE \${row.table_name} (\\n\`;
          } else {
            schema += ',\\n';
          }
          
          // Format column definition
          schema += \`  \${row.column_name} \${row.data_type}\`;
          if (row.column_default) schema += \` DEFAULT \${row.column_default}\`;
          if (row.is_nullable === 'NO') schema += ' NOT NULL';
        }
        
        if (currentTable) schema += '\\n);';
        
        // Write to file
        require('fs').writeFileSync('exports/database-schema.sql', schema);
        console.log('✓ Schema exported to exports/database-schema.sql');
      } catch (error) {
        console.error('Schema export error:', error);
      } finally {
        pool.end();
      }
    }
    
    exportSchema();
    `;
    
    // Write and execute the temporary script
    fs.writeFileSync('temp-schema-export.js', schemaScript);
    execSync('node temp-schema-export.js', { stdio: 'inherit' });
    fs.unlinkSync('temp-schema-export.js');
  } else {
    console.log('⚠️ DATABASE_URL not found, skipping schema export');
  }
} catch (error) {
  console.log('⚠️ Schema export failed, but data export was successful');
  console.log('Error details:', error.message);
}

// Export package.json for dependency reference
console.log('\n📦 Copying package information...');
try {
  if (fs.existsSync('package.json')) {
    fs.copyFileSync('package.json', 'exports/package.json');
    console.log('✓ Package information copied');
  }
} catch (error) {
  console.log('⚠️ Could not copy package information');
}

console.log('\n🎉 Export completed successfully!');
console.log('\nNext steps:');
console.log('1. Download your project as a ZIP file');
console.log('2. Follow the setup instructions in README-DOWNLOAD-SETUP.md');
console.log('3. Import your data using utils/import-database.js');