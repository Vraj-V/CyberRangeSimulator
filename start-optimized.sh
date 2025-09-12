#!/bin/bash

echo "🚀 Starting CyberGuard with Performance Optimization..."

# Clear npm cache for faster startup
echo "📦 Clearing npm cache..."
npm cache clean --force 2>/dev/null || echo "Cache already clean"

# Set Node.js performance flags
export NODE_OPTIONS="--max-old-space-size=4096 --no-experimental-fetch"

# Set development environment
export NODE_ENV=development

# Start with optimized settings
echo "⚡ Starting development server..."
npm run dev