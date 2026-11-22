import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Thermometer, 
  Waves, 
  Gauge, 
  Volume2, 
  Wrench,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function AssetFleetDashboard({ assets, onSelectAssetForSim }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'CRITICAL_ALERT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3 mr-1 text-rose-400" />
            CRITICAL ALERT
          </span>
        );
      case 'DEGRADED_WARNING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3 mr-1 text-amber-400" />
            DEGRADED WARNING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
            HEALTHY NOMINAL
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Industrial Equipment Health & Telemetry Fleet
          </h2>
          <p className="text-xs text-slate-400">
            Real-time IoT sensor telemetry, Remaining Useful Life (RUL) estimation, and failure forecasting.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
          Trained on NASA C-MAPSS Turbofan Engine Degradation Dataset
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => {
          const isCritical = asset.maintenance_status === 'CRITICAL_ALERT';
          const isWarning = asset.maintenance_status === 'DEGRADED_WARNING';

          return (
            <div 
              key={asset.asset_id}
              className={`bg-slate-900 rounded-xl border p-5 flex flex-col justify-between transition-all hover:border-slate-700 shadow-sm ${
                isCritical 
                  ? 'border-rose-500/40 bg-gradient-to-b from-slate-900 to-rose-950/10' 
                  : isWarning 
                    ? 'border-amber-500/40' 
                    : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {asset.asset_id}
                  </span>
                  {getStatusBadge(asset.maintenance_status)}
                </div>

                <h3 className="text-base font-bold text-white mt-1">{asset.asset_type}</h3>
                <p className="text-[11px] text-slate-400">{asset.location}</p>

                {/* RUL & Failure Probability Gauge */}
                <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Remaining Useful Life (RUL)</span>
                    <span className={`font-mono font-bold text-base ${
                      isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {asset.estimated_rul_hours} hrs
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Failure Probability</span>
                      <span className="font-mono font-bold text-white">{asset.failure_probability_pct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${asset.failure_probability_pct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Live Sensor Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                  <div className="p-2 bg-slate-950/40 rounded border border-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Waves className="w-3.5 h-3.5 text-cyan-400" /> Vib RMS
                    </span>
                    <span className="font-bold text-white">{asset.vibration_rms_g} g</span>
                  </div>

                  <div className="p-2 bg-slate-950/40 rounded border border-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temp
                    </span>
                    <span className="font-bold text-white">{asset.temperature_c}°C</span>
                  </div>

                  <div className="p-2 bg-slate-950/40 rounded border border-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-blue-400" /> Pressure
                    </span>
                    <span className="font-bold text-white">{asset.bearing_pressure_bar} bar</span>
                  </div>

                  <div className="p-2 bg-slate-950/40 rounded border border-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-purple-400" /> Acoustic
                    </span>
                    <span className="font-bold text-white">{asset.acoustic_emission_db} dB</span>
                  </div>
                </div>

                {/* Recommended Prescription */}
                <div className="mt-3 p-2.5 bg-slate-950/40 rounded border border-slate-800/60 text-xs">
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-cyan-400" /> Maintenance Action
                  </div>
                  <p className="text-slate-300 text-[11px] font-medium leading-tight">{asset.recommended_action}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onSelectAssetForSim(asset)}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Simulate in RUL Forecaster</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
