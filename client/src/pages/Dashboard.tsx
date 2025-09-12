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
            <h2 className="text-2xl font-bold text-card-foreground mb-2">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'simulations' && 'Simulations'}
              {activeTab === 'threats' && 'Threats'}
              {activeTab === 'responses' && 'Automated Responses'}
              {activeTab === 'reports' && 'Reports'}
              {activeTab === 'settings' && 'Settings'}
              {activeTab === 'help' && 'Help'}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === 'dashboard' && 'Real-time overview of active simulations, detected threats, and automated responses.'}
              {activeTab === 'simulations' && 'Manage and monitor security simulations and attack scenarios.'}
              {activeTab === 'threats' && 'View and manage detected security threats and incidents.'}
              {activeTab === 'responses' && 'Review automated security responses and actions taken.'}
              {activeTab === 'reports' && 'Access security reports and analytics.'}
              {activeTab === 'settings' && 'Configure system settings and preferences.'}
              {activeTab === 'help' && 'Get help and documentation for the CyberGuard AI system.'}
            </p>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto scrollbar-thin bg-background" data-testid="dashboard-main">
          <div className="p-8 space-y-8">
            {/* Dashboard View - All Components */}
            {activeTab === 'dashboard' && (
              <>
                <MetricsOverview />
                <ActiveSimulations />
                <DetectedThreats />
                <AutomatedResponses />
                
                {/* Recent Activity and System Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentActivity />
                  <SystemStatus />
                </div>
              </>
            )}
            
            {/* Simulations View */}
            {activeTab === 'simulations' && (
              <>
                <ActiveSimulations />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentActivity />
                  <SystemStatus />
                </div>
              </>
            )}
            
            {/* Threats View */}
            {activeTab === 'threats' && (
              <>
                <DetectedThreats />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentActivity />
                  <SystemStatus />
                </div>
              </>
            )}
            
            {/* Responses View */}
            {activeTab === 'responses' && (
              <>
                <AutomatedResponses />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentActivity />
                  <SystemStatus />
                </div>
              </>
            )}
            
            {/* Reports View */}
            {activeTab === 'reports' && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Reports Coming Soon</h3>
                <p className="text-muted-foreground">Security reports and analytics will be available in a future update.</p>
              </div>
            )}
            
            {/* Settings View */}
            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Settings</h3>
                <p className="text-muted-foreground">System configuration options will be available in a future update.</p>
              </div>
            )}
            
            {/* Help View */}
            {activeTab === 'help' && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Help & Documentation</h3>
                <p className="text-muted-foreground">Help documentation and guides will be available in a future update.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
