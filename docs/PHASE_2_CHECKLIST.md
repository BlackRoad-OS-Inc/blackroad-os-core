# Phase 2 Checklist (Planning Only)

## Scope
- Planning artifact only.
- No execution authorized.
- No refactors or design changes.
- Fix scope (when executed later): startup-blocking issues only.

## 1. Python Orchestrator — Isolate & Start
**Env vars (example):**
- PORT_ORCHESTRATOR=10100
- MAX_AGENTS=30000
- ENABLE_BREATH_SYNC=true
- CLOUDFLARE_ACCOUNT_ID=
- CLOUDFLARE_API_TOKEN=

**Canonical start command (example):**
PORT_ORCHESTRATOR=10100 MAX_AGENTS=30000 ENABLE_BREATH_SYNC=true \
python src/orchestrator.py

**Fix scope (future):**
- Resolve blocking syntax/import/runtime errors in:
  - src/orchestrator.py
  - src/blackroad_core/*

## 2. TS Bridge — Isolate & Start
**Env vars (example):**
- PORT_API_GATEWAY=8000
- ORCHESTRATOR_URL=http://localhost:10100

**Canonical start command (example):**
PORT_API_GATEWAY=8000 ORCHESTRATOR_URL=http://localhost:10100 \
tsx src/api/bridge.ts

**Fix scope (future):**
- Resolve blocking runtime issues only (imports, missing globals like WebSocket/fetch).

## 3. End-to-End Smoke (after both start)
**Expected checks (example):**
- curl http://localhost:8000/health
- curl http://localhost:8000/api/status
- curl -X POST http://localhost:8000/api/agents/spawn \
  -H 'Content-Type: application/json' \
  -d '{"role":"test","capabilities":["ping"],"runtime_type":"llm_brain"}'
