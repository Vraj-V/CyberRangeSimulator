import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'new_threat':
            queryClient.invalidateQueries({ queryKey: ['/api/threats'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
            
            toast({
              title: "New Threat Detected",
              description: `${message.data.name} from ${message.data.sourceIP}`,
              variant: "destructive",
            });
            break;

          case 'threat_updated':
            queryClient.invalidateQueries({ queryKey: ['/api/threats'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
            break;

          case 'new_simulation':
            queryClient.invalidateQueries({ queryKey: ['/api/simulations'] });
            queryClient.invalidateQueries({ queryKey: ['/api/simulations/active'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
            
            toast({
              title: "Simulation Started",
              description: `${message.data.name} is now running`,
            });
            break;

          case 'simulation_progress':
            queryClient.invalidateQueries({ queryKey: ['/api/simulations/active'] });
            break;

          case 'simulation_completed':
            queryClient.invalidateQueries({ queryKey: ['/api/simulations'] });
            queryClient.invalidateQueries({ queryKey: ['/api/simulations/active'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
            
            toast({
              title: "Simulation Completed",
              description: "A security simulation has finished",
            });
            break;

          case 'new_response':
            queryClient.invalidateQueries({ queryKey: ['/api/responses'] });
            queryClient.invalidateQueries({ queryKey: ['/api/logs'] });
            
            toast({
              title: "Automated Response",
              description: `${message.data.action} executed successfully`,
            });
            break;

          case 'threat_status_updated':
            queryClient.invalidateQueries({ queryKey: ['/api/threats'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
            break;

          default:
            console.log('Unknown WebSocket message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [queryClient, toast]);

  return wsRef.current;
}
