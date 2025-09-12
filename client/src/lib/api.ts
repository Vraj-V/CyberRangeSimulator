import { apiRequest } from "./queryClient";

export const api = {
  // Dashboard
  getDashboardMetrics: () => fetch('/api/dashboard/metrics').then(res => res.json()),
  
  // Threats
  getThreats: () => fetch('/api/threats').then(res => res.json()),
  blockThreatIP: (threatId: string) => apiRequest('POST', `/api/threats/${threatId}/block`),
  
  // Simulations
  getSimulations: () => fetch('/api/simulations').then(res => res.json()),
  getActiveSimulations: () => fetch('/api/simulations/active').then(res => res.json()),
  createSimulation: (data: any) => apiRequest('POST', '/api/simulations', data),
  
  // Responses
  getResponses: () => fetch('/api/responses').then(res => res.json()),
  
  // System
  getSystemLogs: () => fetch('/api/logs').then(res => res.json()),
  getBlockedIPs: () => fetch('/api/blocked-ips').then(res => res.json()),
};
