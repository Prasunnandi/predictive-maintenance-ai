import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Waves, 
  Thermometer, 
  Gauge, 
  Volume2, 
  Droplet,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { runPredictRul } from '../services/api';

export default function RulForecasterSimulator({ initialAsset }) {
  const [sensors, setSensors] = useState({
    vibration_rms_g: initialAsset?.vibration_rms_g || 4.82,
    temperature_c: initialAsset?.temperature_c || 89.4,
    bearing_pressure_bar: initialAsset?.bearing_pressure_bar || 14.2,
    acoustic_emission_db: initialAsset?.acoustic_emission_db || 78.5,
    oil_contamination_ppm: initialAsset?.oil_contamination_ppm || 42
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculatePrediction = async () => {
    setLoading(true);
    const result = await runPredictRul(sensors);
    setPrediction(result);
    setLoading(false);
  };

  useEffect(() => {
    calculatePrediction();
  }, [sensors]);

  const handleSliderChange = (field, val) => {
    setSensors(prev => ({
      ...prev,
      [field]: parseFloat(val)
    }));
  };

  const applyPreset = (presetType) => {
    if (presetType === 'healthy') {
      setSensors({
        vibration_rms_g: 0.95,
        temperature_c: 56.0,
        bearing_pressure_bar: 13.0,
        acoustic_emission_db: 42.0,
        oil_contamination_ppm: 5
      });
    } else if (presetType === 'thermal') {
      setSensors({
        vibration_rms_g: 2.10,
        temperature_c: 138.5,
        bearing_pressure_bar: 27.0,
        acoustic_emission_db: 64.0,
        oil_contamination_ppm: 22
      });
    } else if (presetType === 'critical') {
      setSensors({
        vibration_rms_g: 5.20,
        temperature_c: 94.0,
        bearing_pressure_bar: 22.0,
        acoustic_emission_db: 84.0,
        oil_contamination_ppm: 58
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            AI RUL Forecaster & Sensor Degradation Simulator
          </h2>
          <p className="text-xs text-slate-400">
            Simulate real-time sensor anomalies to compute Remaining Useful Life (RUL) and failure probability.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">Load Presets:</span>
          <button
            onClick={() => applyPreset('healthy')}
            className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
          >
            Nominal
          </button>
          <button
            onClick={() => applyPreset('thermal')}
            className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium transition-colors"
          >
            Thermal Degraded
          </button>
          <button
            onClick={() => applyPreset('critical')}
            className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors"
          >
            Critical Imbalance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sensor Sliders Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Live Sensor Telemetry Parameters
            </h3>
            <span className="text-xs text-slate-400 font-mono">Input Features (X)</span>
          </div>

          {/* Vibration RMS Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-cyan-400" />
                Vibration RMS Acceleration
              </label>
              <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {sensors.vibration_rms_g.toFixed(2)} g
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.05"
              value={sensors.vibration_rms_g}
              onChange={(e) => handleSliderChange('vibration_rms_g', e.target.value)}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5g (Baseline)</span>
              <span>2.5g (Alert Threshold)</span>
              <span>6.0g (Catastrophic)</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" />
                Spindle / Core Operating Temperature
              </label>
              <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {sensors.temperature_c.toFixed(1)} °C
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="160"
              step="0.5"
              value={sensors.temperature_c}
              onChange={(e) => handleSliderChange('temperature_c', e.target.value)}
              className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>40°C (Cold)</span>
              <span>85°C (Warning)</span>
              <span>160°C (Overheat)</span>
            </div>
          </div>

          {/* Bearing Hydraulic Pressure Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-400" />
                Bearing Lubrication Hydraulic Pressure
              </label>
              <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {sensors.bearing_pressure_bar.toFixed(1)} bar
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              step="0.5"
              value={sensors.bearing_pressure_bar}
              onChange={(e) => handleSliderChange('bearing_pressure_bar', e.target.value)}
              className="w-full accent-blue-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>8 bar</span>
              <span>18 bar (Nominal)</span>
              <span>35 bar (High Stress)</span>
            </div>
          </div>

          {/* Acoustic Emission Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-purple-400" />
                Ultrasonic Acoustic Emission
              </label>
              <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {sensors.acoustic_emission_db.toFixed(1)} dB
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              step="0.5"
              value={sensors.acoustic_emission_db}
              onChange={(e) => handleSliderChange('acoustic_emission_db', e.target.value)}
              className="w-full accent-purple-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30 dB</span>
              <span>65 dB (Friction)</span>
              <span>95 dB (Micro-Cracking)</span>
            </div>
          </div>

          {/* Oil Contamination Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-rose-400" />
                Oil Particulate Contamination
              </label>
              <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                {sensors.oil_contamination_ppm} ppm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="1"
              value={sensors.oil_contamination_ppm}
              onChange={(e) => handleSliderChange('oil_contamination_ppm', e.target.value)}
              className="w-full accent-rose-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 ppm (Clean)</span>
              <span>30 ppm (Debris Alert)</span>
              <span>80 ppm (Metal Particles)</span>
            </div>
          </div>
        </div>

        {/* Real-time ML Prediction & Root Cause Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Live ML Degradation Output
                </h3>
                <span className="text-[11px] font-mono text-cyan-400/90">Inference: &lt;5ms</span>
              </div>

              {/* RUL Large Display */}
              <div className="text-center p-5 bg-slate-950/80 rounded-xl border border-slate-800/80">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Estimated Remaining Useful Life (RUL)
                </div>
                <div className={`text-4xl font-black font-mono tracking-tight ${
                  prediction?.maintenance_status === 'CRITICAL_ALERT'
                    ? 'text-rose-400'
                    : prediction?.maintenance_status === 'DEGRADED_WARNING'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                }`}>
                  {prediction ? `${prediction.estimated_rul_hours} hrs` : 'Calculating...'}
                </div>
                <div className="text-xs text-slate-400 mt-2 font-mono">
                  Machine Status:{' '}
                  <span className={`font-bold ${
                    prediction?.maintenance_status === 'CRITICAL_ALERT'
                      ? 'text-rose-400'
                      : prediction?.maintenance_status === 'DEGRADED_WARNING'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                  }`}>
                    {prediction?.maintenance_status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Failure Probability Progress */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Degradation Failure Risk</span>
                  <span className="font-bold text-white">{prediction?.failure_probability_pct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      prediction?.maintenance_status === 'CRITICAL_ALERT'
                        ? 'bg-rose-500'
                        : prediction?.maintenance_status === 'DEGRADED_WARNING'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${prediction?.failure_probability_pct || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Explainable Root-Cause Attribution */}
              <div className="mt-5 p-4 bg-slate-950/50 rounded-lg border border-slate-800/60 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Primary Anomaly Attribution (SHAP Proxy)
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-300 font-mono">Highest Driving Feature:</span>
                  <span className="text-cyan-400 font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    {prediction?.primary_anomalous_feature}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  Synthetic index: <strong className="text-white font-mono">{prediction?.degradation_index}</strong> based on non-linear multi-variate regression.
                </div>
              </div>

              {/* Maintenance Prescription */}
              <div className="mt-4 p-4 bg-cyan-950/20 rounded-lg border border-cyan-500/30 text-xs">
                <div className="text-[11px] font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Prescribed Maintenance Action
                </div>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {prediction?.recommended_action}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
