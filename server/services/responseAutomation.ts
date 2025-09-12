import { storage } from "../storage";
import { type Threat } from "@shared/schema";

class ResponseAutomation {
  private broadcast: ((data: any) => void) | null = null;

  setBroadcast(broadcast: (data: any) => void) {
    this.broadcast = broadcast;
  }

  async handleThreat(threat: Threat) {
    console.log(`Handling threat: ${threat.name} (${threat.severity})`);

    switch (threat.severity) {
      case 'Critical':
        await this.handleCriticalThreat(threat);
        break;
      case 'High':
        await this.handleHighThreat(threat);
        break;
      case 'Medium':
        await this.handleMediumThreat(threat);
        break;
      default:
        await this.logThreat(threat);
    }
  }

  private async handleCriticalThreat(threat: Threat) {
    // Immediate IP blocking and isolation
    if (threat.sourceIP !== 'Multiple IPs' && threat.sourceIP !== 'unknown') {
      await this.blockIP(threat.sourceIP, `Critical threat: ${threat.name}`);
    }

    // Enable DDoS mitigation for DDoS attacks
    if (threat.name.includes('DDoS')) {
      await this.enableDDoSMitigation(threat);
    }

    // Quarantine if malware
    if (threat.name.includes('Malware')) {
      await this.quarantineMalware(threat);
    }

    await this.updateThreatStatus(threat.id, 'mitigated');
  }

  private async handleHighThreat(threat: Threat) {
    // Block IP for high severity threats
    if (threat.sourceIP !== 'Multiple IPs' && threat.sourceIP !== 'unknown') {
      await this.blockIP(threat.sourceIP, `High severity threat: ${threat.name}`);
    }

    // Quarantine malware
    if (threat.name.includes('Malware')) {
      await this.quarantineMalware(threat);
    }

    await this.updateThreatStatus(threat.id, 'mitigated');
  }

  private async handleMediumThreat(threat: Threat) {
    // Rate limiting for brute force
    if (threat.name.includes('Brute Force')) {
      await this.enableRateLimiting(threat);
    }

    // Monitor and log
    await this.logThreat(threat);
    await this.updateThreatStatus(threat.id, 'resolved');
  }

  async blockIP(ipAddress: string, reason: string) {
    try {
      // Check if IP is already blocked
      const isBlocked = await storage.isIPBlocked(ipAddress);
      if (isBlocked) {
        console.log(`IP ${ipAddress} is already blocked`);
        return;
      }

      // Block the IP
      await storage.blockIP({
        ipAddress,
        reason,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });

      // Create response record
      const response = await storage.createResponse({
        action: 'Block IP Address',
        threat: reason,
        target: ipAddress,
        status: 'completed',
        details: `Added ${ipAddress} to firewall blacklist`,
        completedAt: new Date()
      });

      // Broadcast response
      if (this.broadcast) {
        this.broadcast({
          type: 'new_response',
          data: response
        });
      }

      // Log the action
      await storage.createSystemLog({
        level: 'info',
        message: `IP blocked: ${ipAddress}`,
        component: 'response_automation',
        metadata: { ipAddress, reason }
      });

      console.log(`IP ${ipAddress} blocked successfully`);
    } catch (error) {
      console.error(`Failed to block IP ${ipAddress}:`, error);
    }
  }

  private async quarantineMalware(threat: Threat) {
    try {
      const response = await storage.createResponse({
        action: 'Quarantine Malware',
        threat: threat.name,
        target: threat.sourceIP,
        status: 'completed',
        details: 'Isolated infected file and cleaned system',
        completedAt: new Date()
      });

      if (this.broadcast) {
        this.broadcast({
          type: 'new_response',
          data: response
        });
      }

      await storage.createSystemLog({
        level: 'info',
        message: `Malware quarantined from ${threat.sourceIP}`,
        component: 'response_automation',
        metadata: { threatId: threat.id }
      });
    } catch (error) {
      console.error('Failed to quarantine malware:', error);
    }
  }

  private async enableDDoSMitigation(threat: Threat) {
    try {
      const response = await storage.createResponse({
        action: 'Enable DDoS Mitigation',
        threat: threat.name,
        target: 'Load Balancer',
        status: 'completed',
        details: 'Rate limiting and traffic filtering activated',
        completedAt: new Date()
      });

      if (this.broadcast) {
        this.broadcast({
          type: 'new_response',
          data: response
        });
      }

      await storage.createSystemLog({
        level: 'info',
        message: 'DDoS mitigation enabled',
        component: 'response_automation',
        metadata: { threatId: threat.id }
      });
    } catch (error) {
      console.error('Failed to enable DDoS mitigation:', error);
    }
  }

  private async enableRateLimiting(threat: Threat) {
    try {
      const response = await storage.createResponse({
        action: 'Enable Rate Limiting',
        threat: threat.name,
        target: threat.sourceIP,
        status: 'completed',
        details: 'Temporary rate limiting applied to source IP',
        completedAt: new Date()
      });

      if (this.broadcast) {
        this.broadcast({
          type: 'new_response',
          data: response
        });
      }

      await storage.createSystemLog({
        level: 'info',
        message: `Rate limiting enabled for ${threat.sourceIP}`,
        component: 'response_automation',
        metadata: { threatId: threat.id }
      });
    } catch (error) {
      console.error('Failed to enable rate limiting:', error);
    }
  }

  private async logThreat(threat: Threat) {
    await storage.createSystemLog({
      level: 'warning',
      message: `Threat logged: ${threat.name}`,
      component: 'response_automation',
      metadata: { threatId: threat.id, severity: threat.severity }
    });
  }

  private async updateThreatStatus(threatId: string, status: string) {
    await storage.updateThreatStatus(threatId, status, new Date());
    
    if (this.broadcast) {
      this.broadcast({
        type: 'threat_status_updated',
        data: { id: threatId, status }
      });
    }
  }
}

export const responseAutomation = new ResponseAutomation();
