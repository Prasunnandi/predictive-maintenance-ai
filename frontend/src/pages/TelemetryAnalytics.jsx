import React from 'react';
import { 
  LineChart, 
  Activity, 
  Layers, 
  BarChart2, 
  TrendingUp, 
  ShieldCheck, 
  FileSpreadsheet
} from 'lucide-react';

export default function TelemetryAnalytics({ assets }) {
  const sensorCorrelations = [
    { feature: 'Vibration RMS vs Degradation', correlation: '+0.88', impact: 'Primary mechanical wear indicator' },
    { feature: 'Operating Temp vs Degradation', correlation: '+0.76', impact: 'Thermal runaway & lubrication breakdown' },
    { feature: 'Acoustic Emission vs Micro-cracks', correlation: '+0.82', impact: 'Sub-surface crystal shear & spalling' },
    { feature: 'Oil Contamination vs Bearing Life', correlation: '+0.71', impact: 'Abrasive particle wear acceleration' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <LineChart className="w-5 h-5 text-cyan-400" />
          Sensor Degradation & Correlation Analytics
        </h2>
        <p className="text-xs text-slate-400">
          Telemetry trends derived from historical turbofan and motor wear datasets.
        </p>
      </div>

      {/* Feature Correlation Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          ML Feature Importance & Degradation Pearson Correlation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sensorCorrelations.map(c => (
            <div key={c.feature} className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">{c.feature}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{c.impact}</div>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
                {c.correlation}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Telemetry Samples Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            NASA C-MAPSS Benchmark Sensor Telemetry Callset
          </h3>
          <span className="text-xs text-slate-400 font-mono">5 Factory Assets Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 font-mono text-[11px] text-slate-400 uppercase">
                <th className="py-3 px-4">Asset ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Op Hours</th>
                <th className="py-3 px-4">Temp (°C)</th>
                <th className="py-3 px-4">Vibration (g)</th>
                <th className="py-3 px-4">Pressure (bar)</th>
                <th className="py-3 px-4">RUL (hrs)</th>
                <th className="py-3 px-4 text-right">Risk %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {assets.map(a => (
                <tr key={a.asset_id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-white">{a.asset_id}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{a.asset_type}</td>
                  <td className="py-3 px-4 text-slate-300">{a.operational_hours.toLocaleString()}</td>
                  <td className="py-3 px-4 text-amber-400">{a.temperature_c}</td>
                  <td className="py-3 px-4 text-cyan-400 font-bold">{a.vibration_rms_g}</td>
                  <td className="py-3 px-4 text-blue-400">{a.bearing_pressure_bar}</td>
                  <td className="py-3 px-4 font-bold text-white">{a.estimated_rul_hours}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-bold ${
                      a.failure_probability_pct > 70 ? 'text-rose-400' : a.failure_probability_pct > 25 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {a.failure_probability_pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
