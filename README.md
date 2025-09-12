# 🛡️ CyberGuard - Cybersecurity Training Simulator

A comprehensive cybersecurity training platform for educational and professional development.

## 🚀 Quick Start

### Local Development
```bash
npm install --legacy-peer-deps
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 📦 Deployment

### Vercel Deployment
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variable: `DATABASE_URL`

### Environment Variables
```
DATABASE_URL=your_postgresql_connection_string
```

## 🎯 Features
- Real-time threat detection
- Attack simulation engine
- Automated response system
- Interactive dashboard
- WebSocket real-time updates

## 📚 Documentation
- [Complete Project Documentation](./PROJECT_DOCUMENTATION.md)
- [Setup Guide](./SETUP_GUIDE.md)

## 🔧 Tech Stack
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: PostgreSQL + Drizzle ORM
- UI: TailwindCSS + shadcn/ui
- Real-time: WebSockets

## 📄 License
MIT License