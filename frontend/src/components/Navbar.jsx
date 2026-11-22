import React from 'react';
import { Bell, Search, ShieldAlert, Cpu, Radio, Sparkles } from 'lucide-react';

export default function Navbar({ summary }) {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Machinery, Telemetry Sensors, CNCs..."
            className="w-80 bg-slate-800/80 border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded border border-slate-700/40">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Telemetry Stream: Active (MQTT 100Hz)</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            {summary.critical_alerts_count} Critical Alerts
          </div>
          <div className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
            {summary.warning_degraded_count} Warning
          </div>
          <div className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            {summary.healthy_nominal_count} Nominal
          </div>
        </div>

        <div className="h-7 w-[1px] bg-slate-800"></div>

        <button className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
        </button>

        <div className="flex items-center space-x-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-xs font-bold text-cyan-300">
            ME
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-slate-200">Alex Chen</div>
            <div className="text-[10px] text-slate-400">Chief Reliability Engineer</div>
          </div>
        </div>
      </div>
    </header>
  );
}
