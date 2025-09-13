# Database Recovery Guide

## 🚨 If Database Gets Deleted

### Quick Recovery (5 minutes):

1. **Create New Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Copy the DATABASE_URL

2. **Update Environment**
   ```bash
   # Edit .env file
   DATABASE_URL="your_new_database_url"
   ```

3. **Recreate Tables**
   ```bash
   npm run db:init
   ```

4. **Restart Server**
   ```bash
   npm run dev
   ```

### Your App Will:
- ✅ Connect to new database
- ✅ Create all required tables
- ✅ Start with fresh data
- ✅ Resume normal operation

## 🛡️ Prevention

### Regular Backups:
```bash
# Create backup (when implemented)
npm run db:backup

# Always keep .env file safe
# Document Supabase project details
```

### Emergency Fallback:
- App automatically switches to demo mode if database fails
- No downtime even if database is lost
- Can operate indefinitely without database

## 📋 Quick Reference

**Current Database**: `db.grnsbuhdtkegbblcsdlq.supabase.co`
**Backup Date**: `${new Date().toLocaleDateString()}`
**Recovery Time**: `~5 minutes`

## 🔄 Migration Commands

```bash
# Initialize database
npm run db:init

# Check connection
npm run dev

# Generate migrations (if available)
npm run db:generate
```

Your CyberRange simulator is designed to be resilient - even complete database loss is just a 5-minute recovery!