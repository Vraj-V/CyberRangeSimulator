import { threats, simulations, responses, systemLogs, blockedIPs, type Threat, type InsertThreat, type Simulation, type InsertSimulation, type Response, type InsertResponse, type SystemLog, type InsertSystemLog, type BlockedIP, type InsertBlockedIP } from "../shared/schema.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { db } from "./db.js";
import { eq, desc, count, and, gte, lte } from "drizzle-orm";

// Demo data for when database is not available
const demoThreats: Threat[] = [
  {
    id: 'demo-threat-1',
    name: 'Demo Malware Detection',
    description: 'Sample malware threat detected in demo mode',
    severity: 'high',
    status: 'active',
    sourceIP: '192.168.1.100',
    targetIP: '10.0.1.50',
    detectedAt: new Date(Date.now() - 3600000), // 1 hour ago
    resolvedAt: null,
    metadata: { type: 'demo', category: 'malware' }
  },
  {
    id: 'demo-threat-2', 
    name: 'Demo DDoS Attack',
    description: 'Sample DDoS attack detected in demo mode',
    severity: 'critical',
    status: 'active',
    sourceIP: '203.0.113.45',
    targetIP: '10.0.1.50',
    detectedAt: new Date(Date.now() - 1800000), // 30 minutes ago
    resolvedAt: null,
    metadata: { type: 'demo', category: 'ddos' }
  }
];

const demoSimulations: Simulation[] = [];
const demoResponses: Response[] = [];
const demoSystemLogs: SystemLog[] = [];
const demoBlockedIPs: BlockedIP[] = [];

export interface IStorage {
  // Threats
  getThreats(limit?: number): Promise<Threat[]>;
  getThreatById(id: string): Promise<Threat | undefined>;
  createThreat(threat: InsertThreat): Promise<Threat>;
  updateThreatStatus(id: string, status: string, resolvedAt?: Date): Promise<void>;
  getActiveThreatsCount(): Promise<number>;

  // Simulations
  getSimulations(limit?: number): Promise<Simulation[]>;
  getActiveSimulations(): Promise<Simulation[]>;
  getSimulationById(id: string): Promise<Simulation | undefined>;
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  updateSimulationStatus(id: string, status: string, completedAt?: Date): Promise<void>;
  getActiveSimulationsCount(): Promise<number>;

  // Responses
  getResponses(limit?: number): Promise<Response[]>;
  getResponseById(id: string): Promise<Response | undefined>;
  createResponse(response: InsertResponse): Promise<Response>;
  updateResponseStatus(id: string, status: string, completedAt?: Date): Promise<void>;

  // System Logs
  getSystemLogs(limit?: number): Promise<SystemLog[]>;
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;

  // Blocked IPs
  getBlockedIPs(): Promise<BlockedIP[]>;
  getBlockedIPsCount(): Promise<number>;
  isIPBlocked(ipAddress: string): Promise<boolean>;
  blockIP(blockedIP: InsertBlockedIP): Promise<BlockedIP>;
  unblockIP(ipAddress: string): Promise<void>;
}

// Demo storage implementation for when database is not available
export class DemoStorage implements IStorage {
  private generateId(): string {
    return 'demo-' + Math.random().toString(36).substr(2, 9);
  }

  // Threats
  async getThreats(limit = 50): Promise<Threat[]> {
    return demoThreats.slice(0, limit);
  }

  async getThreatById(id: string): Promise<Threat | undefined> {
    return demoThreats.find(threat => threat.id === id);
  }

  async createThreat(threat: InsertThreat): Promise<Threat> {
    const newThreat: Threat = {
      id: this.generateId(),
      name: threat.name,
      description: threat.description || null,
      severity: threat.severity,
      sourceIP: threat.sourceIP,
      targetIP: threat.targetIP || null,
      status: threat.status || 'active',
      detectedAt: new Date(),
      resolvedAt: null,
      metadata: threat.metadata || {}
    };
    demoThreats.unshift(newThreat);
    return newThreat;
  }

  async updateThreatStatus(id: string, status: string, resolvedAt?: Date): Promise<void> {
    const threat = demoThreats.find(t => t.id === id);
    if (threat) {
      threat.status = status;
      threat.resolvedAt = resolvedAt || null;
    }
  }

