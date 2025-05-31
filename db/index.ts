import dotenv from 'dotenv';
dotenv.config();
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// This is the correct way neon config - DO NOT change this
neonConfig.webSocketConstructor = ws;

// DOWNLOAD CONFIGURATION NOTE: 
// After downloading as ZIP, you'll need to either:
// 1. Update your DATABASE_URL environment variable with your own database connection string
// 2. Change the configuration in db/config.js to use a local PostgreSQL database

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// For local development after download, you can use this alternate configuration:
/*
// Uncomment and modify this section to use a local PostgreSQL database
import { Pool as PgPool } from 'pg';
import { drizzle as pgDrizzle } from 'drizzle-orm/pg-pool';

// Use local configuration
const localPool = new PgPool({
  host: 'localhost',
  port: 5432,
  database: 'homeoinvent',
  user: 'postgres',
  password: 'your_password_here' // Change this!
});

export const pool = localPool;
export const db = pgDrizzle(localPool, { schema });
*/