import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const connectionString = process.env.DATABASE_URL;

// create SQL client with proper connection settings
const client = postgres(connectionString, { 
  ssl: 'require',
  max: 10, // maximum number of connections
  idle_timeout: 20, // close idle connections after 20 seconds
  connect_timeout: 10, // connection timeout in seconds
  prepare: false, // disable prepared statements for better compatibility
  transform: postgres.camel, // convert snake_case to camelCase
  onnotice: () => {}, // ignore notices
  debug: false, // disable debug mode for production
  connection: {
    application_name: 'CyberGuard'
  }
})

// create Drizzle instance
export const db = drizzle(client)

// Test connection function
export async function testConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.log('Database connection test failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}
