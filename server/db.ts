import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const connectionString = process.env.DATABASE_URL;

// create SQL client
const client = postgres(connectionString, { ssl: 'require' })

// create Drizzle instance
export const db = drizzle(client)
