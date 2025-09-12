import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FlaskConical, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import type { SystemLog } from "@shared/schema";

export default function RecentActivity() {
  const { data: logs, isLoading } = useQuery<SystemLog[]>({
    queryKey: ['/api/logs'],
    refetchInterval: 10000,
  });

  const getActivityIcon = (component: string, level: string) => {
    if (component.includes('threat')) return Shield;
    if (component.includes('simulation')) return FlaskConical;
    if (level === 'error') return AlertTriangle;
    return CheckCircle;
  };

  const getActivityIconColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-destructive/20 text-destructive';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'info': return 'bg-chart-1/20 text-chart-1';
      default: return 'bg-chart-2/20 text-chart-2';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return time.toLocaleDateString();
  };

  // Take only the first 4 logs for the activity feed
  const recentLogs = logs?.slice(0, 4) || [];

  return (
    <Card className="border-border" data-testid="recent-activity">
      <CardHeader className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentLogs.length > 0 ? (
          <>
            <div className="space-y-4">
              {recentLogs.map((log) => {
                const Icon = getActivityIcon(log.component, log.level);
                const iconColor = getActivityIconColor(log.level);
                
                return (
                  <div key={log.id} className="flex items-start gap-4" data-testid={`activity-${log.id}`}>
                    <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{log.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(log.timestamp.toString())}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <Button 
                variant="ghost" 
                className="text-sm text-primary hover:text-primary/80 transition-colors p-0"
                data-testid="button-view-all-activity"
              >
                View all activity <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
