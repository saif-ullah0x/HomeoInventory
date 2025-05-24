# HomeoInvent Local Database Setup

This guide explains how to set up your HomeoInvent database locally after downloading the application.

## Understanding Your Database Options

HomeoInvent can work with two types of databases:

1. **Browser Database (IndexedDB)**: Built-in storage that works offline in your browser
2. **Server Database (PostgreSQL)**: Persistent storage that can be accessed across devices

## Option 1: Using Local PostgreSQL

### Prerequisites
- PostgreSQL installed on your computer
- Basic knowledge of database management

### Setup Steps

1. **Install PostgreSQL** if you haven't already:
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. **Create a new database**:
   ```sql
   CREATE DATABASE homeoinvent;
   ```

3. **Configure your connection**:
   - Copy `.env.local.template` to `.env`
   - Uncomment and update the local database settings:
     ```
     DB_ENV=local
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=homeoinvent
     DB_USER=postgres
     DB_PASSWORD=your_password
     ```

4. **Import your data**:
   ```
   node utils/import-database.js
   ```

## Option 2: Continue Using Neon Cloud Database

If you prefer to keep using a cloud database:

1. **Create a Neon account** at [neon.tech](https://neon.tech/)
2. **Create a new project and database**
3. **Get your connection string** from the Neon dashboard
4. **Update your environment**:
   - Copy `.env.local.template` to `.env`
   - Update the DATABASE_URL with your Neon connection string:
     ```
     DATABASE_URL=postgresql://username:password@your-neon-host/database
     ```

## Switching Between Database Types

HomeoInvent is designed to work seamlessly with both local and cloud databases:

1. **Update db/index.ts**:
   - For Neon: Use the default configuration
   - For local PostgreSQL: Uncomment the local configuration section

2. **Update your environment variables** as described above

## Troubleshooting

- **Connection Errors**: Verify your PostgreSQL server is running and credentials are correct
- **Missing Tables**: Run `npm run db:push` to create database tables
- **Import Failures**: Check that your export files exist in the `exports` directory

## Need More Help?

Refer to the PostgreSQL documentation or reach out to the HomeoInvent support team.