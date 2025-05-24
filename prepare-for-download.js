// HomeoInvent Download Preparation
// Run this script before downloading your app

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('================================================');
console.log('🌿 HomeoInvent Download Preparation');
console.log('================================================');
console.log('This tool prepares your app for download by:');
console.log('1. Exporting your database to portable files');
console.log('2. Creating setup instructions');
console.log('3. Preparing configuration files');
console.log('================================================\n');

// First, run the data export script
console.log('📊 Step 1: Exporting database data...');
try {
  execSync('node export-all-data.js', { stdio: 'inherit' });
  console.log('✓ Database export complete\n');
} catch (error) {
  console.error('❌ Database export failed');
  console.error('Error details:', error.message);
  process.exit(1);
}

// Create exports directory if not already done
const exportDir = path.join(__dirname, 'exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

// Create a manifest of files
console.log('📋 Step 2: Creating file manifest...');
try {
  const getFiles = (dir, baseDir = '') => {
    let results = [];
    const list = fs.readdirSync(path.join(baseDir, dir));
    
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(path.join(baseDir, fullPath));
      
      if (stat && stat.isDirectory() && 
          !fullPath.startsWith('node_modules') && 
          !fullPath.startsWith('.git')) {
        results = results.concat(getFiles(fullPath, baseDir));
      } else if (!fullPath.startsWith('node_modules') && 
                !fullPath.startsWith('.git')) {
        results.push(fullPath);
      }
    });
    
    return results;
  };
  
  const files = getFiles('.');
  fs.writeFileSync('exports/file-manifest.txt', files.join('\n'));
  console.log(`✓ Created manifest with ${files.length} files\n`);
} catch (error) {
  console.log('⚠️ Could not create file manifest');
}

// Copy the README and other important files to the exports directory
console.log('📝 Step 3: Copying documentation...');
try {
  const docsToExport = [
    'README-DOWNLOAD-SETUP.md',
    'README-LOCAL-DATABASE.md'
  ];
  
  docsToExport.forEach(doc => {
    if (fs.existsSync(doc)) {
      fs.copyFileSync(doc, path.join('exports', doc));
      console.log(`✓ Copied ${doc}`);
    }
  });
  
  // Create a master README in the exports folder
  const masterReadme = `# HomeoInvent Exported Data

This directory contains exported data from your HomeoInvent application.

## Contents

- Database exports in JSON format (one file per table)
- Database schema in SQL format
- Package information (dependencies)
- Setup instructions

## Setup Instructions

See the following files for detailed setup instructions:
- README-DOWNLOAD-SETUP.md - General setup guide
- README-LOCAL-DATABASE.md - Database setup guide

## Import Process

After setting up your local environment, run:
\`\`\`
node utils/import-database.js
\`\`\`

This will import your data into your local database.

---

Export created on: ${new Date().toISOString()}
`;

  fs.writeFileSync('exports/README.md', masterReadme);
  console.log('✓ Created master README\n');
} catch (error) {
  console.log('⚠️ Error copying documentation files');
}

console.log('🎉 Preparation complete!');
console.log('\nYour app is now ready for download as a ZIP file.');
console.log('Next steps:');
console.log('1. Download your project as a ZIP file');
console.log('2. Look for the exports folder in the ZIP file');
console.log('3. Follow the setup instructions in README-DOWNLOAD-SETUP.md');