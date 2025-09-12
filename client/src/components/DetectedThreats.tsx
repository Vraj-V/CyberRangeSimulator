import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, RefreshCw, Ban, Eye, Bug, UserX, Zap, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Threat } from "@shared/schema";

export default function DetectedThreats() {
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: threats, isLoading, refetch } = useQuery<Threat[]>({
    queryKey: ['/api/threats'],
    refetchInterval: 5000,
  });

  const blockIPMutation = useMutation({
    mutationFn: async (threatId: string) => {
      await apiRequest('POST', `/api/threats/${threatId}/block`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/threats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
      toast({
        title: "IP Blocked",
        description: "The malicious IP has been added to the blacklist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to block IP address.",
        variant: "destructive",
      });
    },
  });

  const getThreatIcon = (name: string) => {
    if (name.includes('Malware')) return Bug;
    if (name.includes('Login') || name.includes('Brute Force')) return UserX;
    if (name.includes('DDoS')) return Zap;
    return Bug;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-destructive/20 text-destructive';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-chart-2/20 text-chart-2';
      case 'critical': return 'bg-red-600/20 text-red-400';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-destructive/20 text-destructive';
      case 'resolved': return 'bg-chart-2/20 text-chart-2';
      case 'mitigated': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="border-border" data-testid="detected-threats">
      <CardHeader className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Detected Threats</h3>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" data-testid="button-export-threats">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              data-testid="button-refresh-threats"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
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
        ) : threats && threats.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Threat</TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Severity</TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Source IP</TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Timestamp</TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {threats.map((threat) => {
                  const ThreatIcon = getThreatIcon(threat.name);
                  
                  return (
                    <TableRow 
                      key={threat.id} 
                      className="hover:bg-muted/50 transition-colors"
                      data-testid={`threat-row-${threat.id}`}
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-destructive/20 rounded-lg flex items-center justify-center">
                            <ThreatIcon className="w-4 h-4 text-destructive" />
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">{threat.name}</p>
                            <p className="text-sm text-muted-foreground">{threat.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-mono text-sm">{threat.sourceIP}</TableCell>
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                        {formatTimestamp(threat.detectedAt.toString())}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className={getStatusColor(threat.status)}>
                          {threat.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => blockIPMutation.mutate(threat.id)}
                            disabled={blockIPMutation.isPending}
                            data-testid={`button-block-ip-${threat.id}`}
                            title="Block IP"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedThreat(threat)}
                                data-testid={`button-view-details-${threat.id}`}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl" data-testid={`threat-details-modal-${threat.id}`}>
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-destructive/20 rounded-lg flex items-center justify-center">
                                    {(() => {
                                      const ThreatIcon = getThreatIcon(threat.name);
                                      return <ThreatIcon className="w-4 h-4 text-destructive" />;
                                    })()}
                                  </div>
                                  Threat Details: {threat.name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Threat ID</label>
                                    <p className="font-mono text-sm">{threat.id}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Severity</label>
                                    <div className="mt-1">
                                      <Badge className={getSeverityColor(threat.severity)}>
                                        {threat.severity}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Source IP</label>
                                    <p className="font-mono text-sm">{threat.sourceIP}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Target IP</label>
                                    <p className="font-mono text-sm">{threat.targetIP || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <div className="mt-1">
                                      <Badge className={getStatusColor(threat.status)}>
                                        {threat.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Detected At</label>
                                    <p className="text-sm">{formatTimestamp(threat.detectedAt.toString())}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                                  <p className="text-sm mt-1">{threat.description}</p>
                                </div>
                                {threat.metadata ? (
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Additional Details</label>
                                    <div className="mt-2 p-3 bg-muted rounded-lg">
                                      <pre className="text-xs overflow-x-auto">
                                        {JSON.stringify(threat.metadata as any, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                ) : null}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      blockIPMutation.mutate(threat.id);
                                      setSelectedThreat(null);
                                    }}
                                    disabled={blockIPMutation.isPending}
                                    data-testid={`button-block-ip-modal-${threat.id}`}
                                  >
                                    <Ban className="w-4 h-4 mr-2" />
                                    Block IP Address
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
            <p className="text-muted-foreground">No threats detected</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
