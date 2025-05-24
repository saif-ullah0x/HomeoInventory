# HomeoInvent - Local Setup Guide

Welcome to your HomeoInvent application export package! This guide will help you set up your HomeoInvent app on your local machine after downloading.

## Overview

HomeoInvent is an advanced homeopathic medicine learning and inventory management application that works offline-first. This export package contains:

- All application code (frontend and backend)
- Database exports for your data
- Configuration templates
- Setup guides and documentation

## Quick Start

1. **Export your data** (do this before downloading)
   ```
   node prepare-for-download.js
   ```

2. **Download** your project as a ZIP file

3. **Extract** the ZIP file to a location on your computer

4. **Install dependencies**
   ```
   npm install
   ```

5. **Configure your database**
   - Copy `.env.local.template` to `.env`
   - Update the database connection settings
   - See README-LOCAL-DATABASE.md for detailed options

6. **Import your data**
   ```
   node utils/import-database.js
   ```

7. **Start the application**
   ```
   npm run dev
   ```

8. **Access the app** at http://localhost:5000

## Detailed Setup Guides

For more detailed instructions, please refer to these guides:

- **General Setup**: [README-DOWNLOAD-SETUP.md](./README-DOWNLOAD-SETUP.md)
- **Database Setup**: [README-LOCAL-DATABASE.md](./README-LOCAL-DATABASE.md)

## Features

HomeoInvent includes:

- Complete homeopathic medicine inventory management
- AI-powered symptom analysis with remedy suggestions
- Cloud-based inventory sharing capabilities
- Offline-first architecture with local database
- Comprehensive remedy learning system

## Files You May Need to Modify

After downloading, you'll need to update these files:

- **Database Connection**: `db/index.ts` 
- **Environment Variables**: Create `.env` from the template
- **Import Configuration**: `utils/import-database.js`

## Technical Overview

- **Frontend**: React with Vite
- **Backend**: Express.js
- **Database**: PostgreSQL (cloud or local)
- **Client-side Storage**: IndexedDB
- **AI Integration**: For symptom analysis

## Need Help?

If you encounter any issues during setup, refer to the troubleshooting sections in the detailed guides mentioned above.

---

Thank you for using HomeoInvent! 🌿