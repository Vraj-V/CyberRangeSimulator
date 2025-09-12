import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, FileText, Undo, Shield, Ban, Activity } from "lucide-react";
import ResponseLogsDialog from "./ResponseLogsDialog";
import type { Response } from "@shared/schema";

export default function AutomatedResponses() {
  const { data: responses, isLoading } = useQuery<Response[]>({
    queryKey: ['/api/responses'],
    refetchInterval: 5000,
  });

  const getResponseIcon = (action: string) => {
    if (action.includes('Quarantine')) return Shield;
    if (action.includes('Block IP')) return Ban;
    if (action.includes('Mitigation') || action.includes('Rate Limiting')) return Activity;
    return Shield;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-chart-2/20 text-chart-2';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getThreatColor = (threat: string) => {
    if (threat.includes('Malware')) return 'text-destructive';
    if (threat.includes('Login') || threat.includes('Brute Force')) return 'text-yellow-400';
    if (threat.includes('DDoS')) return 'text-red-400';
    return 'text-muted-foreground';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="border-border" data-testid="automated-responses">
      <CardHeader className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Automated Responses</h3>
          <div className="flex items-center gap-3">
            <Select>
              <SelectTrigger className="w-40" data-testid="select-filter-responses">
                <SelectValue placeholder="All Responses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Responses</SelectItem>
                <SelectItem value="ip-blocking">IP Blocking</SelectItem>
                <SelectItem value="quarantine">Quarantine</SelectItem>
                <SelectItem value="mitigation">Mitigation</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" data-testid="button-configure-responses">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        ) : responses && responses.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Response</TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Threat</TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Target</TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Timestamp</TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {responses.map((response) => {
                  const ResponseIcon = getResponseIcon(response.action);
                  
                  return (
                    <TableRow 
                      key={response.id} 
                      className="hover:bg-muted/50 transition-colors"
                      data-testid={`response-row-${response.id}`}
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-chart-1/20 rounded-lg flex items-center justify-center">
                            <ResponseIcon className="w-4 h-4 text-chart-1" />
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">{response.action}</p>
                            <p className="text-sm text-muted-foreground">{response.details}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className={`font-medium ${getThreatColor(response.threat)}`}>
                          {response.threat}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-mono text-sm">{response.target}</TableCell>
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                        {formatTimestamp(response.executedAt.toString())}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className={getStatusColor(response.status)}>
                          {response.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ResponseLogsDialog
                            response={response}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                data-testid={`button-view-logs-${response.id}`}
                                title="View Logs"
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            }
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-undo-response-${response.id}`}
                            title="Undo Action"
                          >
                            <Undo className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No automated responses recorded</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
