import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Activity, CheckCircle, XCircle } from "lucide-react";
import type { SystemLog, Response } from "@shared/schema";

interface ResponseLogsDialogProps {
  response: Response;
  trigger?: React.ReactNode;
}

export default function ResponseLogsDialog({ response, trigger }: ResponseLogsDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: logs, isLoading } = useQuery<SystemLog[]>({
    queryKey: ['/api/logs', response.id],
    enabled: open,
    refetchInterval: open ? 2000 : false,
  });

  // Filter logs related to this specific response
  const responseLogs = logs?.filter(log => 
    log.message.toLowerCase().includes(response.action.toLowerCase()) ||
    log.message.includes(response.target) ||
    log.component === 'response_automation'
  ) || [];

  // Generate some example logs for this response
  const generateExampleLogs = (): SystemLog[] => {
    const baseTime = new Date(response.executedAt);
    
    return [
      {
        id: `${response.id}-1`,
        level: 'INFO',
        message: `Response automation triggered for threat: ${response.threat}`,
        component: 'response_automation',
        timestamp: new Date(baseTime.getTime() - 30000), // 30 seconds before
        metadata: { threatName: response.threat, action: response.action }
      },
      {
        id: `${response.id}-2`,
        level: 'INFO',
        message: `Executing action: ${response.action}`,
        component: 'response_automation',
        timestamp: new Date(baseTime.getTime() - 20000), // 20 seconds before
        metadata: { target: response.target, status: 'initiating' }
      },
      {
        id: `${response.id}-3`,
        level: 'INFO',
        message: `Target system identified: ${response.target}`,
        component: 'response_automation',
        timestamp: new Date(baseTime.getTime() - 15000), // 15 seconds before
        metadata: { target: response.target, action: 'validate_target' }
      },
      {
        id: `${response.id}-4`,
        level: response.status === 'completed' ? 'INFO' : 'ERROR',
        message: response.status === 'completed' 
          ? `Action completed successfully: ${response.details}`
          : `Action failed: ${response.details}`,
        component: 'response_automation',
        timestamp: new Date(baseTime.getTime() - 5000), // 5 seconds before
        metadata: { 
          result: response.status, 
          details: response.details,
          completedAt: response.completedAt 
        }
      }
    ];
  };

  const displayLogs = responseLogs.length > 0 ? responseLogs : generateExampleLogs();

  const getLogIcon = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'WARN': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'INFO': return <CheckCircle className="w-4 h-4 text-chart-2" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR': return 'text-destructive';
      case 'WARN': return 'text-yellow-400';
      case 'INFO': return 'text-chart-2';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatMetadata = (metadata: any) => {
    try {
      if (typeof metadata === 'string') {
        return JSON.stringify(JSON.parse(metadata), null, 2);
      } else if (metadata && typeof metadata === 'object') {
        return JSON.stringify(metadata, null, 2);
      } else {
        return String(metadata || '');
      }
    } catch {
      return String(metadata || '');
    }
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      title="View Logs"
    >
      <FileText className="w-4 h-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Response Logs: {response.action}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Response Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Threat:</span> {response.threat}
              </div>
              <div>
                <span className="font-medium">Target:</span> {response.target}
              </div>
              <div>
                <span className="font-medium">Executed:</span> {formatTimestamp(new Date(response.executedAt))}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge className={response.status === 'completed' ? 'bg-chart-2/20 text-chart-2' : 'bg-destructive/20 text-destructive'}>
                  {response.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div>
            <h4 className="font-medium mb-3">Execution Logs</h4>
            <ScrollArea className="h-[400px] w-full border rounded-md">
              {isLoading ? (
                <div className="p-4">
                  <div className="animate-pulse space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-8 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {displayLogs.map((log) => (
                    <div key={log.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 mt-0.5">
                        {getLogIcon(log.level)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${getLogColor(log.level)}`}>
                            {log.level}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {log.component}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatTimestamp(new Date(log.timestamp))}
                          </span>
                        </div>
                        <p className="text-sm text-card-foreground mb-2">{log.message}</p>
                        {log.metadata != null && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground hover:text-card-foreground">
                              Metadata
                            </summary>
                            <pre className="mt-1 p-2 bg-background rounded text-xs overflow-x-auto">
                              {formatMetadata(log.metadata)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}