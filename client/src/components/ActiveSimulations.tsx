import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Database, Zap } from "lucide-react";
import CreateSimulationDialog from "./CreateSimulationDialog";
import type { Simulation } from "@shared/schema";

export default function ActiveSimulations() {
  const { data: simulations, isLoading } = useQuery<Simulation[]>({
    queryKey: ['/api/simulations/active'],
    refetchInterval: 3000,
  });

  const getSimulationIcon = (type: string) => {
    switch (type) {
      case 'phishing': return Mail;
      case 'sqli': return Database;
      case 'ddos': return Zap;
      default: return Database;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-chart-2/20 text-chart-2';
      case 'escalating': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-muted/20 text-muted-foreground';
      default: return 'bg-chart-2/20 text-chart-2';
    }
  };

  const formatDuration = (startedAt: string) => {
    const start = new Date(startedAt);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  return (
    <Card className="border-border" data-testid="active-simulations">
      <CardHeader className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Active Simulations</h3>
          <CreateSimulationDialog />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : simulations && simulations.length > 0 ? (
          <div className="grid gap-4">
            {simulations.map((simulation) => {
              const Icon = getSimulationIcon(simulation.type);
              const duration = formatDuration(simulation.startedAt.toString());
              
              return (
                <div 
                  key={simulation.id} 
                  className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
                  data-testid={`simulation-${simulation.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-card-foreground">{simulation.name}</h4>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(simulation.status)}`}>
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        {simulation.status === 'running' ? 'Running' : simulation.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Duration: {duration}</span>
                      <span>Target: {simulation.targets}</span>
                      <span>
                        {simulation.type === 'phishing' ? `Success Rate: ${simulation.successRate || '0%'}` :
                         simulation.type === 'sqli' ? `Endpoints: ${simulation.targets}` :
                         simulation.type === 'ddos' ? `Rate: 10k req/sec` :
                         'Status: Running'}
                      </span>
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-accent rounded-lg flex items-center justify-center ml-4">
                    <Icon className="w-8 h-8 text-accent-foreground opacity-50" />
                  </div>
                  <div className="ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      data-testid={`button-view-details-${simulation.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No active simulations</p>
            <div className="mt-4">
              <CreateSimulationDialog isStartFirst={true} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
