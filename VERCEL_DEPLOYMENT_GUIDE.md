# 🚀 Manual Vercel Deployment Guide

## Pre-Deployment Checklist ✅

Before deploying to Vercel manually, make sure your project is properly configured:

### 1. Environment Variables Setup
You need to set up these environment variables in Vercel:

```
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
```

### 2. Project Structure Verification
Your project should have this structure:
```
CyberRangeSim/
├── client/           (Frontend React app)
├── server/           (Backend Express server)
├── shared/           (Shared types/schemas)
├── package.json      (Root dependencies)
├── vite.config.ts    (Vite configuration)
└── vercel.json       (Vercel configuration)
```

## 📋 Step-by-Step Manual Deployment

### Step 1: Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Click "New Project" or "Add New Project"

### Step 2: Import Your Project
1. **Choose "Import Git Repository"**
2. **Connect your GitHub repository** (if not already connected)
3. **Find your repository**: `Vraj-V/CyberRangeSimulator`
4. Click **"Import"**

### Step 3: Configure Project Settings

#### Framework Preset
- **Framework**: Select "Vite" from the dropdown
- **Root Directory**: Leave as `./` (default)

#### Build and Output Settings
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

#### Advanced Settings (Click "Environment Variables")
Add these environment variables:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your Supabase database URL | Production |
| `SUPABASE_URL` | Your Supabase project URL | Production |
| `SUPABASE_ANON_KEY` | Your Supabase anon key | Production |
| `NODE_ENV` | `production` | Production |

**How to find your Supabase credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Open your project dashboard
3. Go to Settings → API
4. Copy the Project URL and anon public key
5. Go to Settings → Database
6. Copy the connection string (replace [YOUR-PASSWORD] with your actual password)

### Step 4: Deploy
1. Click **"Deploy"** button
2. Wait for the build process to complete (should take 2-3 minutes)
3. If successful, you'll get a live URL

## 🔧 Troubleshooting Common Issues

### Issue 1: Build Fails with "npm error ERESOLVE"
**Solution**: The error you saw is related to dependency resolution.

**Fix in Vercel**:
1. In your project settings
2. Go to "Functions" tab
3. Set Node.js Version to `18.x` or `20.x`

### Issue 2: "Functions property cannot be used"
**Solution**: Remove conflicting Vercel configuration.

**Fix**: In your `vercel.json`, make sure you have:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ]
}
```

### Issue 3: Build Command Errors
**Solution**: Use the correct build command.

**In Vercel Project Settings**:
- Build Command: `npm run vercel-build`
- Output Directory: `client/dist`

### Issue 4: Database Connection Issues
**Solution**: Verify environment variables.

1. Check that all environment variables are set correctly
2. Make sure `DATABASE_URL` includes the password
3. Test your Supabase connection in the Supabase dashboard

## 🎯 Alternative Manual Deployment Method

If the above method doesn't work, try this alternative:

### Method 2: Manual Upload
1. **Build locally first**:
   ```bash
   npm install
   npm run build
   ```

2. **Create a new Vercel project**:
   - Choose "Browse" instead of "Import Git Repository"
   - Upload your project folder directly
   - Set the same configuration as above

## 📝 Verification Steps

After deployment:

1. **Check the live URL** - Make sure the site loads
2. **Test the backend API** - Try accessing `/api/health`
3. **Verify database connection** - Check if dashboard data loads
4. **Test WebSocket connection** - Ensure real-time features work

## 🚨 Common Deployment Errors and Solutions

### Error: "Module not found"
- **Cause**: Incorrect import paths
- **Solution**: Check that all imports use relative paths correctly

### Error: "Build timeout"
- **Cause**: Build takes too long
- **Solution**: Optimize dependencies or increase timeout in Vercel settings

### Error: "Environment variable not found"
- **Cause**: Missing environment variables
- **Solution**: Double-check all required environment variables are set

## 📞 Support

If you encounter issues:
1. Check Vercel's build logs for specific error messages
2. Verify all environment variables are correctly set
3. Ensure your GitHub repository is up to date
4. Test the build locally first with `npm run build`

## 🎉 Success!

Once deployed successfully, you'll have:
- ✅ Live cybersecurity simulator at your Vercel URL
- ✅ Working database with Supabase
- ✅ Real-time features via WebSocket
- ✅ Professional UI with all features

Your deployment URL will look like: `cyber-range-simulator-[random].vercel.app`