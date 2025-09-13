import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { db, testConnection } from './db.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/test', async (_req, res) => {
  try {
    // Test database connection using a simple query
    const result = await db.execute('SELECT 1 as test');
    res.json({ status: 'Database connection successful', result });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Test database connection before starting services
    console.log('Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.log('Warning: Database connection failed. Server will start but some features may not work.');
    } else {
      console.log('Database connection successful!');
    }

    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      
      console.error('Error occurred:', {
        status,
        message,
        stack: err.stack,
        url: _req.url,
        method: _req.method
      });

      res.status(status).json({ message });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);

    server.listen(
      {
        port,
        host: "127.0.0.1", // Force IPv4
      },
      () => {
        console.log(`Serving on port ${port}`);
        if (dbConnected) {
          console.log('All systems ready!');
        } else {
          console.log('Server is running but database connection issues detected.');
        }
      }
    );
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1
    
    );
  }
})();