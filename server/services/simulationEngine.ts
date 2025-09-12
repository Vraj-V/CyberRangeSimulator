import { storage } from "../storage";
import { type Simulation } from "@shared/schema";

interface SimulationConfig {
  phishing: {
    emailCount: number;
    domains: string[];
    templates: string[];
  };
  sqli: {
    endpoints: string[];
    payloads: string[];
  };
  ddos: {
    requestRate: number;
    duration: number;
    targetPorts: number[];
  };
}

class SimulationEngine {
  private activeSimulations = new Map<string, NodeJS.Timeout>();
  private broadcast: ((data: any) => void) | null = null;

  private config: SimulationConfig = {
    phishing: {
      emailCount: 500,
      domains: ['security-update.com', 'bank-alert.net', 'it-support.org'],
      templates: ['urgent_security', 'fake_login', 'prize_notification']
    },
    sqli: {
      endpoints: ['/api/login', '/api/search', '/api/users', '/api/products'],
      payloads: ["' OR '1'='1", "'; DROP TABLE users; --", "' UNION SELECT * FROM passwords --"]
    },
    ddos: {
      requestRate: 10000,
      duration: 30,
      targetPorts: [80, 443, 8080]
    }
  };

  setBroadcast(broadcast: (data: any) => void) {
    this.broadcast = broadcast;
  }

  async startSimulation(simulation: Simulation) {
    try {
      console.log(`Starting simulation: ${simulation.name}`);

      switch (simulation.type) {
        case 'phishing':
          this.startPhishingSimulation(simulation);
          break;
        case 'sqli':
          this.startSQLISimulation(simulation);
          break;
        case 'ddos':
        case 'DDoS Attack':
          this.startDDoSSimulation(simulation);
          break;
        case 'malware':
          this.startMalwareSimulation(simulation);
          break;
        default:
          console.error(`Unknown simulation type: ${simulation.type}`);
      }

      await storage.createSystemLog({
        level: 'info',
        message: `Simulation started: ${simulation.name}`,
        component: 'simulation_engine',
        metadata: { simulationId: simulation.id, type: simulation.type }
      });
    } catch (error) {
      console.error('Error starting simulation:', error);
      throw error;
    }
  }
    });
  }

  async stopSimulation(simulationId: string) {
    const timeout = this.activeSimulations.get(simulationId);
    if (timeout) {
      clearTimeout(timeout);
      this.activeSimulations.delete(simulationId);
      
      await storage.updateSimulationStatus(simulationId, 'stopped', new Date());
      
      if (this.broadcast) {
        this.broadcast({
          type: 'simulation_stopped',
          data: { id: simulationId }
        });
      }
    }
  }

  private startPhishingSimulation(simulation: Simulation) {
    let emailsSent = 0;
    let successfulClicks = 0;

    const sendPhishingEmail = async () => {
      if (emailsSent >= simulation.targets) {
        await this.completeSimulation(simulation.id, successfulClicks);
        return;
      }

      emailsSent++;
      
      // Simulate random success rate (5-15%)
      if (Math.random() < 0.1) {
        successfulClicks++;
      }

      // Update simulation progress
      const successRate = ((successfulClicks / emailsSent) * 100).toFixed(1);
      
      if (this.broadcast) {
        this.broadcast({
          type: 'simulation_progress',
          data: {
            id: simulation.id,
            progress: (emailsSent / simulation.targets) * 100,
            successRate: `${successRate}%`,
            emailsSent,
            successfulClicks
          }
        });
      }

      // Schedule next email
      const timeout = setTimeout(sendPhishingEmail, Math.random() * 5000 + 1000);
      this.activeSimulations.set(simulation.id, timeout);
    };

    sendPhishingEmail();
  }

  private startSQLISimulation(simulation: Simulation) {
    let attemptsCount = 0;
    let vulnerabilitiesFound = 0;

    const performSQLIAttack = async () => {
      if (attemptsCount >= simulation.targets) {
        await this.completeSimulation(simulation.id, vulnerabilitiesFound);
        return;
      }

      attemptsCount++;
      
      // Simulate finding vulnerabilities (10-20% chance)
      if (Math.random() < 0.15) {
        vulnerabilitiesFound++;
      }

      if (this.broadcast) {
        this.broadcast({
          type: 'simulation_progress',
          data: {
            id: simulation.id,
            progress: (attemptsCount / simulation.targets) * 100,
            attemptsCount,
            vulnerabilitiesFound
          }
        });
      }

      const timeout = setTimeout(performSQLIAttack, Math.random() * 3000 + 500);
      this.activeSimulations.set(simulation.id, timeout);
    };

    performSQLIAttack();
  }

  private startDDoSSimulation(simulation: Simulation) {
    let currentRate = 1000;
    let duration = 0;
    const maxDuration = 45; // 45 minutes

    const escalateDDoS = async () => {
      if (duration >= maxDuration) {
        await this.completeSimulation(simulation.id, currentRate);
        return;
      }

      duration++;
      currentRate = Math.min(currentRate + Math.random() * 500, 15000);

      if (this.broadcast) {
        this.broadcast({
          type: 'simulation_progress',
          data: {
            id: simulation.id,
            progress: (duration / maxDuration) * 100,
            currentRate: `${Math.floor(currentRate)} req/sec`,
            duration: `${duration}m`,
            status: currentRate > 10000 ? 'Escalating' : 'Ramping Up'
          }
        });
      }

      const timeout = setTimeout(escalateDDoS, 60000); // Update every minute
      this.activeSimulations.set(simulation.id, timeout);
    };

    escalateDDoS();
  }

  private startMalwareSimulation(simulation: Simulation) {
    let scannedFiles = 0;
    let threatsDetected = 0;

    const scanForMalware = async () => {
      if (scannedFiles >= simulation.targets) {
        await this.completeSimulation(simulation.id, threatsDetected);
        return;
      }

      scannedFiles++;
      
      // Simulate finding malware (5-10% chance)
      if (Math.random() < 0.08) {
        threatsDetected++;
      }

      if (this.broadcast) {
        this.broadcast({
          type: 'simulation_progress',
          data: {
            id: simulation.id,
            progress: (scannedFiles / simulation.targets) * 100,
            scannedFiles,
            threatsDetected
          }
        });
      }

      const timeout = setTimeout(scanForMalware, Math.random() * 2000 + 500);
      this.activeSimulations.set(simulation.id, timeout);
    };

    scanForMalware();
  }

  private async completeSimulation(simulationId: string, result: number) {
    await storage.updateSimulationStatus(simulationId, 'completed', new Date());
    
    this.activeSimulations.delete(simulationId);
    
    if (this.broadcast) {
      this.broadcast({
        type: 'simulation_completed',
        data: { id: simulationId, result }
      });
    }

    await storage.createSystemLog({
      level: 'info',
      message: `Simulation completed: ${simulationId}`,
      component: 'simulation_engine',
      metadata: { simulationId, result }
    });
  }
}

export const simulationEngine = new SimulationEngine();