  async getActiveThreatsCount(): Promise<number> {
    return demoThreats.filter(t => t.status === 'active').length;
  }

  // Simulations
  async getSimulations(limit = 50): Promise<Simulation[]> {
    return demoSimulations.slice(0, limit);
  }

  async getActiveSimulations(): Promise<Simulation[]> {
    return demoSimulations.filter(s => s.status === 'running');
  }

  async getSimulationById(id: string): Promise<Simulation | undefined> {
    return demoSimulations.find(simulation => simulation.id === id);
  }

  async createSimulation(simulation: InsertSimulation): Promise<Simulation> {
    const newSimulation: Simulation = {
      id: this.generateId(),
      name: simulation.name,
      status: 'running',
      type: simulation.type,
      targets: simulation.targets,
      successRate: null,
      duration: null,
      startedAt: new Date(),
      completedAt: null,
      config: simulation.config || {}
    };
    demoSimulations.unshift(newSimulation);
    return newSimulation;
  }

  async updateSimulationStatus(id: string, status: string, completedAt?: Date): Promise<void> {
    const simulation = demoSimulations.find(s => s.id === id);
    if (simulation) {
      simulation.status = status;
      simulation.completedAt = completedAt || null;
    }
  }

  async getActiveSimulationsCount(): Promise<number> {
    return demoSimulations.filter(s => s.status === 'running').length;
  }

  // Responses
  async getResponses(limit = 50): Promise<Response[]> {
    return demoResponses.slice(0, limit);
  }

  async getResponseById(id: string): Promise<Response | undefined> {
    return demoResponses.find(response => response.id === id);
  }

  async createResponse(response: InsertResponse): Promise<Response> {
    const newResponse: Response = {
      id: this.generateId(),
      status: response.status || 'pending',
      completedAt: null,
      action: response.action,
      threat: response.threat,
      target: response.target,
      details: response.details || null,
      executedAt: new Date(),
      automated: response.automated || null
    };
    demoResponses.unshift(newResponse);
    return newResponse;
  }

  async updateResponseStatus(id: string, status: string, completedAt?: Date): Promise<void> {
    const response = demoResponses.find(r => r.id === id);
    if (response) {
      response.status = status;
      response.completedAt = completedAt || null;
    }
  }

  // System Logs
  async getSystemLogs(limit = 50): Promise<SystemLog[]> {
    return demoSystemLogs.slice(0, limit);
  }

  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const newLog: SystemLog = {
      id: this.generateId(),
      level: log.level,
      message: log.message,
      component: log.component,
      timestamp: new Date(),
      metadata: log.metadata || {}
    };
    demoSystemLogs.unshift(newLog);
    return newLog;
  }

  // Blocked IPs
  async getBlockedIPs(): Promise<BlockedIP[]> {
    return demoBlockedIPs.filter(ip => ip.isActive);
  }

  async getBlockedIPsCount(): Promise<number> {
    return demoBlockedIPs.filter(ip => ip.isActive).length;
  }

  async isIPBlocked(ipAddress: string): Promise<boolean> {
    return demoBlockedIPs.some(ip => ip.ipAddress === ipAddress && ip.isActive);
  }

  async blockIP(blockedIP: InsertBlockedIP): Promise<BlockedIP> {
    const newBlockedIP: BlockedIP = {
      id: this.generateId(),
      ipAddress: blockedIP.ipAddress,
      reason: blockedIP.reason,
      blockedAt: new Date(),
      expiresAt: blockedIP.expiresAt || null,
      isActive: true
    };
    demoBlockedIPs.push(newBlockedIP);
    return newBlockedIP;
  }

  async unblockIP(ipAddress: string): Promise<void> {
    const blockedIP = demoBlockedIPs.find(ip => ip.ipAddress === ipAddress);
    if (blockedIP) {
      blockedIP.isActive = false;
    }
  }
}

export class DatabaseStorage implements IStorage {
  // Threats
  async getThreats(limit = 50): Promise<Threat[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(threats).orderBy(desc(threats.detectedAt)).limit(limit);
  }

  async getThreatById(id: string): Promise<Threat | undefined> {
    if (!db) throw new Error('Database not available');
    const [threat] = await db.select().from(threats).where(eq(threats.id, id));
    return threat || undefined;
  }

