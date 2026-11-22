// Predictive Maintenance API Service

const API_BASE = 'http://localhost:8000';

export const fallbackAssets = [
  {
    asset_id: "ASSET-CNC-101",
    asset_type: "5-Axis CNC Milling Spindle",
    location: "Factory Floor 2 - Precision Machining Bay",
    operational_hours: 4820,
    cycles_completed: 1240,
    temperature_c: 89.4,
    vibration_rms_g: 4.82,
    bearing_pressure_bar: 14.2,
    acoustic_emission_db: 78.5,
    oil_contamination_ppm: 42,
    estimated_rul_hours: 48,
    failure_probability_pct: 87.4,
    maintenance_status: "CRITICAL_ALERT",
    anomalous_feature: "vibration_rms_g",
    recommended_action: "Emergency Spindle Bearing Replacement Required within 48h",
    telemetry_history: [
      { hour: -24, vibration: 3.1, temp: 78.0, rul: 120 },
      { hour: -18, vibration: 3.6, temp: 81.5, rul: 95 },
      { hour: -12, vibration: 4.1, temp: 84.8, rul: 74 },
      { hour: -6, vibration: 4.5, temp: 87.2, rul: 60 },
      { hour: 0, vibration: 4.82, temp: 89.4, rul: 48 }
    ]
  },
  {
    asset_id: "ASSET-TURBINE-04",
    asset_type: "Industrial Gas Turbofan Unit 4",
    location: "Power Generation Station East",
    operational_hours: 12450,
    cycles_completed: 3810,
    temperature_c: 142.1,
    vibration_rms_g: 2.15,
    bearing_pressure_bar: 28.6,
    acoustic_emission_db: 62.0,
    oil_contamination_ppm: 18,
    estimated_rul_hours: 310,
    failure_probability_pct: 24.1,
    maintenance_status: "DEGRADED_WARNING",
    anomalous_feature: "temperature_c",
    recommended_action: "Schedule Thermal Heat Shield Inspection in Next Cycle",
    telemetry_history: [
      { hour: -24, vibration: 1.9, temp: 136.0, rul: 380 },
      { hour: -18, vibration: 2.0, temp: 138.2, rul: 360 },
      { hour: -12, vibration: 2.05, temp: 139.8, rul: 340 },
      { hour: -6, vibration: 2.10, temp: 141.0, rul: 325 },
      { hour: 0, vibration: 2.15, temp: 142.1, rul: 310 }
    ]
  },
  {
    asset_id: "ASSET-PUMP-209",
    asset_type: "High-Pressure Hydraulic Feed Pump",
    location: "Chemical Synthesis Reactor 3",
    operational_hours: 8120,
    cycles_completed: 2900,
    temperature_c: 64.2,
    vibration_rms_g: 1.20,
    bearing_pressure_bar: 18.0,
    acoustic_emission_db: 45.2,
    oil_contamination_ppm: 8,
    estimated_rul_hours: 1240,
    failure_probability_pct: 4.2,
    maintenance_status: "HEALTHY_NOMINAL",
    anomalous_feature: "none",
    recommended_action: "Routine Lubrication Top-up at 1500h",
    telemetry_history: [
      { hour: -24, vibration: 1.18, temp: 63.8, rul: 1264 },
      { hour: -18, vibration: 1.19, temp: 64.0, rul: 1258 },
      { hour: -12, vibration: 1.20, temp: 64.1, rul: 1252 },
      { hour: -6, vibration: 1.20, temp: 64.1, rul: 1246 },
      { hour: 0, vibration: 1.20, temp: 64.2, rul: 1240 }
    ]
  },
  {
    asset_id: "ASSET-COMP-88",
    asset_type: "Centrifugal Gas Compressor",
    location: "Cryogenic Separation Line 1",
    operational_hours: 9640,
    cycles_completed: 3120,
    temperature_c: 108.5,
    vibration_rms_g: 3.95,
    bearing_pressure_bar: 22.4,
    acoustic_emission_db: 81.4,
    oil_contamination_ppm: 56,
    estimated_rul_hours: 84,
    failure_probability_pct: 79.2,
    maintenance_status: "CRITICAL_ALERT",
    anomalous_feature: "acoustic_emission_db",
    recommended_action: "Replace Compressor Seal & Check Impeller Imbalance",
    telemetry_history: [
      { hour: -24, vibration: 3.2, temp: 99.0, rul: 160 },
      { hour: -18, vibration: 3.4, temp: 102.5, rul: 138 },
      { hour: -12, vibration: 3.65, temp: 104.8, rul: 118 },
      { hour: -6, vibration: 3.82, temp: 106.9, rul: 98 },
      { hour: 0, vibration: 3.95, temp: 108.5, rul: 84 }
    ]
  },
  {
    asset_id: "ASSET-MOTOR-55",
    asset_type: "Heavy Induction Drive Motor 250kW",
    location: "Conveyor Logistics Tunnel B",
    operational_hours: 3400,
    cycles_completed: 950,
    temperature_c: 58.0,
    vibration_rms_g: 0.92,
    bearing_pressure_bar: 12.5,
    acoustic_emission_db: 41.0,
    oil_contamination_ppm: 6,
    estimated_rul_hours: 2400,
    failure_probability_pct: 2.1,
    maintenance_status: "HEALTHY_NOMINAL",
    anomalous_feature: "none",
    recommended_action: "Normal Operating Parameter; Continue Telemetry Monitoring",
    telemetry_history: [
      { hour: -24, vibration: 0.91, temp: 57.5, rul: 2424 },
      { hour: -18, vibration: 0.91, temp: 57.8, rul: 2418 },
      { hour: -12, vibration: 0.92, temp: 57.9, rul: 2412 },
      { hour: -6, vibration: 0.92, temp: 58.0, rul: 2406 },
      { hour: 0, vibration: 0.92, temp: 58.0, rul: 2400 }
    ]
  }
];

