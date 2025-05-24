// HomeoInvent Download Preparation Utility
// This script prepares your app for download by:
// 1. Exporting the database to JSON files
// 2. Creating necessary directories and configuration files
// 3. Generating a download-ready version of your app

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('============================================');
console.log('🌿 HomeoInvent Download Preparation Utility');
console.log('============================================');

// Create exports directory if it doesn't exist
const exportDir = path.join(__dirname, '../exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
  console.log('✓ Created exports directory');
}

// Export the database
console.log('\n📦 Exporting database...');
try {
  execSync('node utils/export-database.js', { stdio: 'inherit' });
  console.log('✓ Database exported successfully');
} catch (error) {
  console.error('❌ Database export failed:', error.message);
  process.exit(1);
}

// Create a simple script to check if everything was exported correctly
const checkExportsScript = `
console.log('Checking exports directory:');
const fs = require('fs');
const path = require('path');
const exportDir = path.join(__dirname, '../exports');

if (!fs.existsSync(exportDir)) {
  console.log('❌ Exports directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(exportDir);
console.log(\`Found \${files.length} files in exports directory:\`);
files.forEach(file => console.log(\` - \${file}\`));

// Check if we have at least the summary file
if (!files.includes('export-summary.json')) {
  console.log('❌ Export summary file not found!');
  process.exit(1);
}

console.log('✓ Export check complete');
`;

fs.writeFileSync(path.join(__dirname, 'check-exports.js'), checkExportsScript);
console.log('✓ Created export verification script');

// Create a .env.local template file for local setup
const envLocalTemplate = `# HomeoInvent Local Environment Configuration
# Copy this file to .env after downloading the ZIP

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

fs.writeFileSync(path.join(__dirname, '../.env.local.template'), envLocalTemplate);
console.log('✓ Created environment template file');

console.log('\n🎉 Preparation complete!');
console.log('\nNext steps:');
console.log('1. Make sure all exports were created correctly');
console.log('2. Download the entire project as a ZIP file');
console.log('3. Follow the setup instructions in README-DOWNLOAD-SETUP.md');