  async createThreat(threat: InsertThreat): Promise<Threat> {
    if (!db) throw new Error('Database not available');
    const [newThreat] = await db.insert(threats).values(threat).returning();
    return newThreat;
  }

  async updateThreatStatus(id: string, status: string, resolvedAt?: Date): Promise<void> {
    if (!db) throw new Error('Database not available');
    await db.update(threats)
      .set({ status, resolvedAt })
      .where(eq(threats.id, id));
  }

  async getActiveThreatsCount(): Promise<number> {
    if (!db) throw new Error('Database not available');
    const [result] = await db.select({ count: count() })
      .from(threats)
      .where(eq(threats.status, 'active'));
    return result.count;
  }

  // Simulations
  async getSimulations(limit = 50): Promise<Simulation[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(simulations).orderBy(desc(simulations.startedAt)).limit(limit);
  }

  async getActiveSimulations(): Promise<Simulation[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(simulations).where(eq(simulations.status, 'running'));
  }

  async getSimulationById(id: string): Promise<Simulation | undefined> {
    if (!db) throw new Error('Database not available');
    const [simulation] = await db.select().from(simulations).where(eq(simulations.id, id));
    return simulation || undefined;
  }

  async createSimulation(simulation: InsertSimulation): Promise<Simulation> {
    if (!db) throw new Error('Database not available');
    const [newSimulation] = await db.insert(simulations).values(simulation).returning();
    return newSimulation;
  }

  async updateSimulationStatus(id: string, status: string, completedAt?: Date): Promise<void> {
    if (!db) throw new Error('Database not available');
    await db.update(simulations)
      .set({ status, completedAt })
      .where(eq(simulations.id, id));
  }

  async getActiveSimulationsCount(): Promise<number> {
    if (!db) throw new Error('Database not available');
    const [result] = await db.select({ count: count() })
      .from(simulations)
      .where(eq(simulations.status, 'running'));
    return result.count;
  }

  // Responses
  async getResponses(limit = 50): Promise<Response[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(responses).orderBy(desc(responses.executedAt)).limit(limit);
  }

  async getResponseById(id: string): Promise<Response | undefined> {
    if (!db) throw new Error('Database not available');
    const [response] = await db.select().from(responses).where(eq(responses.id, id));
    return response || undefined;
  }

  async createResponse(response: InsertResponse): Promise<Response> {
    if (!db) throw new Error('Database not available');
    const [newResponse] = await db.insert(responses).values(response).returning();
    return newResponse;
  }

  async updateResponseStatus(id: string, status: string, completedAt?: Date): Promise<void> {
    if (!db) throw new Error('Database not available');
    await db.update(responses)
      .set({ status, completedAt })
      .where(eq(responses.id, id));
  }

  // System Logs
  async getSystemLogs(limit = 100): Promise<SystemLog[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(systemLogs).orderBy(desc(systemLogs.timestamp)).limit(limit);
  }

  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    if (!db) throw new Error('Database not available');
    const [newLog] = await db.insert(systemLogs).values(log).returning();
    return newLog;
  }

  // Blocked IPs
  async getBlockedIPs(): Promise<BlockedIP[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(blockedIPs).where(eq(blockedIPs.isActive, true));
  }

  async getBlockedIPsCount(): Promise<number> {
    if (!db) throw new Error('Database not available');
    const [result] = await db.select({ count: count() })
      .from(blockedIPs)
      .where(eq(blockedIPs.isActive, true));
    return result.count;
  }

  async isIPBlocked(ipAddress: string): Promise<boolean> {
    if (!db) throw new Error('Database not available');
    const [result] = await db.select().from(blockedIPs)
      .where(and(
        eq(blockedIPs.ipAddress, ipAddress),
        eq(blockedIPs.isActive, true)
      ));
    return !!result;
  }

  async blockIP(blockedIP: InsertBlockedIP): Promise<BlockedIP> {
    if (!db) throw new Error('Database not available');
    const [newBlockedIP] = await db.insert(blockedIPs).values(blockedIP).returning();
    return newBlockedIP;
  }

  async unblockIP(ipAddress: string): Promise<void> {
    if (!db) throw new Error('Database not available');
    await db.update(blockedIPs)
      .set({ isActive: false })
      .where(eq(blockedIPs.ipAddress, ipAddress));
  }
}

export const storage = db ? new DatabaseStorage() : new DemoStorage();