export async function fetchAssets() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/assets`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (e) {
    return fallbackAssets;
  }
}

export async function fetchSummary() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/telemetry/summary`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (e) {
    return {
      total_monitored_assets: 5,
      critical_alerts_count: 2,
      warning_degraded_count: 1,
      healthy_nominal_count: 2,
      fleet_average_rul_hours: 816.4
    };
  }
}

export async function runPredictRul(sensorData) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sensorData)
    });
    if (!res.ok) throw new Error('Prediction API error');
    return await res.json();
  } catch (e) {
    // Local fallback calculation matching backend model
    const vib_score = Math.max(0.0, (sensorData.vibration_rms_g - 1.0) / 3.0);
    const temp_score = Math.max(0.0, (sensorData.temperature_c - 60.0) / 40.0);
    const pres_score = Math.max(0.0, (sensorData.bearing_pressure_bar - 15.0) / 15.0);
    const acoustic_score = Math.max(0.0, (sensorData.acoustic_emission_db - 45.0) / 35.0);
    const oil_score = Math.max(0.0, (sensorData.oil_contamination_ppm - 10.0) / 50.0);

    const deg_idx = 0.35 * vib_score + 0.25 * temp_score + 0.15 * acoustic_score + 0.15 * oil_score + 0.10 * pres_score;
    const fail_prob = Math.min(99.0, Math.max(1.0, Math.round(deg_idx * 100 * 10) / 10));

    let status = 'HEALTHY_NOMINAL';
    let rul = Math.round(1200 + (100 - fail_prob) * 15);
    let action = 'Nominal operating parameters. Maintain continuous sensor telemetry.';

    if (fail_prob > 70) {
      status = 'CRITICAL_ALERT';
      rul = Math.max(12, Math.round((1.0 - fail_prob / 100) * 500));
      action = 'Immediate technician dispatch required: imminent component failure.';
    } else if (fail_prob > 25) {
      status = 'DEGRADED_WARNING';
      rul = Math.round((1.0 - fail_prob / 100) * 800);
      action = 'Plan maintenance inspection within next scheduled work shift.';
    }

    return {
      estimated_rul_hours: rul,
      failure_probability_pct: fail_prob,
      maintenance_status: status,
      primary_anomalous_feature: vib_score > temp_score ? 'vibration_rms_g' : 'temperature_c',
      recommended_action: action,
      degradation_index: Math.round(deg_idx * 1000) / 1000
    };
  }
}
