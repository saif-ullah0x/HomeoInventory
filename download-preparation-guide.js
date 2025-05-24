// HomeoInvent Download Preparation Guide
// This script will help prepare your app structure for download

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create exports directory
const exportDir = path.join(__dirname, 'exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
  console.log('✓ Created exports directory');
}

// Prepare README files and instructions
console.log('================================================');
console.log('🌿 HomeoInvent Download Preparation Guide');
console.log('================================================');

// Copy all README files to exports directory
const readmeFiles = [
  'README-EXPORT.md', 
  'README-DOWNLOAD-SETUP.md', 
  'README-LOCAL-DATABASE.md'
];

readmeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(exportDir, file));
    console.log(`✓ Copied ${file} to exports directory`);
  }
});

// Create main README file for exports directory
const mainReadme = `# HomeoInvent Exported Data Guide

This directory contains essential files and instructions for setting up your HomeoInvent app locally.

## Database Export Instructions

Since the automated export encountered issues, follow these manual steps to export your database:

### Option 1: Export using SQL (recommended)

1. Visit your Neon database dashboard
2. Go to the Tables section
3. For each table, click the "..." menu and select "Export as SQL" or "Export as CSV"
4. Save each exported file in this 'exports' directory

### Option 2: Use Drizzle Studio

1. Run \`npx drizzle-kit studio\` in your project
2. Export the data for each table
3. Save the exports in this directory

## After Download

Once you've downloaded your project as a ZIP file:

1. Extract the ZIP file to a location on your computer
2. Follow the setup instructions in README-DOWNLOAD-SETUP.md
3. Import your data using the instructions in README-LOCAL-DATABASE.md

## Tables To Export

Be sure to export these tables:
- medicines
- users
- shared_inventories
- remedies
- learning_questions
- user_progress

## Need Help?

Refer to the detailed instructions in the README files or contact support.

---

Guide created on: ${new Date().toISOString()}
`;

fs.writeFileSync(path.join(exportDir, 'README.md'), mainReadme);
console.log('✓ Created main README.md in exports directory');

// Copy package.json for reference
if (fs.existsSync('package.json')) {
  fs.copyFileSync('package.json', path.join(exportDir, 'package.json'));
  console.log('✓ Copied package.json for reference');
}

// Create a blank schema file as a template
const schemaTemplate = `-- HomeoInvent Database Schema
-- Replace this with your actual schema from Neon dashboard

CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  -- Add other columns here
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  -- Add other columns here
);

-- Add other tables as needed
`;

fs.writeFileSync(path.join(exportDir, 'database-schema-template.sql'), schemaTemplate);
console.log('✓ Created database schema template');

// Create a manifest file of important code files
console.log('\nGenerating project file manifest...');
const getFiles = (dir, baseDir = '', ignore = []) => {
  let results = [];
  if (ignore.some(i => dir.includes(i))) return results;
  
  try {
    const list = fs.readdirSync(path.join(baseDir, dir));
    
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      if (ignore.some(i => fullPath.includes(i))) return;
      
      try {
        const stat = fs.statSync(path.join(baseDir, fullPath));
        
        if (stat && stat.isDirectory()) {
          results = results.concat(getFiles(fullPath, baseDir, ignore));
        } else {
          results.push(fullPath);
        }
      } catch (e) {
        // Skip files that can't be accessed
      }
    });
  } catch (e) {
    // Skip directories that can't be accessed
  }
  
  return results;
};

// Ignore directories that aren't needed for the download
const ignoreList = [
  'node_modules', '.git', '.replit', '.config', 
  '.upm', '.cache', '.vscode', 'exports'
];

try {
  const files = getFiles('.', '', ignoreList);
  fs.writeFileSync(
    path.join(exportDir, 'file-manifest.txt'), 
    files.join('\n')
  );
  console.log(`✓ Created file manifest with ${files.length} files`);
} catch (error) {
  console.log('⚠️ Could not generate complete file manifest');
}

// Create a .env template file
const envTemplate = `# HomeoInvent Environment Configuration
# Copy this file to .env after downloading

# Database Connection
# Option 1: Use this for Neon Serverless (cloud)
DATABASE_URL=postgresql://username:password@your-neon-host/database

# Option 2: Use these for local PostgreSQL (uncomment and modify)
# DB_ENV=local
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=homeoinvent
# DB_USER=postgres
# DB_PASSWORD=your_password

# App Configuration
PORT=5000
NODE_ENV=development
`;

fs.writeFileSync(path.join(exportDir, '.env.template'), envTemplate);
console.log('✓ Created environment template file');

console.log('\n🎉 Download preparation complete!');
console.log('\nNext steps:');
console.log('1. Export your database data using the Neon dashboard or Drizzle Studio');
console.log('2. Download your project as a ZIP file');
console.log('3. Follow the setup instructions in the README files');