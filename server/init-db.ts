import 'dotenv/config';
import { db } from './db.js';
import { threats, simulations, responses, systemLogs, blockedIPs } from '../shared/schema.js';

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test database connection
    await db.execute('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Drop existing tables if they exist (to recreate with correct schema)
    console.log('Dropping existing tables...');
    await db.execute('DROP TABLE IF EXISTS blocked_ips CASCADE');
    await db.execute('DROP TABLE IF EXISTS system_logs CASCADE');
    await db.execute('DROP TABLE IF EXISTS responses CASCADE');
    await db.execute('DROP TABLE IF EXISTS simulations CASCADE');
    await db.execute('DROP TABLE IF EXISTS threats CASCADE');
    
    // Create tables using raw SQL that matches the schema
    console.log('Creating tables...');
    
    // Create threats table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS threats (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        severity TEXT NOT NULL,
        source_ip TEXT NOT NULL,
        target_ip TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        resolved_at TIMESTAMP,
        metadata JSONB
      )
    `);
    
    // Create simulations table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS simulations (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'running',
        targets INTEGER NOT NULL,
        success_rate TEXT,
        duration INTEGER,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        completed_at TIMESTAMP,
        config JSONB
      )
    `);
    
    // Create responses table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS responses (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        action TEXT NOT NULL,
        threat TEXT NOT NULL,
        target TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        details TEXT,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        completed_at TIMESTAMP,
        automated BOOLEAN DEFAULT true
      )
    `);
    
    // Create system_logs table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        level TEXT NOT NULL,
        message TEXT NOT NULL,
        component TEXT NOT NULL,
        metadata JSONB,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    
    // Create blocked_ips table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS blocked_ips (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        ip_address TEXT NOT NULL UNIQUE,
        reason TEXT,
        blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT true
      )
    `);
    
    console.log('✅ All tables created successfully');
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