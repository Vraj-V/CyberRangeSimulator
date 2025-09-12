# CyberGuard AI - Cybersecurity Simulator

## Overview

CyberGuard AI is a comprehensive cybersecurity simulator designed to provide real-time threat detection, simulation capabilities, and automated response systems. The application simulates various cyberattacks including SQL injection, brute force attacks, DDoS attacks, malware, and phishing attempts while providing enterprise-grade monitoring and mitigation tools.

The system serves as both an educational platform for cybersecurity training and a testing environment for security professionals to validate their defense strategies in a controlled environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built using a modern React-TypeScript stack with several key architectural decisions:

- **Framework**: React 18+ with TypeScript for type safety and modern development practices
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: TanStack Query (React Query) for server state management, providing caching, background updates, and optimistic updates
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: WebSocket integration for live updates of threats, simulations, and system status
- **Build Tool**: Vite for fast development builds and hot module replacement

The UI follows a dashboard-centric design with modular components for different security aspects (threats, simulations, responses, system status).

### Backend Architecture

The backend implements a service-oriented architecture using Node.js and Express:

- **Runtime**: Node.js with ES modules for modern JavaScript features
- **Web Framework**: Express.js with middleware for request logging, JSON parsing, and error handling
- **Services Layer**: Three core services handle the main business logic:
  - `threatDetectionService`: Monitors for security threats using pattern matching
  - `simulationEngine`: Manages attack simulations (phishing, SQL injection, DDoS)
  - `responseAutomation`: Handles automated threat mitigation and response actions
- **Real-time Updates**: WebSocket server for broadcasting live updates to connected clients
- **API Design**: RESTful endpoints with consistent JSON responses and proper HTTP status codes

### Data Storage Solutions

The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations:

- **Database**: PostgreSQL for ACID compliance and complex query support
- **Connection**: Neon serverless PostgreSQL for cloud-native deployment
- **ORM**: Drizzle ORM with schema validation using Zod for type safety
- **Schema Design**: Five main entities:
  - `threats`: Security threat records with severity levels and metadata
  - `simulations`: Attack simulation configurations and status
  - `responses`: Automated response actions and their outcomes
  - `systemLogs`: Application-wide logging for audit trails
  - `blockedIPs`: IP address blacklist for threat mitigation

### Authentication and Authorization

Currently, the application operates in a single-user admin mode without authentication mechanisms. This design choice simplifies deployment for educational and testing environments while maintaining full access to all security features.

### Real-time Communication

WebSocket implementation provides bidirectional communication:

- **Connection**: Single WebSocket endpoint (`/ws`) for all real-time updates
- **Message Types**: Structured JSON messages for different event types (new threats, simulation updates, system changes)
- **Broadcasting**: Server-side broadcast system notifies all connected clients of security events
- **Client Integration**: Custom React hook (`useWebSocket`) manages connection lifecycle and message handling

## External Dependencies

### Core Dependencies

- **@neondatabase/serverless**: Neon's serverless PostgreSQL driver for database connectivity
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL support
- **ws**: WebSocket library for real-time server-client communication
- **express**: Web application framework for API endpoints and middleware

### Frontend Dependencies

- **@tanstack/react-query**: Server state management with caching and background synchronization
- **@radix-ui**: Comprehensive set of accessible, unstyled UI primitives
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **wouter**: Minimalist router for single-page application navigation
- **lucide-react**: Icon library providing consistent iconography

### Development Dependencies

- **vite**: Modern build tool with fast hot module replacement
- **tsx**: TypeScript execution environment for development server
- **esbuild**: JavaScript bundler for production builds
- **drizzle-kit**: Database migration and schema management tools

### Configuration Dependencies

The application relies on environment variables for database connectivity and uses standardized configuration files for TypeScript, Tailwind CSS, and build processes. No external API keys or third-party service integrations are required for core functionality.