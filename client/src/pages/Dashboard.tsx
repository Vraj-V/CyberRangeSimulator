import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MetricsOverview from "@/components/MetricsOverview";
import ActiveSimulations from "@/components/ActiveSimulations";
import DetectedThreats from "@/components/DetectedThreats";
import AutomatedResponses from "@/components/AutomatedResponses";
import RecentActivity from "@/components/RecentActivity";
import SystemStatus from "@/components/SystemStatus";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Connect to WebSocket for real-time updates
  useWebSocket();

  return (
    <div className="flex h-screen bg-background" data-testid="dashboard-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-6" data-testid="dashboard-header">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground mb-2">Dashboard</h2>
            <p className="text-muted-foreground">Real-time overview of active simulations, detected threats, and automated responses.</p>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto scrollbar-thin bg-background" data-testid="dashboard-main">
          <div className="p-8 space-y-8">
            <MetricsOverview />
            <ActiveSimulations />
            <DetectedThreats />
            <AutomatedResponses />
            
            {/* Recent Activity and System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity />
              <SystemStatus />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
