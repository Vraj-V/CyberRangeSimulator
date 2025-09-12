# 🛡️ CyberGuard - Cybersecurity Training Simulator

## 📖 **Project Overview**

CyberGuard is a comprehensive cybersecurity training simulator designed to provide hands-on experience with cyber threats, automated responses, and security monitoring. This application simulates real-world cyberattacks in a controlled environment for educational purposes.

---

## 🏗️ **Project Architecture**

### **Technology Stack:**
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **UI Framework**: TailwindCSS + shadcn/ui
- **Real-time**: WebSockets
- **State Management**: React Query (TanStack Query)

### **Project Structure:**
```
CyberRangeSim/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── App.tsx        # Main app component
├── server/                # Backend Express application
│   ├── services/          # Business logic services
│   ├── routes.ts          # API routes
│   ├── db.ts             # Database connection
│   ├── storage.ts        # Data access layer
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema definitions
└── package.json          # Dependencies and scripts
```

---

## 📊 **Database Schema**

### **5 Core Tables:**

#### 1. **Threats Table**
Stores detected cybersecurity threats:
- `id`: Unique identifier
- `name`: Threat name (e.g., "Malware Detected")
- `description`: Detailed description
- `severity`: High/Medium/Low/Critical
- `sourceIP`: Attack origin IP
- `targetIP`: Target system IP
- `status`: active/resolved/mitigated
- `detectedAt`: Detection timestamp
- `resolvedAt`: Resolution timestamp
- `metadata`: Additional threat data (JSON)

#### 2. **Simulations Table**
Manages attack simulations:
- `id`: Unique identifier
- `name`: Simulation name
- `type`: phishing/sqli/ddos/malware/brute_force/xss
- `status`: running/completed/stopped
- `targets`: Number of target systems
- `successRate`: Attack success percentage
- `duration`: Simulation duration in minutes
- `startedAt`: Start timestamp
- `completedAt`: Completion timestamp
- `config`: Simulation parameters (JSON)

#### 3. **Responses Table**
Tracks automated security responses:
- `id`: Unique identifier
- `action`: Response action taken
- `threat`: Related threat description
- `target`: Target system affected
- `status`: pending/completed/failed
- `details`: Action details
- `executedAt`: Execution timestamp
- `completedAt`: Completion timestamp
- `automated`: Whether response was automated

#### 4. **System Logs Table**
System activity and error logs:
- `id`: Unique identifier
- `level`: info/warning/error
- `message`: Log message
- `component`: System component (waf/ids/siem)
- `metadata`: Additional log data (JSON)
- `timestamp`: Log timestamp

#### 5. **Blocked IPs Table**
IP address blocking management:
- `id`: Unique identifier
- `ipAddress`: Blocked IP address
- `reason`: Blocking reason
- `blockedAt`: Block timestamp
- `expiresAt`: Expiration timestamp
- `isActive`: Block status

---

## 🎯 **Core Features**

### **1. Dashboard**
- Real-time security metrics
- Active threat count
- Blocked IPs count
- Active simulations count
- Response rate statistics
- Live updates via WebSocket

### **2. Threat Detection System**
- Automatic threat simulation
- Multiple threat types:
  - Malware infections
  - SQL injection attacks
  - DDoS attacks
  - Brute force attempts
  - Data exfiltration
- Real-time threat alerts
- Severity assessment

### **3. Attack Simulation Engine**
- Interactive simulation creation
- Configurable parameters:
  - Attack intensity
  - Duration
  - Target count
  - Attack vectors
- Real-time simulation monitoring
- Success rate tracking

### **4. Automated Response System**
- Automatic threat response
- Response types:
  - IP blocking
  - System quarantine
  - Service isolation
  - Alert escalation
- Response execution logging
- Undo capabilities

### **5. System Monitoring**
- Comprehensive logging
- Component health monitoring
- Performance metrics
- Audit trails
- Export capabilities

---

## 🔄 **Real-time Features**

### **WebSocket Integration:**
- Live dashboard updates
- Real-time threat notifications
- Simulation status updates
- Response execution alerts
- System status changes

### **Auto-refresh Intervals:**
- Threats: Every 3 seconds
- Simulations: Every 3 seconds
- Responses: Every 5 seconds
- Dashboard metrics: Every 5 seconds

---

## 🎨 **User Interface Components**

### **Core Components:**

#### **Sidebar Navigation**
- Dashboard overview
- Simulations management
- Threats monitoring
- Responses tracking
- Reports generation

#### **Dashboard Widgets**
- Metrics overview cards
- Active simulations panel
- Recent threats list
- Automated responses table
- System status indicators

#### **Interactive Dialogs**
- Simulation creation form
- Response logs viewer
- Threat details modal
- Configuration panels

---

## 🔧 **API Endpoints**

### **Dashboard:**
- `GET /api/dashboard/metrics` - Security metrics

### **Threats:**
- `GET /api/threats` - List all threats
- `POST /api/threats` - Create new threat
- `PATCH /api/threats/:id/status` - Update threat status
- `POST /api/threats/:id/block` - Block threat IP

### **Simulations:**
- `GET /api/simulations` - List all simulations
- `GET /api/simulations/active` - Active simulations
- `POST /api/simulations` - Create new simulation

