import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AssetFleetDashboard from './pages/AssetFleetDashboard';
import RulForecasterSimulator from './pages/RulForecasterSimulator';
import TelemetryAnalytics from './pages/TelemetryAnalytics';
import { fetchAssets, fetchSummary, fallbackAssets } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('fleet');
  const [assets, setAssets] = useState(fallbackAssets);
  const [summary, setSummary] = useState({
    total_monitored_assets: 5,
    critical_alerts_count: 2,
    warning_degraded_count: 1,
    healthy_nominal_count: 2,
    fleet_average_rul_hours: 816.4
  });
  const [selectedAssetForSim, setSelectedAssetForSim] = useState(fallbackAssets[0]);

  useEffect(() => {
    async function load() {
      const a = await fetchAssets();
      if (a && a.length) setAssets(a);
      const s = await fetchSummary();
      if (s) setSummary(s);
    }
    load();
  }, []);

  const handleSelectAssetForSim = (asset) => {
    setSelectedAssetForSim(asset);
    setActiveTab('forecaster');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar summary={summary} />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'fleet' && (
              <AssetFleetDashboard 
                assets={assets} 
                onSelectAssetForSim={handleSelectAssetForSim} 
              />
            )}
            {activeTab === 'forecaster' && (
              <RulForecasterSimulator 
                initialAsset={selectedAssetForSim} 
              />
            )}
            {activeTab === 'analytics' && (
              <TelemetryAnalytics 
                assets={assets} 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
