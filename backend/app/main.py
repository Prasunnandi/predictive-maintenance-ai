import os
import math
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np

app = FastAPI(
    title="Predictive Maintenance AI & Asset Health Platform",
    description="Industrial IoT Remaining Useful Life (RUL) & Degradation Forecasting Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated in-memory asset database based on NASA C-MAPSS Kaggle Benchmark
ASSET_DATABASE = [
    {
        "asset_id": "ASSET-CNC-101",
        "asset_type": "5-Axis CNC Milling Spindle",
        "location": "Factory Floor 2 - Precision Machining Bay",
        "operational_hours": 4820,
        "cycles_completed": 1240,
        "temperature_c": 89.4,
        "vibration_rms_g": 4.82,
        "bearing_pressure_bar": 14.2,
        "acoustic_emission_db": 78.5,
        "oil_contamination_ppm": 42,
        "estimated_rul_hours": 48,
        "failure_probability_pct": 87.4,
        "maintenance_status": "CRITICAL_ALERT",
        "anomalous_feature": "vibration_rms_g",
        "recommended_action": "Emergency Spindle Bearing Replacement Required within 48h",
        "telemetry_history": [
            {"hour": -24, "vibration": 3.1, "temp": 78.0, "rul": 120},
            {"hour": -18, "vibration": 3.6, "temp": 81.5, "rul": 95},
            {"hour": -12, "vibration": 4.1, "temp": 84.8, "rul": 74},
            {"hour": -6, "vibration": 4.5, "temp": 87.2, "rul": 60},
            {"hour": 0, "vibration": 4.82, "temp": 89.4, "rul": 48}
        ]
    },
    {
        "asset_id": "ASSET-TURBINE-04",
        "asset_type": "Industrial Gas Turbofan Unit 4",
        "location": "Power Generation Station East",
        "operational_hours": 12450,
        "cycles_completed": 3810,
        "temperature_c": 142.1,
        "vibration_rms_g": 2.15,
        "bearing_pressure_bar": 28.6,
        "acoustic_emission_db": 62.0,
        "oil_contamination_ppm": 18,
        "estimated_rul_hours": 310,
        "failure_probability_pct": 24.1,
        "maintenance_status": "DEGRADED_WARNING",
        "anomalous_feature": "temperature_c",
        "recommended_action": "Schedule Thermal Heat Shield Inspection in Next Cycle",
        "telemetry_history": [
            {"hour": -24, "vibration": 1.9, "temp": 136.0, "rul": 380},
            {"hour": -18, "vibration": 2.0, "temp": 138.2, "rul": 360},
            {"hour": -12, "vibration": 2.05, "temp": 139.8, "rul": 340},
            {"hour": -6, "vibration": 2.10, "temp": 141.0, "rul": 325},
            {"hour": 0, "vibration": 2.15, "temp": 142.1, "rul": 310}
        ]
    },
    {
        "asset_id": "ASSET-PUMP-209",
        "asset_type": "High-Pressure Hydraulic Feed Pump",
        "location": "Chemical Synthesis Reactor 3",
        "operational_hours": 8120,
        "cycles_completed": 2900,
        "temperature_c": 64.2,
        "vibration_rms_g": 1.20,
        "bearing_pressure_bar": 18.0,
        "acoustic_emission_db": 45.2,
        "oil_contamination_ppm": 8,
        "estimated_rul_hours": 1240,
        "failure_probability_pct": 4.2,
        "maintenance_status": "HEALTHY_NOMINAL",
        "anomalous_feature": "none",
        "recommended_action": "Routine Lubrication Top-up at 1500h",
        "telemetry_history": [
            {"hour": -24, "vibration": 1.18, "temp": 63.8, "rul": 1264},
            {"hour": -18, "vibration": 1.19, "temp": 64.0, "rul": 1258},
            {"hour": -12, "vibration": 1.20, "temp": 64.1, "rul": 1252},
            {"hour": -6, "vibration": 1.20, "temp": 64.1, "rul": 1246},
            {"hour": 0, "vibration": 1.20, "temp": 64.2, "rul": 1240}
        ]
    },
    {
        "asset_id": "ASSET-COMP-88",
        "asset_type": "Centrifugal Gas Compressor",
        "location": "Cryogenic Separation Line 1",
        "operational_hours": 9640,
        "cycles_completed": 3120,
        "temperature_c": 108.5,
        "vibration_rms_g": 3.95,
        "bearing_pressure_bar": 22.4,
        "acoustic_emission_db": 81.4,
        "oil_contamination_ppm": 56,
        "estimated_rul_hours": 84,
        "failure_probability_pct": 79.2,
        "maintenance_status": "CRITICAL_ALERT",
        "anomalous_feature": "acoustic_emission_db",
        "recommended_action": "Replace Compressor Seal & Check Impeller Imbalance",
        "telemetry_history": [
            {"hour": -24, "vibration": 3.2, "temp": 99.0, "rul": 160},
            {"hour": -18, "vibration": 3.4, "temp": 102.5, "rul": 138},
            {"hour": -12, "vibration": 3.65, "temp": 104.8, "rul": 118},
            {"hour": -6, "vibration": 3.82, "temp": 106.9, "rul": 98},
            {"hour": 0, "vibration": 3.95, "temp": 108.5, "rul": 84}
        ]
    },
    {
        "asset_id": "ASSET-MOTOR-55",
        "asset_type": "Heavy Induction Drive Motor 250kW",
        "location": "Conveyor Logistics Tunnel B",
        "operational_hours": 3400,
        "cycles_completed": 950,
        "temperature_c": 58.0,
        "vibration_rms_g": 0.92,
        "bearing_pressure_bar": 12.5,
        "acoustic_emission_db": 41.0,
        "oil_contamination_ppm": 6,
        "estimated_rul_hours": 2400,
        "failure_probability_pct": 2.1,
        "maintenance_status": "HEALTHY_NOMINAL",
        "anomalous_feature": "none",
        "recommended_action": "Normal Operating Parameter; Continue Telemetry Monitoring",
        "telemetry_history": [
            {"hour": -24, "vibration": 0.91, "temp": 57.5, "rul": 2424},
            {"hour": -18, "vibration": 0.91, "temp": 57.8, "rul": 2418},
            {"hour": -12, "vibration": 0.92, "temp": 57.9, "rul": 2412},
            {"hour": -6, "vibration": 0.92, "temp": 58.0, "rul": 2406},
            {"hour": 0, "vibration": 0.92, "temp": 58.0, "rul": 2400}
        ]
    }
]

class SensorInput(BaseModel):
    temperature_c: float
    vibration_rms_g: float
    bearing_pressure_bar: float
    acoustic_emission_db: float
    oil_contamination_ppm: float

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "Predictive Maintenance AI & RUL Forecaster",
        "model_version": "v2.4-c-mapss"
    }

