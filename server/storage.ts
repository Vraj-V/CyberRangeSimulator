import { threats, simulations, responses, systemLogs, blockedIPs, type Threat, type InsertThreat, type Simulation, type InsertSimulation, type Response, type InsertResponse, type SystemLog, type InsertSystemLog, type BlockedIP, type InsertBlockedIP } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { db } from "./db.js";
import { eq, desc, count, and, gte, lte } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // Threats
  async getThreats(limit = 50): Promise<Threat[]> {
    return await db.select().from(threats).orderBy(desc(threats.detectedAt)).limit(limit);
  }

  async getThreatById(id: string): Promise<Threat | undefined> {
    const [threat] = await db.select().from(threats).where(eq(threats.id, id));
    return threat || undefined;
  }

  async createThreat(threat: InsertThreat): Promise<Threat> {
    const [newThreat] = await db.insert(threats).values(threat).returning();
    return newThreat;
  }

  async updateThreatStatus(id: string, status: string, resolvedAt?: Date): Promise<void> {
    await db.update(threats)
      .set({ status, resolvedAt })
      .where(eq(threats.id, id));
  }

  async getActiveThreatsCount(): Promise<number> {
    const [result] = await db.select({ count: count() })
      .from(threats)
      .where(eq(threats.status, 'active'));
    return result.count;
  }

  // Simulations
  async getSimulations(limit = 50): Promise<Simulation[]> {
    return await db.select().from(simulations).orderBy(desc(simulations.startedAt)).limit(limit);
  }

  async getActiveSimulations(): Promise<Simulation[]> {
    return await db.select().from(simulations).where(eq(simulations.status, 'running'));
  }

  async getSimulationById(id: string): Promise<Simulation | undefined> {
    const [simulation] = await db.select().from(simulations).where(eq(simulations.id, id));
    return simulation || undefined;
  }

  async createSimulation(simulation: InsertSimulation): Promise<Simulation> {
    const [newSimulation] = await db.insert(simulations).values(simulation).returning();
    return newSimulation;
  }

  async updateSimulationStatus(id: string, status: string, completedAt?: Date): Promise<void> {
    await db.update(simulations)
      .set({ status, completedAt })
      .where(eq(simulations.id, id));
  }

  async getActiveSimulationsCount(): Promise<number> {
    const [result] = await db.select({ count: count() })
      .from(simulations)
      .where(eq(simulations.status, 'running'));
    return result.count;
  }

  // Responses
  async getResponses(limit = 50): Promise<Response[]> {
    return await db.select().from(responses).orderBy(desc(responses.executedAt)).limit(limit);
  }

  async getResponseById(id: string): Promise<Response | undefined> {
    const [response] = await db.select().from(responses).where(eq(responses.id, id));
    return response || undefined;
  }

  async createResponse(response: InsertResponse): Promise<Response> {
    const [newResponse] = await db.insert(responses).values(response).returning();
    return newResponse;
  }

  async updateResponseStatus(id: string, status: string, completedAt?: Date): Promise<void> {
    await db.update(responses)
      .set({ status, completedAt })
      .where(eq(responses.id, id));
  }

  // System Logs
  async getSystemLogs(limit = 100): Promise<SystemLog[]> {
    return await db.select().from(systemLogs).orderBy(desc(systemLogs.timestamp)).limit(limit);
  }

  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const [newLog] = await db.insert(systemLogs).values(log).returning();
    return newLog;
  }

  // Blocked IPs
  async getBlockedIPs(): Promise<BlockedIP[]> {
    return await db.select().from(blockedIPs).where(eq(blockedIPs.isActive, true));
  }

  async getBlockedIPsCount(): Promise<number> {
    const [result] = await db.select({ count: count() })
      .from(blockedIPs)
      .where(eq(blockedIPs.isActive, true));
    return result.count;
  }

  async isIPBlocked(ipAddress: string): Promise<boolean> {
    const [result] = await db.select().from(blockedIPs)
      .where(and(
        eq(blockedIPs.ipAddress, ipAddress),
        eq(blockedIPs.isActive, true)
      ));
    return !!result;
  }

  async blockIP(blockedIP: InsertBlockedIP): Promise<BlockedIP> {
    const [newBlockedIP] = await db.insert(blockedIPs).values(blockedIP).returning();
    return newBlockedIP;
  }

  async unblockIP(ipAddress: string): Promise<void> {
    await db.update(blockedIPs)
      .set({ isActive: false })
      .where(eq(blockedIPs.ipAddress, ipAddress));
  }
}

export const storage = new DatabaseStorage();
