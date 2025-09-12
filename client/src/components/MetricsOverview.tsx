import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Ban, FlaskConical, ShieldCheck, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";

interface DashboardMetrics {
  activeThreats: number;
  blockedIPs: number;
  activeSimulations: number;
  responseRate: number;
}

export default function MetricsOverview() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="metrics-loading">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      title: "Active Threats",
      value: metrics?.activeThreats || 0,
      icon: AlertTriangle,
      iconBg: "bg-destructive/20",
      iconColor: "text-destructive",
      trend: { value: "+23%", type: "up" as const },
      trendLabel: "vs last hour"
    },
    {
      title: "Blocked IPs",
      value: metrics?.blockedIPs || 0,
      icon: Ban,
      iconBg: "bg-chart-1/20",
      iconColor: "text-chart-1",
      trend: { value: "-5%", type: "down" as const },
      trendLabel: "vs last hour"
    },
    {
      title: "Simulations Running",
      value: metrics?.activeSimulations || 0,
      icon: FlaskConical,
      iconBg: "bg-chart-3/20",
      iconColor: "text-chart-3",
      trend: { value: "Active", type: "neutral" as const },
      trendLabel: "2h 30m runtime"
    },
    {
      title: "Response Rate",
      value: `${metrics?.responseRate || 0}%`,
      icon: ShieldCheck,
      iconBg: "bg-chart-2/20",
      iconColor: "text-chart-2",
      trend: { value: "+1.2%", type: "up" as const },
      trendLabel: "vs last hour"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="metrics-overview">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend.type === "up" ? TrendingUp : 
                         metric.trend.type === "down" ? TrendingDown : CheckCircle;
        
        return (
          <Card key={index} className="border-border" data-testid={`metric-card-${index}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold text-card-foreground" data-testid={`metric-value-${index}`}>
                    {metric.value}
                  </p>
                </div>
                <div className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  metric.trend.type === "up" ? "bg-destructive/20 text-destructive" :
                  metric.trend.type === "down" ? "bg-chart-2/20 text-chart-2" :
                  "bg-chart-2/20 text-chart-2"
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  {metric.trend.value}
                </span>
                <span className="text-xs text-muted-foreground">{metric.trendLabel}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
