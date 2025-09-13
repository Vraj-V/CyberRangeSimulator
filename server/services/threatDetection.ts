import { storage } from "../storage.js";
import { responseAutomation } from "./responseAutomation.js";

interface ThreatPattern {
  name: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  pattern: RegExp | ((data: any) => boolean);
  autoRespond?: boolean;
}

class ThreatDetectionService {
  private isRunning = false;
  private broadcast: ((data: any) => void) | null = null;

  private threatPatterns: ThreatPattern[] = [
    {
      name: 'SQL Injection Attempt',
      description: 'Suspicious SQL injection patterns detected',
      severity: 'High',
      pattern: /('|(--)|;|\||(\*|\*)|(%27)|(%23)|(%3B)|(%2B)|(%40)|(\+)|(\|))/i,
      autoRespond: true
    },
    {
      name: 'Brute Force Attack',
      description: 'Multiple failed login attempts detected',
      severity: 'Medium',
      pattern: (data) => data.failedLogins && data.failedLogins > 5,
      autoRespond: true
    },
    {
      name: 'DDoS Attack',
      description: 'High volume traffic spike detected',
      severity: 'Critical',
      pattern: (data) => data.requestRate && data.requestRate > 1000,
      autoRespond: true
    },
    {
      name: 'Malware Signature',
      description: 'Known malware signature detected',
      severity: 'High',
      pattern: /trojan|virus|malware|backdoor|rootkit/i,
      autoRespond: true
    },
    {
      name: 'Suspicious File Upload',
      description: 'Potentially malicious file uploaded',
      severity: 'Medium',
      pattern: /\.(exe|scr|bat|cmd|com|pif|vbs|js|jar|dll)$/i,
      autoRespond: true
    }
  ];

  setBroadcast(broadcast: (data: any) => void) {
    this.broadcast = broadcast;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Threat detection service started');
    
    // Test database connection before starting simulations
    this.testDatabaseConnection().then((connected) => {
      if (connected) {
        // Simulate threat detection
        this.simulateThreats();
        
        // Log service start
        storage.createSystemLog({
          level: 'info',
          message: 'Threat detection service started',
          component: 'threat_detection'
        }).catch(err => console.log('Failed to log service start:', err.message));
      } else {
        console.log('Database not ready, threat detection will retry in 30 seconds');
        setTimeout(() => this.start(), 30000);
        this.isRunning = false;
      }
    });
  }

  private async testDatabaseConnection(): Promise<boolean> {
    try {
      await storage.getActiveThreatsCount();
      return true;
    } catch (error) {
      console.log('Database connection test failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  stop() {
    this.isRunning = false;
    console.log('Threat detection service stopped');
  }

  private async simulateThreats() {
    if (!this.isRunning) return;

    try {
      // Simulate various threat scenarios
      const scenarios = [
        this.simulateSQLInjection,
        this.simulateBruteForce,
        this.simulateMalwareDetection,
        this.simulateDDoSAttack,
        this.simulateSuspiciousUpload
      ];

      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      await scenario.call(this);
    } catch (error) {
      console.log('Error in threat simulation:', error instanceof Error ? error.message : 'Unknown error');
    }

    // Schedule next threat simulation
    setTimeout(() => this.simulateThreats(), Math.random() * 60000 + 30000); // 30-90 seconds (reduced frequency)
  }

  private async simulateSQLInjection() {
    const sourceIPs = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.10'];
    const sourceIP = sourceIPs[Math.floor(Math.random() * sourceIPs.length)];

    await this.detectThreat({
      name: 'SQL Injection Attempt',
      description: 'Malicious SQL injection detected in login form',
      severity: 'High',
      sourceIP,
      targetIP: '192.168.1.10',
      metadata: {
        payload: "admin' OR '1'='1",
        endpoint: '/api/login',
        userAgent: 'Mozilla/5.0 (compatible; AttackBot/1.0)'
      }
    });
  }

  private async simulateBruteForce() {
    const sourceIPs = ['45.132.200.15', '198.51.100.30', '203.0.113.50'];
    const sourceIP = sourceIPs[Math.floor(Math.random() * sourceIPs.length)];

    await this.detectThreat({
      name: 'Brute Force Attack',
      description: 'Multiple failed authentication attempts',
      severity: 'Medium',
      sourceIP,
      targetIP: '192.168.1.10',
      metadata: {
        attempts: Math.floor(Math.random() * 20) + 10,
        timespan: '5 minutes',
        targetAccount: 'admin'
      }
    });
  }

  private async simulateMalwareDetection() {
    const sourceIPs = ['10.0.0.75', '192.168.1.200', '172.16.0.100'];
    const sourceIP = sourceIPs[Math.floor(Math.random() * sourceIPs.length)];

    await this.detectThreat({
      name: 'Malware Detected',
      description: 'Trojan.Win32.Generic identified',
      severity: 'High',
      sourceIP,
      targetIP: '192.168.1.50',
      metadata: {
        malwareType: 'Trojan',
        fileName: 'document.exe',
        hash: 'a1b2c3d4e5f6789012345678',
        scanEngine: 'ClamAV'
      }
    });
  }

  private async simulateDDoSAttack() {
    await this.detectThreat({
      name: 'DDoS Attack',
      description: 'High volume traffic spike detected',
      severity: 'Critical',
      sourceIP: 'Multiple IPs',
      targetIP: '192.168.1.10',
      metadata: {
        requestRate: '15,000 req/sec',
        attackType: 'HTTP Flood',
        duration: '10 minutes',
        botnetSize: 'Estimated 500+ IPs'
      }
    });
  }

  private async simulateSuspiciousUpload() {
    const sourceIPs = ['192.168.1.150', '10.0.0.200'];
    const sourceIP = sourceIPs[Math.floor(Math.random() * sourceIPs.length)];

    await this.detectThreat({
      name: 'Suspicious File Upload',
      description: 'Potentially malicious executable uploaded',
      severity: 'Medium',
      sourceIP,
      targetIP: '192.168.1.10',
      metadata: {
        fileName: 'update.exe',
        fileSize: '2.5MB',
        uploadPath: '/uploads/',
        virusTotalScore: '3/65'
      }
    });
  }

  private async detectThreat(threatData: any) {
    try {
      const threat = await storage.createThreat(threatData);
      
      // Broadcast new threat
      if (this.broadcast) {
        this.broadcast({
          type: 'new_threat',
          data: threat
        });
      }

      // Log threat detection
      await storage.createSystemLog({
        level: 'warning',
        message: `New threat detected: ${threat.name}`,
        component: 'threat_detection',
        metadata: { threatId: threat.id, severity: threat.severity }
      });

      // Trigger automated response if configured
      if (threatData.severity === 'High' || threatData.severity === 'Critical') {
        await responseAutomation.handleThreat(threat);
      }

      console.log(`Threat detected: ${threat.name} from ${threat.sourceIP}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Failed to process threat: ${errorMessage}`);
      
      // If database connection is lost, stop the service temporarily
      if (errorMessage.includes('CONNECT_TIMEOUT') || errorMessage.includes('connection')) {
        console.log('Database connection lost, pausing threat detection for 60 seconds');
        this.isRunning = false;
        setTimeout(() => this.start(), 60000);
      }
    }
  }

  async analyzeRequest(request: any): Promise<void> {
    // Real implementation would analyze actual requests
    // This is a placeholder for request analysis logic
    for (const pattern of this.threatPatterns) {
      if (typeof pattern.pattern === 'function') {
        if (pattern.pattern(request)) {
          await this.detectThreat({
            name: pattern.name,
            description: pattern.description,
            severity: pattern.severity,
            sourceIP: request.ip || 'unknown',
            targetIP: request.target || 'unknown',
            metadata: request
          });
        }
      } else if (pattern.pattern.test(request.payload || '')) {
        await this.detectThreat({
          name: pattern.name,
          description: pattern.description,
          severity: pattern.severity,
          sourceIP: request.ip || 'unknown',
          targetIP: request.target || 'unknown',
          metadata: request
        });
      }
    }
  }
}

export const threatDetectionService = new ThreatDetectionService();
