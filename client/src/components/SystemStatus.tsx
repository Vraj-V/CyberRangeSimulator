import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Stethoscope } from "lucide-react";

interface SystemComponent {
  name: string;
  status: 'active' | 'online' | 'processing' | 'updated';
  efficiency: number;
  description: string;
  color: string;
}

export default function SystemStatus() {
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  const systemComponents: SystemComponent[] = [
    {
      name: 'WAF Protection',
      status: 'active',
      efficiency: 98,
      description: '98% efficiency',
      color: 'bg-chart-2'
    },
    {
      name: 'IDS Monitoring',
      status: 'online',
      efficiency: 95,
      description: '95% coverage',
      color: 'bg-chart-2'
    },
    {
      name: 'SIEM Processing',
      status: 'processing',
      efficiency: 78,
      description: '2.3M events/hour',
      color: 'bg-yellow-400'
    },
    {
      name: 'Threat Intelligence',
      status: 'updated',
      efficiency: 100,
      description: 'Last sync: 5 min ago',
      color: 'bg-chart-2'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'online': case 'updated': return 'text-chart-2';
      case 'processing': return 'text-yellow-400';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusDot = (status: string) => {
    const baseClasses = "w-2 h-2 rounded-full";
    switch (status) {
      case 'active': case 'online': case 'updated': 
        return `${baseClasses} bg-chart-2`;
      case 'processing': 
        return `${baseClasses} bg-yellow-400 animate-pulse`;
      default: 
        return `${baseClasses} bg-muted-foreground`;
    }
  };

  const handleRunDiagnostics = () => {
    setIsRunningDiagnostics(true);
    // Simulate diagnostics
    setTimeout(() => {
      setIsRunningDiagnostics(false);
    }, 3000);
  };

  return (
    <Card className="border-border" data-testid="system-status">
      <CardHeader className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">System Status</h3>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {systemComponents.map((component, index) => (
            <div key={index} data-testid={`system-component-${index}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{component.name}</span>
                <span className={`flex items-center gap-2 text-sm ${getStatusColor(component.status)}`}>
                  <div className={getStatusDot(component.status)}></div>
                  <span className="capitalize">{component.status}</span>
                </span>
              </div>
              <Progress 
                value={component.efficiency} 
                className="w-full h-2 mb-1"
                data-testid={`progress-${index}`}
              />
              <div className="text-xs text-muted-foreground">{component.description}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            onClick={handleRunDiagnostics}
            disabled={isRunningDiagnostics}
            data-testid="button-run-diagnostics"
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            {isRunningDiagnostics ? 'Running Diagnostics...' : 'Run Full Diagnostics'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