### **Responses:**
- `GET /api/responses` - List all responses

### **System:**
- `GET /api/logs` - System logs
- `GET /api/blocked-ips` - Blocked IP addresses

### **Real-time:**
- `WebSocket /ws` - Real-time updates

---

## 🚀 **Installation & Setup**

### **Prerequisites:**
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Supabase account)

### **Local Development Setup:**

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   Note: Use `--legacy-peer-deps` to resolve version conflicts

3. **Configure environment:**
   Create `.env` file:
   ```
   DATABASE_URL="postgresql://username:password@host:5432/database"
   ```

4. **Setup database:**
   ```bash
   npm run db:push
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

### **For Friend's Laptop Setup:**

1. **Install Node.js 18+** from nodejs.org
2. **Clone/copy the project folder**
3. **Open terminal in project directory**
4. **Run installation command:**
   ```bash
   npm install --legacy-peer-deps --force
   ```
5. **Copy the `.env` file with database credentials**
6. **Start the application:**
   ```bash
   npm run dev
   ```

---

## ☁️ **Vercel Deployment Guide**

### **Step 1: Prepare for Deployment**

1. **Update package.json scripts:**
   ```json
   "scripts": {
     "build": "vite build && esbuild server/index.ts --platform=node --format=esm --packages=external --bundle --outdir=dist",
     "start": "node dist/index.js"
   }
   ```

2. **Create vercel.json:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/index.js",
         "use": "@vercel/node"
       },
       {
         "src": "client/dist/**",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/dist/index.js"
       },
       {
         "src": "/ws",
         "dest": "/dist/index.js"
       },
       {
         "src": "/(.*)",
         "dest": "/client/dist/$1"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

### **Step 2: Deploy to Vercel**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set environment variables in Vercel dashboard:**
   - Add `DATABASE_URL` with your Supabase connection string

### **Alternative: GitHub Integration**

1. **Push code to GitHub**
2. **Connect repository to Vercel**
3. **Configure environment variables**
4. **Enable automatic deployments**

---

## 🎓 **Educational Explanation for Teacher**

### **Project Significance:**
This cybersecurity simulator demonstrates advanced full-stack development skills and cybersecurity knowledge:

### **Technical Skills Demonstrated:**

1. **Full-Stack Development:**
   - Modern React frontend with TypeScript
   - RESTful API backend with Express.js
   - Real-time communication with WebSockets
   - Database design and optimization

2. **Cybersecurity Knowledge:**
   - Understanding of common attack vectors
   - Automated response mechanisms
   - Threat detection algorithms
   - Security monitoring principles

3. **Software Architecture:**
   - Microservices design pattern
   - Event-driven architecture
   - Database normalization
   - API design best practices

4. **Modern Development Practices:**
   - TypeScript for type safety
   - Component-based UI architecture
   - State management with React Query
   - Real-time data synchronization

### **Learning Outcomes:**
- Practical cybersecurity experience
- Full-stack web development proficiency
- Database design and management
- Real-time application development
- Cloud deployment experience

---

## 🔍 **How It Works**

### **Threat Detection Flow:**
1. **Simulation Service** generates realistic cyber threats
2. **Detection Algorithms** identify and classify threats
3. **Database Storage** records threat details
4. **Real-time Broadcast** notifies connected clients
5. **Dashboard Updates** show live threat status

### **Response Automation Flow:**
1. **Threat Trigger** activates response protocols
2. **Response Engine** executes appropriate actions
3. **Action Logging** records all response activities
4. **Status Tracking** monitors response effectiveness
5. **User Notification** provides real-time feedback

### **Simulation Engine Flow:**
1. **User Configuration** sets simulation parameters
2. **Engine Initialization** prepares attack scenarios
3. **Execution Management** runs simulated attacks
4. **Progress Monitoring** tracks simulation status
5. **Results Analysis** provides outcome metrics

---

## 🛠️ **Troubleshooting Common Issues**

### **Package Installation Issues:**
```bash
# If normal install fails:
npm install --legacy-peer-deps

# If still having issues:
npm install --legacy-peer-deps --force

# Clear cache if needed:
npm cache clean --force
```

### **Database Connection Issues:**
- Verify DATABASE_URL format
- Check firewall settings
- Ensure Supabase credentials are correct
- Test connection timeout settings

### **Build Issues:**
- Check TypeScript version compatibility
- Verify all dependencies are installed
- Clear node_modules and reinstall

---

## 🏆 **Project Achievements**

This project successfully demonstrates:
- ✅ Modern full-stack web development
- ✅ Real-time data synchronization
- ✅ Cybersecurity simulation capabilities
- ✅ Professional UI/UX design
- ✅ Scalable architecture design
- ✅ Cloud deployment readiness
- ✅ Educational value for cybersecurity training

---

## 🤝 **Support & Maintenance**

### **For Future Development:**
- Add more attack simulation types
- Implement machine learning threat detection
- Add user authentication and roles
- Create detailed reporting features
- Integrate with real security tools

### **Documentation:**
- API documentation with Swagger
- Component documentation with Storybook
- Deployment guides for different platforms
- User manuals and tutorials

---

**This project represents a comprehensive cybersecurity training platform suitable for educational institutions, corporate training, and security research purposes.** 🛡️