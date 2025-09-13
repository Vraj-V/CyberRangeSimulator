import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Check if DATABASE_URL is available
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL environment variable not found. Running in demo mode without database.');
}

// create SQL client with proper connection settings (only if URL exists)
let client: any = null;
let db: any = null;

if (connectionString) {
  try {
    client = postgres(connectionString, { 
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
    });
    
    // create Drizzle instance
    db = drizzle(client);
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    client = null;
    db = null;
  }
}

// Export db (will be null if no connection)
export { db };

// Test connection function
export async function testConnection(): Promise<boolean> {
  if (!client) {
    console.log('Database connection test failed: No DATABASE_URL configured');
    return false;
  }
  
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.log('Database connection test failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}
