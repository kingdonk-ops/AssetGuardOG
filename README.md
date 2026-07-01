# AssetGuard OG — Asset Integrity Management

Oil & gas asset integrity management platform with corrosion monitoring, risk-based inspection (RBI), remaining life calculation, and real-time alerts.

## Quick Start

```bash
docker compose up -d
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## Features

- **Asset Tracking** — Register and manage pipelines, vessels, tanks, valves, pumps, compressors, heat exchangers, and columns
- **Corrosion Monitoring** — Track thickness measurements and calculate corrosion rates
- **Risk-Based Inspection (RBI)** — Automated risk assessment with prioritization engine
- **Remaining Life Calculation** — Predict asset remaining useful life based on corrosion rates
- **Inspection Scheduling** — Schedule and record inspections with automated next-due calculation
- **Real-Time Alerts** — WebSocket-powered alerts for corrosion criticality, overdue inspections, low remaining life, and risk escalation
- **Dark Theme** — Sleek dark UI with green (#059669) accent

## Architecture

- **Backend:** FastAPI (Python 3.12), SQLAlchemy async, PostgreSQL, JWT auth
- **Frontend:** React 18, TypeScript, Zustand, Vite
- **Infrastructure:** Docker Compose (PostgreSQL + Backend + Frontend)

## RBI Engine

The Risk-Based Inspection agent evaluates:

1. **Corrosion Rate** — Metal loss per year based on original vs current thickness
2. **Remaining Life** — Years until minimum required thickness is reached
3. **Risk Assessment** — Score combining corrosion rate, remaining life, and operating pressure
4. **Prioritization** — Assets ranked by risk score for inspection scheduling
