
/**
 * HomeoInvent Database Configuration
 * 
 * This file provides database connection options for both development and production.
 * After downloading the app as a ZIP, modify this file to connect to your local or cloud database.
 */

// Configuration options
//const DB_CONFIG = {
  // CURRENT ENVIRONMENT
  // Set to 'local' after downloading the ZIP to use a local PostgreSQL database
  // Set to 'neon' to use Neon serverless PostgreSQL
  //environment: process.env.DB_ENV || 'firebase',
  
  // LOCAL DATABASE CONFIGURATION
  // Update these values for your local PostgreSQL installation
 /* local: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'homeoinvent',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'your_password', // Change this!
  },
  */
  // NEON SERVERLESS CONFIGURATION
  // The current Neon connection string is in the DATABASE_URL environment variable
  // After downloading, update this with your own Neon connection if continuing to use Neon
  //neon: {
  //  connectionString: process.env.DATABASE_URL,// || 'postgresql://user:password@host/database'
  //}
//};

/**
 * Get the database configuration based on environment
  // @returns {Object} Database configuration
 
function getDatabaseConfig() {
  // When using Neon, we need the complete connection string
  if (DB_CONFIG.environment === 'neon') {
    return { connectionString: DB_CONFIG.neon.connectionString };
  }
  
  // For local PostgreSQL, we use individual connection parameters
  return {
    host: DB_CONFIG.local.host,
    port: DB_CONFIG.local.port,
    database: DB_CONFIG.local.database,
    user: DB_CONFIG.local.user,
    password: DB_CONFIG.local.password
  };
}

module.exports = {
  DB_CONFIG,
  getDatabaseConfig
};
*/