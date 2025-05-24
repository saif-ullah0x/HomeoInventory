# HomeoInvent Local Setup Guide

This guide will help you set up and run your HomeoInvent application locally after downloading it as a ZIP file.

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL (local installation) or a Neon account (cloud option)
- Basic familiarity with the command line

## Setup Steps

### 1. Database Setup

You have two options for setting up your database:

#### Option A: Use Local PostgreSQL

1. Install PostgreSQL on your machine if not already installed
2. Create a new database:
   ```sql
   CREATE DATABASE homeoinvent;
   ```
3. Update the database connection in `utils/import-database.js` with your local credentials
4. Run the import script:
   ```
   node utils/import-database.js
   ```

#### Option B: Use Neon Serverless (Cloud Option)

1. Create an account at https://neon.tech if you don't have one
2. Create a new project and database
3. Get your connection string from the Neon dashboard
4. Update the connection string in `db/index.ts` AND `utils/import-database.js`

### 2. Environment Setup

1. Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/homeoinvent
   ```
   (Replace with your actual database connection string)

2. Install dependencies:
   ```
   npm install
   ```

### 3. Database Schema Update

If you're using a fresh database (without importing):

1. Run the schema update:
   ```
   npm run db:push
   ```

2. Seed the database with initial data:
   ```
   npm run db:seed
   ```

### 4. Start the Application

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Important File Locations

Here are the key files you might need to modify after downloading:

- **Database Connection**: `db/index.ts` - Update the connection string
- **Data Import/Export**: `utils/import-database.js` - Set your local database credentials
- **Frontend API Calls**: `client/src/lib/api.ts` - Make sure API paths match your local setup

## Offline Mode

HomeoInvent includes an offline-first approach with IndexedDB:

1. Data is stored locally in your browser using IndexedDB
2. When online, it can sync with the server database
3. The app will function even without an internet connection

## Troubleshooting

- **Database Connection Issues**: Verify your PostgreSQL service is running and credentials are correct
- **Missing Tables**: Run `npm run db:push` to create any missing tables
- **Import Errors**: Check that the export files exist in the `exports` directory

## Need Help?

Refer to the original documentation or reach out to the HomeoInvent support team.

---

Happy HomeoInventing! 🌿