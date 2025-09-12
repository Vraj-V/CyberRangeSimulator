import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { threatDetectionService } from "./services/threatDetection";
import { simulationEngine } from "./services/simulationEngine.js";
import { responseAutomation } from "./services/responseAutomation.js";
import { insertThreatSchema, insertSimulationSchema, insertResponseSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    // Send initial dashboard data
    ws.send(JSON.stringify({
      type: 'dashboard_data',
      data: 'connected'
    }));
  });

  // Broadcast function for real-time updates
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Initialize services with broadcast capability
  threatDetectionService.setBroadcast(broadcast);
  simulationEngine.setBroadcast(broadcast);
  responseAutomation.setBroadcast(broadcast);

  // Dashboard metrics endpoint
  app.get('/api/dashboard/metrics', async (req, res) => {
    try {
      const [activeThreats, blockedIPs, activeSimulations] = await Promise.all([
        storage.getActiveThreatsCount(),
        storage.getBlockedIPsCount(),
        storage.getActiveSimulationsCount()
      ]);

      // Enhanced metrics for training environment
      const enhancedMetrics = {
        activeThreats: Math.max(activeThreats, 145), // Minimum realistic number
        blockedIPs: Math.max(blockedIPs, 89), // More realistic for enterprise
        activeSimulations,
        responseRate: 98.7,
        // Additional metrics for better visualization
        totalThreatsDetected: Math.max(activeThreats * 12, 2847),
        averageResponseTime: "2.4s",
        securityScore: 94.2,
        riskLevel: "Medium"
      };

      res.json(enhancedMetrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
  });

  // Threats endpoints
  app.get('/api/threats', async (req, res) => {
    try {
      const threats = await storage.getThreats();
      res.json(threats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch threats' });
    }
  });

  app.post('/api/threats', async (req, res) => {
    try {
      const threatData = insertThreatSchema.parse(req.body);
      const threat = await storage.createThreat(threatData);
      
      // Broadcast new threat
      broadcast({
        type: 'new_threat',
        data: threat
      });

      res.status(201).json(threat);
    } catch (error) {
      res.status(400).json({ error: 'Invalid threat data' });
    }
  });

  app.patch('/api/threats/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      await storage.updateThreatStatus(id, status, status === 'resolved' ? new Date() : undefined);
      
      broadcast({
        type: 'threat_updated',
        data: { id, status }
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update threat status' });
    }
  });

  // Block IP endpoint
  app.post('/api/threats/:id/block', async (req, res) => {
    try {
      const threat = await storage.getThreatById(req.params.id);
      if (!threat) {
        return res.status(404).json({ error: 'Threat not found' });
      }

      await responseAutomation.blockIP(threat.sourceIP, `Threat: ${threat.name}`);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to block IP' });
    }
  });

  // Simulations endpoints
  app.get('/api/simulations', async (req, res) => {
    try {
      const simulations = await storage.getSimulations();
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch simulations' });
    }
  });

  app.get('/api/simulations/active', async (req, res) => {
    try {
      const simulations = await storage.getActiveSimulations();
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch active simulations' });
    }
  });

  app.post('/api/simulations', async (req, res) => {
    try {
      const simulationData = insertSimulationSchema.parse(req.body);
      const simulation = await storage.createSimulation(simulationData);
      
      // Start the simulation
      simulationEngine.startSimulation(simulation);
      
      broadcast({
        type: 'new_simulation',
        data: simulation
      });

      res.status(201).json(simulation);
    } catch (error) {
      res.status(400).json({ error: 'Invalid simulation data' });
    }
  });

  // Responses endpoints
  app.get('/api/responses', async (req, res) => {
    try {
      const responses = await storage.getResponses();
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch responses' });
    }
  });

  // System logs endpoint
  app.get('/api/logs', async (req, res) => {
    try {
      const logs = await storage.getSystemLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch system logs' });
    }
  });

  // Blocked IPs endpoint
  app.get('/api/blocked-ips', async (req, res) => {
    try {
      const blockedIPs = await storage.getBlockedIPs();
      res.json(blockedIPs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blocked IPs' });
    }
  });

  // Start threat detection service
  threatDetectionService.start();

  return httpServer;
}
