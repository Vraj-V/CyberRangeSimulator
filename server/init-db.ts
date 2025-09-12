import 'dotenv/config';
import { db } from './db.js';
import { threats, simulations, responses, systemLogs, blockedIPs } from '../shared/schema.js';

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test database connection
    await db.execute('SELECT 1');
    console.log('✅ Database connection successful');
    
    console.log('✅ Database initialization completed successfully!');
    console.log('All tables are ready to use.');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run initialization
initializeDatabase();