@app.get("/api/v1/telemetry/summary")
def get_summary():
    total = len(ASSET_DATABASE)
    critical = sum(1 for a in ASSET_DATABASE if a["maintenance_status"] == "CRITICAL_ALERT")
    warning = sum(1 for a in ASSET_DATABASE if a["maintenance_status"] == "DEGRADED_WARNING")
    nominal = sum(1 for a in ASSET_DATABASE if a["maintenance_status"] == "HEALTHY_NOMINAL")
    avg_rul = round(sum(a["estimated_rul_hours"] for a in ASSET_DATABASE) / total, 1)

    return {
        "total_monitored_assets": total,
        "critical_alerts_count": critical,
        "warning_degraded_count": warning,
        "healthy_nominal_count": nominal,
        "fleet_average_rul_hours": avg_rul
    }

@app.get("/api/v1/assets")
def list_assets():
    return ASSET_DATABASE

@app.get("/api/v1/assets/{asset_id}")
def get_asset(asset_id: str):
    asset = next((a for a in ASSET_DATABASE if a["asset_id"].upper() == asset_id.upper()), None)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

@app.post("/api/v1/predict")
def predict_rul(data: SensorInput):
    # Industrial Physics & ML Degradation Model Simulation
    # Baseline nominal parameters: temp=60C, vib=1.0g, pres=15bar, acoustic=45dB, oil=10ppm
    vib_score = max(0.0, (data.vibration_rms_g - 1.0) / 3.0)
    temp_score = max(0.0, (data.temperature_c - 60.0) / 40.0)
    pres_score = max(0.0, (data.bearing_pressure_bar - 15.0) / 15.0)
    acoustic_score = max(0.0, (data.acoustic_emission_db - 45.0) / 35.0)
    oil_score = max(0.0, (data.oil_contamination_ppm - 10.0) / 50.0)

    # Weighted degradation index
    degradation_idx = (
        0.35 * vib_score + 
        0.25 * temp_score + 
        0.15 * acoustic_score + 
        0.15 * oil_score + 
        0.10 * pres_score
    )
    
    failure_probability = min(99.0, max(1.0, round(degradation_idx * 100, 1)))

    if failure_probability > 70.0:
        status = "CRITICAL_ALERT"
        rul_hours = max(12, int((1.0 - (failure_probability / 100.0)) * 500))
        rec_action = "Immediate technician dispatch required: imminent component failure."
    elif failure_probability > 25.0:
        status = "DEGRADED_WARNING"
        rul_hours = int((1.0 - (failure_probability / 100.0)) * 800)
        rec_action = "Plan maintenance inspection within next scheduled work shift."
    else:
        status = "HEALTHY_NOMINAL"
        rul_hours = int(1200 + (100.0 - failure_probability) * 15)
        rec_action = "Nominal operating parameters. Maintain continuous sensor telemetry."

    # Identify primary anomalous feature
    features = {
        "vibration_rms_g": vib_score,
        "temperature_c": temp_score,
        "acoustic_emission_db": acoustic_score,
        "oil_contamination_ppm": oil_score,
        "bearing_pressure_bar": pres_score
    }
    anomalous_feature = max(features, key=features.get)

    return {
        "estimated_rul_hours": rul_hours,
        "failure_probability_pct": failure_probability,
        "maintenance_status": status,
        "primary_anomalous_feature": anomalous_feature,
        "recommended_action": rec_action,
        "degradation_index": round(degradation_idx, 3)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
