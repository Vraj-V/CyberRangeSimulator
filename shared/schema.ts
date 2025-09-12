import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const threats = pgTable("threats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  severity: text("severity").notNull(), // High, Medium, Low, Critical
  sourceIP: text("source_ip").notNull(),
  targetIP: text("target_ip"),
  status: text("status").notNull().default("active"), // active, resolved, mitigated
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  metadata: jsonb("metadata"), // Additional threat data
});

export const simulations = pgTable("simulations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // phishing, sqli, ddos, malware
  status: text("status").notNull().default("running"), // running, completed, stopped
  targets: integer("targets").notNull(),
  successRate: text("success_rate"),
  duration: integer("duration"), // in minutes
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  config: jsonb("config"), // Simulation configuration
});

export const responses = pgTable("responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(), // block_ip, quarantine, mitigation
  threat: text("threat").notNull(),
  target: text("target").notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  details: text("details"),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  automated: boolean("automated").default(true),
});

export const systemLogs = pgTable("system_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  level: text("level").notNull(), // info, warning, error
  message: text("message").notNull(),
  component: text("component").notNull(), // waf, ids, siem, etc.
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const blockedIPs = pgTable("blocked_ips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ipAddress: text("ip_address").notNull().unique(),
  reason: text("reason").notNull(),
  blockedAt: timestamp("blocked_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
});

// Insert schemas
export const insertThreatSchema = createInsertSchema(threats).omit({
  id: true,
  detectedAt: true,
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
  startedAt: true,
}).extend({
  config: z.any().optional(),
  type: z.string().transform((val) => {
    // Normalize simulation types
    const typeMap: Record<string, string> = {
      'DDoS Attack': 'ddos',
      'SQL Injection': 'sqli',
      'Cross-Site Scripting': 'xss',
      'Phishing': 'phishing',
      'Malware': 'malware'
    };
    return typeMap[val] || val.toLowerCase().replace(/\s+/g, '_');
  }),
  targets: z.number().or(z.string().transform(Number)),
  duration: z.number().optional().or(z.string().transform(Number).optional())
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  executedAt: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  timestamp: true,
});

export const insertBlockedIPSchema = createInsertSchema(blockedIPs).omit({
  id: true,
  blockedAt: true,
});

// Types
export type Threat = typeof threats.$inferSelect;
export type InsertThreat = z.infer<typeof insertThreatSchema>;

export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;

export type Response = typeof responses.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;

export type SystemLog = typeof systemLogs.$inferSelect;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;

export type BlockedIP = typeof blockedIPs.$inferSelect;
export type InsertBlockedIP = z.infer<typeof insertBlockedIPSchema>;
