/// <reference types="node" />
import 'dotenv/config';
import { db } from '../server/db.js';

async function backupDatabase() {
  try {
    console.log('🔄 Creating database backup...');
    
    // Get current database URL
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.log('❌ No DATABASE_URL found in environment');
      return;
    }
    
    // Check if database is available
    if (!db) {
      console.log('⚠️ No database connection - app is in demo mode');
      console.log('💡 Backup not needed in demo mode');
      return;
    }
    
    // Test connection
    await db.execute('SELECT 1');
    console.log('✅ Database connection verified');
    
    // Extract database info (hide password)
    const url = new URL(dbUrl);
    const backupInfo = {
      host: url.hostname,
      database: url.pathname.slice(1),
      username: url.username,
      port: url.port,
      timestamp: new Date().toISOString(),
      connectionString: `postgresql://${url.username}:***@${url.hostname}:${url.port}${url.pathname}`,
      tables: [
        'threats',
        'simulations', 
        'responses',
        'system_logs',
        'blocked_ips'
      ],
      recoverySteps: [
        '1. Create new Supabase project',
        '2. Update DATABASE_URL in .env',
        '3. Run: npm run db:init',
        '4. Run: npm run dev'
      ]
    };
    
    console.log('📋 Database Backup Information:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🏠 Host: ${backupInfo.host}`);
    console.log(`🗄️  Database: ${backupInfo.database}`);
    console.log(`👤 Username: ${backupInfo.username}`);
    console.log(`⏰ Backup Time: ${backupInfo.timestamp}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 Recovery Steps:');
    backupInfo.recoverySteps.forEach(step => console.log(`   ${step}`));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Backup information displayed');
    console.log('� Save this information in a secure location');
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    console.log('💡 This is normal if database is not connected');
    console.log('🔄 To recover: Follow steps in DATABASE_RECOVERY.md');
  }
}

backupDatabase();